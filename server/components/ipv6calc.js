function hex2dec(val){
  return parseInt("0x"+val);
}

function dec2hex(val){
  var str="";
  var minus=false;
  if(val<0){minus=true;val*=-1;}
  val=Math.floor(val);
  while(val>0){
    var v=val%16;
    val/=16;val=Math.floor(val);
    switch(v){
      case 10:v="a";break;
      case 11:v="b";break;
      case 12:v="c";break;
      case 13:v="d";break;
      case 14:v="e";break;
      case 15:v="f";break;
    }
    str=v + str;
  }
  if(str=="")str="0";
  if(minus)str="-"+str;
  return str;
}

function dec2hexlen(val,minlen){
  var str=dec2hex(val);
  while(str.length<minlen)str="0"+str;
  return str;
}

function ip6null(){
  var ar=new Array;
  for(var i=0;i<8;i++)ar[i]=0;
  return ar;
}
function parseIp6(str){
  var ar=new Array;
  for(var i=0;i<8;i++)ar[i]=0;
  if(str=="::")return ar;
  var sar=str.split(':');
  var slen=sar.length;
  if(slen>8)slen=8;
  var j=0;
  for(var i=0;i<slen;i++){
    if(i && sar[i]==""){j=9-slen+i;continue;}
    ar[j]=parseInt("0x0"+sar[i]);
    j++;
  }

  return ar;
}

function ip6toString(ar){
  var str="";
  var zs=-1,zsf=-1;
  var zl=0,zlf=0;
  var md=0;
  for(var i=0;i<8;i++){
    if(md){
      if(ar[i]==0)zl++;
      else md=0;
    }else{
      if(ar[i]==0){zs=i;zl=1;md=1;}
    }
    if(zl>2 && zl>zlf){zlf=zl;zsf=zs;}
  }
  for(var i=0;i<8;i++){
    if(i==zsf){
      str+=":";
      i+=zlf-1;
      if(i>=7)str+=":";
      continue;
    }
    if(i)str+=":";
    str+=dec2hex(ar[i]);
  }
  return str;
}
function ip6prefixToMask(prf){
  var ar=new Array;
  for(var i=0;i<8;i++){
    if(prf>=16)ar[i]=0xffff;
    else switch(prf){
      case 1:ar[i]=0x8000;break;
      case 2:ar[i]=0xc000;break;
      case 3:ar[i]=0xe000;break;
      case 4:ar[i]=0xf000;break;
      case 5:ar[i]=0xf800;break;
      case 6:ar[i]=0xfc00;break;
      case 7:ar[i]=0xfe00;break;
      case 8:ar[i]=0xff00;break;
      case 9:ar[i]=0xff80;break;
      case 10:ar[i]=0xffc0;break;
      case 11:ar[i]=0xffe0;break;
      case 12:ar[i]=0xfff0;break;
      case 13:ar[i]=0xfff8;break;
      case 14:ar[i]=0xfffc;break;
      case 15:ar[i]=0xfffe;break;
      default:ar[i]=0;break;
    }
    prf-=16;
  }
  return ar;
}
function ip6mask(ip,prf){
  if(typeof(prf)=="number")prf=ip6prefixToMask(prf);
  var ip2=new Array;
  for(var i=0;i<8;i++)ip2[i] = ip[i] & prf[i];
  return ip2;
}

function ip6maskHost(ip,prf){
  if(typeof(prf)=="number")prf=ip6prefixToMask(prf);
  else prf=ip6copy(prf);
  for(var i=0;i<8;i++)prf[i]=(~prf[i])&0xffff;
  var ip2=new Array;
  for(var i=0;i<8;i++)ip2[i] = ip[i] & prf[i];
  return ip2;
}
function ip6copy(ip){
  var r=new Array;
  for(var i=0;i<8;i++)r[i]=ip[i];
  return r;
}
function ip6merge(net,host,prefix){
  net=ip6mask(net,prefix);
  host=ip6maskHost(host,prefix);
  for(var i=0;i<8;i++)net[i] |= host[i];
  return net;
}
function extractmac(ip6,strsplit){
  if((ip6[5]&0xff)!=0xff || (ip6[6]>>8)!=0xfe)return;
  var mac=dec2hexlen((ip6[4]>>8)^2,2)+strsplit;
  mac+=dec2hexlen(ip6[4]&0xff,2)+strsplit;
  mac+=dec2hexlen(ip6[5]>>8,2)+strsplit;
  mac+=dec2hexlen(ip6[6]&0xff,2)+strsplit;
  mac+=dec2hexlen(ip6[7]>>8,2)+strsplit;
  mac+=dec2hexlen(ip6[7]&0xff,2);
  return mac;
}
function mactoeui(value){
  var mac=value.replace(/:/g,"-").split("-");
  if(mac.length!=6){return;}
  var ip6=ip6null();
  ip6[4]=hex2dec(mac[0])<<8 | hex2dec(mac[1]);
  ip6[4] ^= 0x200;
  ip6[5]=hex2dec(mac[2])<<8 | 0xff;
  ip6[6]=hex2dec(mac[3]) | 0xfe00;
  ip6[7]=hex2dec(mac[4])<<8 | hex2dec(mac[5]);
  return ip6toString(ip6);
}
function _toMAC(value,strsplit){
  if(!strsplit)
    strsplit = ':';
  return extractmac(parseIp6(value),strsplit);
}
function _toIPv6(prefix,mac,prf){
  if(!mac)
    return mactoeui(prefix);
  else{
    if(!prf)
      prf=64;
    return ip6toString(ip6merge(parseIp6(prefix),parseIp6(mactoeui(mac)),parseInt(prf)));
  }
}
function _fromIPv6(ip6,prf){
  if(!prf)
    prf=64;
  ip=parseIp6(ip6);
  prf =parseInt(prf);
  return {
    net:ip6toString(ip6mask(ip,prf)),
    host:ip6toString(ip6maskHost(ip,prf)),
    mac:_toMAC(ip6)
  }
}
module.exports = {toMAC:_toMAC,toIPv6:_toIPv6,fromIPv6:_fromIPv6};
