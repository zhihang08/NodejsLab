const fs = require('fs'),
      path= require('path');
const targetFolder = 'D:/Project/E-CIBORG_Compliance/E-CIBORG/';
const _rexgx = /.dll/g;

var main = function(){
    return{
        namelist: [],
        walkSync: function(dir, filelist){
            var files = fs.readdirSync(dir);
            filelist = filelist || [];
            var unmatchfilelist = [];
            files.forEach(function(file) {
                if (fs.statSync(dir + file).isDirectory()) {
                    filelist = main.walkSync(dir + file + '/', filelist);
                }
                else if(_rexgx.test(file) && main.namelist.indexOf(file) == -1){
                    filelist.push({
                        "filename": file,
                        "filepath": dir + file
                    });
                    main.namelist.push(file);
                }
                else{
                    unmatchfilelist.push(file);
                }
            });
            return filelist;
        }
    }
}();

