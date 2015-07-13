var spawn = require('child_process').spawn;
var config = require('../../config/environment');

module.exports = function(fn,request){
  if(!request)
    request = "statistics";
  prozess = spawn(__dirname+'/a.out', ["-r", request, "-t",10,"-p",1001,"-d","ff02:0:0:0:0:0:2:1001","-i",config.scanner.ipv6_interface]);
  prozess.stdout.setEncoding('utf8');
  prozess.stderr.setEncoding('utf8');
  var output ='';
  var err = false;
  prozess.stdout.on('data', function(data){
    output = output+data;
  });
  prozess.stderr.on('data', function(data){
    err = true;
  });
  prozess.on('exit', function(exit){
    if(!err && !exit){
      var a = [];
      if(output.length>0){
        output = output.replace(/\}\s*?\{/g,"};$;%;{");
        output = output.split(";$;%;");
        for(var i=0;i<output.length;i++)
          a.push(JSON.parse(output[i]));
      }
      if(!fn)
        return a;
      fn(a);
    }else {
      if(!fn)
        return;
      fn();
    }

  });
}
