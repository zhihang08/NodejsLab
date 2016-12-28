//inject angular file upload directives and services.
var app = angular.module('ciborgApp', ['ngFileUpload']);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout','$http','$window', function ($scope, Upload, $timeout, $http, $window) {
    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                url: '/api/user/uploads',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        });
    };
    $scope.downloadF = function(){
      try {
        $http({
              url: 'http://localhost:8185/downloadF',
              method: 'GET',
              headers: {
                     Accept: 'application/octet-stream' },
              params: {
                package: "CIBORG.zip"
              }
          })
          .success(function(data){
            //  $window.open('http://localhost:8185/downloadF?package=CIBORG.zip', '_blank');
              // var file = new Blob([data], {type:'application/octet-stream'});
               var fileURL = 'http://localhost:8185/downloadF?package=CIBORG.zip';
              // // URL.createObjectURL(file);
              // var a         = document.createElement('a');
              //  a.href        = fileURL;
              //  a.target      = '_blank';
              //  a.download    = "CIBORG.zip";
              //  document.body.appendChild(a);
              //  a.click();
              //  document.body.removeChild(a);
              var exportFilename = "CIBORG.zip";
              var file = new Blob([data], {type:'application/octet-stream'});
               //IE11 & Edge
               if (navigator.msSaveBlob) {
                   navigator.msSaveBlob(file, exportFilename);
               } else {
                   //In FF link must be added to DOM to be clicked
                   var link = document.createElement('a');
                   link.href = fileURL;
                   link.setAttribute('download', exportFilename);
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
               }
          })
          .error(function(err){
              console.log(err);
          });
      } catch (e) {
        console.log(e);
      }
    }
}]);
