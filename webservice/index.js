var http = require('http');
var sax = require("sax");
var Base64 = require('base64-stream');
var zlib = require('zlib');
var EventEmitter = require('events');


const srv = http.createServer((req, res) => {
  var len = 0;
  var responseWrite = createResponseWrite();
  var root = sax.parser(true);
  var body = sax.parser(true);
  var businessdata = createBusinessParse(responseWrite);
  var maxwritebody = 1000;
  
  responseWrite.writeHead();
  responseWrite.write("<note>SOAP 原始数据:</note>\n");
  soapPaser(root, body, responseWrite);
  bodyParser(body, businessdata);
  
  req.on('data', _write);

  req.on('end', function(d) {
    if (d) _write(d);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    var msg = "\n\n<note>请求长度:"+len+"字符</note>";
  
    responseWrite.on('finish', function() {  
      responseWrite.write('\n\n<note>压缩的数据:</note>\n');
      responseWrite.write(body.ziptxt.join("\n"));
      responseWrite.write(msg);
      responseWrite.writeFoot();
      responseWrite.writeTo(res);
      res.end();
      console.log(msg);
    });
  
    root.close();  
    body.close();
    businessdata.end();
  });

  function _write(d) {
    var s = d.toString('utf8');
    if (len < maxwritebody) {
      responseWrite.write(s.substr(0, maxwritebody));
    }
    console.log(s);
    root.write(s);
    len += s.length;
  } 
});

srv.listen(18889);
console.log("Http server ON", 18889);

process.on('uncaughtException', (err) => {
  console.error(err.stack);
});


function createResponseWrite() {
  var out = new EventEmitter();
  var buf = [];

  out.writeHead = writeHead;
  out.writeFoot = writeFoot;
  
  out.end = function(x) {
    if (x) out.write(x);
    out.emit('finish');
  };

  out.write = function(x) {
    x = x.toString('utf8');
    for (var i=0; i<x.length; ++i) {
      var ch = x[i];
      switch (ch) {
        case '<' : buf.push("&lt;"); break;
        case '>' : buf.push("&gt;"); break;
        case '&' : buf.push("&amp;"); break;
        case '"' : buf.push("&quot;"); break;
        case '\'': buf.push("&apos;"); break;
        default  : buf.push(ch);
      }
    }
  };

  out.writeTo = function(w) {
    buf.forEach(function(t) {
      w.write(t);
    });
  };

  function innerWrite(x) {
    buf.push(x);
  }
return out;

  function writeHead() {
    innerWrite(`<?xml version="1.0" encoding="UTF-8" ?>
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
              <rettext>`);
  }

  function writeFoot() {
    innerWrite(`</rettext>
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
      </XnS0:Envelope>`);
  }
}


function createBusinessParse(out) {
  var b64 = new Base64.Decode();
  var z = zlib.createGunzip();
  b64.on('finish', function() {
    //console.log("b64 fi");
  });
  z.on('finish', function() {
    //console.log("z fi");
    out.end();
  });
  z.pipe(out);
  b64.pipe(z);
  return b64;
}


function bodyParser(body, businessdata) {
  var tagname = null;
  var ziptxt = [];
  var zipmaxline = 10;
  
  body.inbusinessdata = false;
  
  body.onopentag = function(tag, attributes) {
    tagname = tag.name;
  };

  body.ontext = function(txt) {
    if (tagname == 'businessdata') {
      body.inbusinessdata = true;
      if (ziptxt.length > zipmaxline) {
        return;
      }
    
      for (var i=0; i<txt.length; i+=80) {
        if (ziptxt.length > zipmaxline) {
          ziptxt.push("\n------ 数据超限, 被截断");
          break;
        }
        var sub = txt.substr(i, 80);
        //
        // 不完整的写入 gzip 数据会让他抛出数据结尾异常.
        //
        businessdata.write(sub);
        ziptxt.push(sub);
      }
    }
  };

  body.onend = function() {
    tagname = null;
    body.inbusinessdata = false;
  };

  body.ziptxt = ziptxt;
}


function soapPaser(xml, body, responseWrite) {
  var tagname, fnname;
  
  xml.onopentag = function(tag, attributes) {
    if (tagname == 'soap:Body') {
      responseWrite.write("\n\n<note>解码后的 businessdata</note>");
      fnname = tag.name;
    }
    tagname = tag.name;
  };

  xml.ontext = function(txt) {
    if (tagname == fnname) {
      body.write(txt);
    }
  };

  xml.onend = function() {
    tagname = null;
  };
}