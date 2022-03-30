// 打开相机
function cameraTakePicture() {
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
  });

  function onSuccess(imageData) {
    var image = document.getElementById("myImage");
    image.src = "data:image/jpeg;base64," + imageData;
  }

  function onFail(message) {
    alert("Failed because: " + message);
  }
}

/*
 * 打开或创建文件夹,创建文件并写入内容
 * Android:sdcard/xbrother/assets目录
 * IOS:cdvfile://localhost/persistent/xbrother/assets目录
 * 文件目录存在则打开,不存在则创建
 * */
function createAndWriteFile(t) {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    5 * 1024 * 1024,
    function (fs) {
      console.log("打开的文件系统: " + fs.name);
      fs.root.getDirectory(
        "xbrother",
        { create: true },
        function (dirEntry) {
          dirEntry.getDirectory(
            "assets",
            { create: true },
            function (subDirEntry) {
              console.log("创建目录 sdcard/xbrother/assets 成功||目录已存在");
              console.log("subDirEntry success");
              console.log(t);
              if (t) {
                var fileTransfer = new FileTransfer();
                var uri = encodeURI(
                  "http://cordova.apache.org/static/img/cordova_bot.png"
                );
                var fileURL = "///storage/emulated/0/xbrother/assets";

                // var path = cordova.file.dataDirectory; 返回当前项目的文件夹
                // "file:///data/user/0/com.gzdd.ioloii.dev/files/";

                fileTransfer.download(
                  uri,
                  fileURL + "/" + "logo.png",
                  function (entry) {
                    console.log("download complete: " + entry.toURL());
                  },

                  function (error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("download error code" + error.code);

                    // error.code 枚举
                    // 1 =FileTransferError.FILE_NOT_FOUND_ERR
                    // 2 =FileTransferError.INVALID_URL_ERR
                    // 3 =FileTransferError.CONNECTION_ERR
                    // 4 =FileTransferError.ABORT_ERR
                    // 5 =FileTransferError.NOT_MODIFIED_ERR
                  },

                  false,
                  {
                    headers: {
                      // "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    },
                  }
                );
              }

              return;

              subDirEntry.getFile(
                "task.json",
                { create: true, exclusive: false },
                function (fileEntry) {
                  fileEntry.name == "task.json";
                  fileEntry.fullPath == "xbrother/assets/task.json";
                  //文件内容
                  var dataObj = new Blob([tasksStr], { type: "text/plain" });
                  //写入文件
                  writeFile(fileEntry, dataObj);
                },
                onErrorCreateFile
              );
            },
            onErrorGetDir
          );
        },
        onErrorGetDir
      );
    },
    onErrorLoadFs
  );
}

//检查是否打开文件写入
function checkWriteFile() {
  const permissions = window.cordova.plugins.permissions;
  permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, (status) => {
    if (status.hasPermission) {
    } else {
      this.checkWriteFile();
    }
  });
}

//检查是否打开文件读取
function checkReadFile() {
  const permissions = window.cordova.plugins.permissions;
  permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, (status) => {
    if (status.hasPermission) {
      this.openToReadFile();
    } else {
      this.checkReadFile();
    }
  });
}

function checkIOUserPermission(type = "CAMERA") {
  console.log(type);
  var permissions = cordova.plugins.permissions;
  permissions.hasPermission(permissions[type], function (status) {
    if (status.hasPermission) {
      console.log("Yes :D ", type);
    } else {
      console.warn("Storage permission is not turned on");
      console.warn("No :( ", type);
      permissions.requestPermission(
        permissions[type],
        function (status) {
          if (!status.hasPermission) {
            permissionErrorCallback();
          } else {
            // continue with downloading/ Accessing operation
            downloadFile();
          }
        },
        permissionErrorCallback
      );
    }
  });
}

//FileSystem加载失败回调
function onErrorLoadFs(error) {
  console.log("文件系统加载失败！");
}

//文件夹创建失败回调
function onErrorGetDir(error) {
  console.log("文件夹创建失败！");
}

//文件创建失败回调
function onErrorCreateFile(error) {
  console.log("文件创建失败！");
}

//读取文件失败响应
function onErrorReadFile() {
  console.log("文件读取失败!");
}

function permissionErrorCallback(error) {
  console.log("权限校验过程失败！");
}

export { cameraTakePicture, createAndWriteFile, checkIOUserPermission };
