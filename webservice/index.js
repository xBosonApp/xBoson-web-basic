var http = require('http');


function outputxml(msg) {
return`<?xml version="1.0" encoding="UTF-8" ?>
<XnS0:Envelope xmlns:XnS0="http://www.w3.org/2003/05/soap-envelope">
<XnS0:Body>
  <messages xmlns="http://www.neusoft.com/hit/rhin">
    <switchset>
      <visitor>
        <sourceorgan>22位卫计委机构编码</sourceorgan>
        <sourcedomain>NRHPT00002（区域平台接入系统编码）</sourcedomain>
      </visitor>
      <serviceinf>
        <servicecode/>
      </serviceinf>
      <provider>
        <targetorgan>数据上传方22位机构编码</targetorgan>
        <targetdomain>数据上传方10位接入系统编码</targetdomain>
      </provider>
      <route/>
      <process/>
      <switchmessage>
        <messagecode></messagecode>
        <messagetext>异常描述</messagetext>
      </switchmessage>
    </switchset>
    <business>
      <standardcode>交换标准编码</standardcode>
      <datacompress>0</datacompress>
      <returnmessage>
        <retcode>1</retcode>
        <rettext>结果: `+ msg +`</rettext>
      </returnmessage>
      <businessdata/>
      <returnset>
        <rettotal>1</rettotal>
        <retpaging>0</retpaging>
        <retpageindex/>
        <retpageset/>
      </returnset>
    </business>
  </messages>
</XnS0:Body>
</XnS0:Envelope>`;
}

const srv = http.createServer((req, res) => {
  var len = 0;
  
  req.on('data', function(d) {
    s = d.toString('utf8');
    len += s.length;
  });

  req.on('end', function() {
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    var msg = "请求长度:"+len+"字符";
    res.end(outputxml(msg));
    console.log(msg);
  });
});

srv.listen(18889);
console.log("Http server ON", 18889);
