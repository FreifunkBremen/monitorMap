var spawn = require('child_process').spawn;
var config = require('../config/environment');

module.exports = function(fn){
    prozess = spawn('alfred-json', ["-z","-s",config.scanner.socket_alfred,"-r","159"]);
    prozess.stdout.setEncoding('utf8');
    prozess.stderr.setEncoding('utf8');
    var data =''
    var err = false;
    prozess.stdout.on('data', function(adata){
      data=data+''+adata;
    });
    prozess.stderr.on('data', function(data){
      err = true;
    });
    prozess.on('exit', function(exit){
      if(!err && !exit){
        output = JSON.parse(data);
        if(!fn)
          return output;
        fn(output);
      }else {
        if(!fn)
          return;
        fn();
      }

    });
}
