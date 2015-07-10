var spawn = require('child_process').spawn;
var config = require('../../config/environment');

module.exports = function(fn){
  prozess = spawn(__dirname+'/a.out', ["-r", "statistics", "-t",3,"-p",1001,"-d","ff02:0:0:0:0:0:2:1001","-i",config.scanner.ipv6_interface]);
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
      output = output.split(/{"node_id"/);
      for(var i=1;i<output.length;i++)
        a.push(JSON.parse('{"node_id"'+output[i]));
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
