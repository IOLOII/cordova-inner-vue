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
function createAndWriteFile(
  url = "http://cordova.apache.org/static/img/cordova_bot.png"
) {
  window.requestFileSystem(
    window.TEMPORARY,
    50 * 1024 * 1024,
    function (fs) {
      console.log("file system open: " + fs.name);

      // Make sure you add the domain name to the Content-Security-Policy <meta> element.
      var url = url;
      // Parameters passed to getFile create a new file or return the file if it already exists.
      download(fs.root, url, true);
      return;
      fs.root.getFile(
        "app-debug.apk",
        { create: true, exclusive: false },
        function (fileEntry) {
          download(fileEntry, url, true);
        },
        onErrorCreateFile
      );
    },
    onErrorLoadFs
  );
}

function download(fileEntry, uri, readBinaryData) {
  var fileTransfer = new FileTransfer();
  var fileURL = fileEntry.toURL();
  console.log(fileURL);
  fileTransfer.download(
    encodeURI(uri),
    fileURL,
    function (entry) {
      console.log("Successful download...");
      console.log("download complete: " + entry.toURL());
      // if (readBinaryData) {
      //   // Read the file...
      //   readBinaryFile(entry);
      // } else {
      //   // Or just display it.
      //   displayImageByFileURL(entry);
      // }
    },
    function (error) {
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      console.log("upload error code" + error.code);
    },
    null, // or, pass false
    {
      //headers: {
      //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //}
    }
  );
}
function readBinaryFile(fileEntry) {
  fileEntry.file(function (file) {
    var reader = new FileReader();

    reader.onloadend = function () {
      console.log("Successful file read: " + this.result);
      // displayFileData(fileEntry.fullPath + ": " + this.result);

      var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
      displayImage(blob);
    };

    reader.readAsArrayBuffer(file);
  }, onErrorReadFile);
}
function displayImage(blob) {
  // Note: Use window.URL.revokeObjectURL when finished with image.
  var objURL = window.URL.createObjectURL(blob);

  // Displays image if result is a valid DOM string for an image.
  var elem = document.getElementById("imageElement");
  elem.src = objURL;
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
