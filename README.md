# twimg-mon
트위터 이미지 서버(pbs.twimg.com)의 알려진 노드들에 요청을 보내 각 노드의 상태를 확인하고 리퀘스트 시간을 측정하기 위해 만들었습니다

[트위터 이미지 속도 패치](https://github.com/sokcuri/TwimgSpeedPatch)의 트위터 이미지 노드 모니터링을 위해 쓰입니다

twimg-mon에서 모니터링하는 노드들은 [TwimgSpeedPatch 리포지토리](https://github.com/sokcuri/TwimgSpeedPatch/blob/master/data/nodes.json)에서 확인할 수 있습니다

* [ThreatCrowd DNS Tools](https://www.threatcrowd.org/domain.php?domain=pbs.twimg.com)의 DNS Resolvers 섹션을 참고했습니다
* [node-evil-dns](https://github.com/JamesHight/node-evil-dns) 라이브러리를 참고해 Node.js의 DNS Resolver를 오버라이드했습니다

최근 업데이트 : 2019-06-16

PR 환영합니다 '-^/

## Usage
```bash
npm install
npm start
```

## Example
```
# twimg-kr-nodes
[1]  117.18.237.70     Request: 398ms     Payload: 2481ms   ㅡ  EDGECAST-APAC (cs45.wac.edgecastcdn.net)
[2]  192.229.237.96    Request: 412ms     Payload: 1032ms   ㅡ  EDGECAST-NETBLK-08
------------------------------------------------------------
# twimg-nodes
[3]  93.184.220.70     Request: 1318ms    Payload: 6877ms
[4]  23.208.217.88     Request: 619ms     Payload: 1487ms
[5]  23.1.106.237      Request: 80ms      Payload: 451ms
[6]  184.31.10.237     Request: 107ms     Payload: 386ms
[7]  151.101.44.159    Request: 704ms     Payload: 5326ms
[8]  23.1.99.237       Request: 632ms     Payload: 1586ms
[9]  151.101.184.159   Request: 552ms     Payload: 5308ms
[10] 151.101.120.159   Request: 1058ms    Payload: 8810ms
[11] 151.101.36.159    Request: 1119ms    Payload: 10107ms
[12] 151.101.48.159    Request: 499ms     Payload: 1507ms
[13] 184.31.3.237      Request: 614ms     Payload: 1801ms
[14] 151.101.52.159    Request: 431ms     Payload: 1536ms
[15] 72.21.91.70       Request: 768ms     Payload: 1580ms
------------------------------------------------------------
```

* twimg-kr-nodes는 한국 리전 CDN 노드로 확인된 서버입니다
* Request: HEAD 메소드로 보내고 받은 시간을 측정
* Payload: GET 메소드로 보내고 페이로드까지 받은 시간을 측정

## License
* [node-evil-dns](https://github.com/JamesHight/node-evil-dns)
```
Copyright 2013 James Hight

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
