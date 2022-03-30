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

function downloadFile() {
  // createAndWriteFile();

  var fileTransfer = new FileTransfer();
  var uri = encodeURI("http://192.168.0.110:9898/app-debug.apk");
  var fileURL = "///storage/emulated/0/DCIM/myFile2";
  // !! Assumes variable fileURL contains a valid URL to a text file on the device,
  //    for example, cdvfile://localhost/persistent/path/to/file.txt

  fileTransfer.download(
    uri,
    fileURL,
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

//文本内容
var tasksStr = "";

/*
 * 从数据库查询数据,写入到指定目录下文件中
 * */
function exportDataFromDb() {
  selectDataFromConcernsDeviceInfos("admin", function (result) {
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        tasksStr = tasksStr + JSON.stringify(result[i]);
      }
      console.log(tasksStr);
      createAndWriteFile();
    } else {
      console.log("no data");
    }
  });
}

/*
 * 打开或创建文件夹,创建文件并写入内容
 * Android:sdcard/xbrother/assets目录
 * IOS:cdvfile://localhost/persistent/xbrother/assets目录
 * 文件目录存在则打开,不存在则创建
 * */
function createAndWriteFile() {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
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
              console.log('创建目录 sdcard/xbrother/assets 成功||目录已存在')
              console.log('subDirEntry success')
              return

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

/*
 * 创建文件夹并保存文件
 * 依次打开指定目录文件夹,读取文件内容
 * Android:sdcard/xbrother/assets/task.json
 * IOS:cdvfile://localhost/persistent/xbrother/assets/task.json
 * 目录和文件存在则打开,不存在则退出
 * */
function getAndReadFile() {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function (fs) {
      console.log("打开的文件系统: " + fs.name);
      fs.root.getDirectory(
        "xbrother",
        { create: false },
        function (dirEntry) {
          dirEntry.getDirectory(
            "assets",
            { create: false },
            function (subDirEntry) {
              subDirEntry.getFile(
                "task.json",
                { create: false, exclusive: false },
                function (fileEntry) {
                  console.log("是否是个文件？" + fileEntry.isFile.toString());
                  fileEntry.name == "task.json";
                  fileEntry.fullPath == "xbrother/assets/task.json";
                  readFile(fileEntry);
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

//将内容数据写入到文件中
function writeFile(fileEntry, dataObj) {
  //创建一个写入对象
  fileEntry.createWriter(function (fileWriter) {
    //文件写入成功
    fileWriter.onwriteend = function () {
      console.log("Successful file write...");
    };

    //文件写入失败
    fileWriter.onerror = function (e) {
      console.log("Failed file write: " + e.toString());
    };

    //写入文件
    fileWriter.write(dataObj);
  });
}

//读取文件
function readFile(fileEntry) {
  fileEntry.file(function (file) {
    var reader = new FileReader();
    reader.onloadend = function () {
      $$("#file_content_info").html(this.result);
      console.log("file read success:" + this.result);
    };
    reader.readAsText(file);
  }, onErrorReadFile);
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

// TODO: 解决文件下载后存储打开显示错误
// http://docs.wex5.com/cordova-plugin-file/
// https://www.hangge.com/blog/cache/detail_1180.html
function downloadImage(t) {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function (fs) {
      console.log("打开的文件系统: " + fs.name);
      var url = "http://www.hangge.com/blog/images/logo.png";
      fs.root.getFile(
        "hangge.png",
        { create: true, exclusive: false },
        function (fileEntry) {
          download(fileEntry, url);
        },
        onErrorCreateFile
      );

      return;
      createDirectory(fs.root);
      fs.root.getDirectory(
        "DaDaoDownloads",
        { create: true },
        function (dirEntry) {
          fs.root.getFile(
            "hangge.png",
            { create: true, exclusive: false },
            function (fileEntry) {
              download(dirEntry, url);
            },
            onErrorCreateFile
          );
        },
        onErrorGetDir
      );
    },
    onErrorLoadFs
  );
}

function createDirectory(rootDirEntry) {
  rootDirEntry.getDirectory(
    "NewDirInRoot",
    { create: true },
    function (dirEntry) {
      dirEntry.getDirectory(
        "images",
        { create: true },
        function (subDirEntry) {
          createFile(subDirEntry, "fileInNewSubDir.txt");
        },
        onErrorGetDir
      );
    },
    onErrorGetDir
  );
}

//下载文件
function download(fileEntry, uri) {
  var fileTransfer = new FileTransfer();
  var fileURL = fileEntry.toURL();

  fileTransfer.download(
    uri,
    fileURL,
    function (entry) {
      console.log("下载成功！");
      console.log("文件保存位置: " + entry.toURL());
    },
    function (error) {
      console.log("下载失败！");
      console.log("error source " + error.source);
      console.log("error target " + error.target);
      console.log("error code" + error.code);
    },
    null, // or, pass false
    {
      //headers: {
      //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //}
    }
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

export { cameraTakePicture, downloadFile, downloadImage,createAndWriteFile };
