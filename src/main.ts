/**
 *
 * Copyright (c) 2019 Sokcuri All right reserved.
 */

import * as rp from 'request-promise-native';
import * as process from 'process';
const dns = require('dns');
const net = require('net');
const dnsLookup = dns.lookup;

interface DomainOverrideEntry {
	ip: string;
	family: number;
	source: string | RegExp;
	domain: string | RegExp;
}

let domains: DomainOverrideEntry[] = [];

/**
 * Override core DNS lookup function
 */
dns.lookup = function(domain: any, options: any, callback: any) {
	if (arguments.length === 2) {
		callback = options;
		options = {};
	}

	let family = (typeof (options) === 'object') ? options.family : options;
	if (family) {
		family = +family;
		if (family !== 4 && family !== 6) {
			throw new Error('invalid argument: `family` must be 4 or 6');
		}
	}

	for (const entry of domains) {
		if (domain.match(entry.domain)) {
			if (!family || family === entry.family) {
				return callback(null, entry.ip, entry.family);
			}
		}
	}

	return dnsLookup.call(this, domain, options, callback);
};

/**
 * Add a domain to the override list
 *
 * @param domain String or RegExp matching domain
 * @param ip String IPv4 or IPv6
 */

function add(domain: string | RegExp, ip: string) {
	const entry = {} as DomainOverrideEntry;
	entry.ip = ip;

	if (net.isIPv4(entry.ip)) {
		entry.family = 4;
	}
	else if (net.isIPv6(entry.ip)) {
		entry.family = 6;
	}
	else {
		throw new Error('Invalid ip: ' + entry.ip);
	}

	if (domain instanceof RegExp) {
		entry.source = domain;
		entry.domain = domain;
	}
	else {
		entry.source = domain;
		entry.domain = createRegex(domain);
	}

	domains.push(entry);
}

/**
 * Remove a domain from the override list
 *
 * @param domain String or RegExp
 * @param ip String optional, if not set all domains equivalent domain will be removed
 */
function remove(domain: RegExp, ip: string) {
	for (let i = 0; i < domains.length; i++) {
		if (domain instanceof RegExp) {
			if (domains[i].source instanceof RegExp
				&& (domains[i].source as RegExp).source === domain.source
				&& (!ip || ip === domains[i].ip)) {

				domains.splice(i, 1);
				i--;
			}
		}
		else {
			if (domains[i].source === domain && (!ip || ip === domains[i].ip)) {
				domains.splice(i, 1);
				i--;
			}
		}

	}
}

/**
 * Remove all domains from the override list
 */
function clear() {
	domains = [];
}

function createRegex(val: string) {
	const parts = val.split('*');

	for (let i = 0; i < parts.length; i++) {
		parts[i] = regexEscape(parts[i]);
	}

	val = parts.join('.*');
	val = '^' + val + '$';

	return new RegExp(val, 'i');
}

function regexEscape(val: string) {
	return val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const odns = { add, remove, clear, domains };

let count = 1;
async function twimgGetTest(ip: string, method: string) {
	const start = process.hrtime();
	const host = 'pbs.twimg.com';
	odns.add(host, ip);
	try {
		const testPage = 'https://pbs.twimg.com/media/D8VwmjVU0AAwiwR?format=png';
		await rp.default(testPage, {
			method,
			headers: {
				'cache-control': 'private, no-cache, no-store, must-revalidate, max-age=0 Pragma:no-cache',
			},
			resolveWithFullResponse: true,
		});
	} catch (err) {
		console.info(`%s %s  %s`, `[${count++}]`.padEnd(4), ip.toString().padEnd(16), err.message);
		odns.clear();
		return;
	}

	const end = process.hrtime(start);
	return Math.floor(end[0] * 1000 + end[1] / 1000000);
}
async function measureTwimgNode(ip: string, desc: string) {
	const requestElapsedTime = await twimgGetTest(ip, 'GET');
	const payloadElapsedTime = await twimgGetTest(ip, 'HEAD');
	if (desc) {
		desc = 'ㅡ  ' + desc;
	} else {
		desc = '';
	}
	console.info(`%s %s  Request: %s  Payload: %s %s`,
		`[${count++}]`.padEnd(4), ip.toString().padEnd(16),
		(payloadElapsedTime + 'ms').toString().padEnd(8), (requestElapsedTime + 'ms').toString().padEnd(8), desc);
	odns.clear();
}

(async () => {
	odns.clear();
	const nodes = JSON.parse(await rp.default('https://raw.githubusercontent.com/sokcuri/TwimgSpeedPatch/master/data/nodes.json'));

	for (const group of Object.keys(nodes)) {
		console.log(`# ${group}`);
		for (const [ip, desc] of nodes[group]) {
			await measureTwimgNode(ip, desc);
		}
		console.log('------------------------------------------------------------');
	}
})();
