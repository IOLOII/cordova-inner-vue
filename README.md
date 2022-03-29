# cordova-inner-vue

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

配置文件
https://www.thinbug.com/q/30042088

```sh
# https://www.w3cschool.cn/cordova/cordova_file_transfer.html
cordova plugin add cordova-plugin-camera
# cordova plugin add cordova-plugin-file-transfer 有错误
# transfer 会自动安装cordova-plugin-file
cordova plugin add https://github.com/apache/cordova-plugin-file-transfer
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-custom-config
# 用法示例 https://www.npmjs.com/package/cordova-custom-config#android-example


cordova platform add android
Using cordova-fetch for cordova-android@^10.1.1
Adding android project...
Creating Cordova project for the Android platform:

gradle --warning-mode all
```
正常配置外 常见问题 多数是因为 AndroidManifest 的配置问题

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RAISED_THREAD_PRIORITY" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.REORDER_TASKS" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.FLASHLIGHT" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
<uses-permission android:name="com.android.permission.GET_INSTALLED_APPS" />
<uses-permission android:name="android.permission.READ_LOGS" />
<uses-feature android:name="android.support.multidex.MultiDexApplication" android:required="false" />
<uses-feature android:name="android.hardware.camera" />
```
```xml
<edit-config file="AndroidManifest.xml" mode="merge" target="/manifest/uses-permission" xmlns:android="http://schemas.android.com/apk/res/android">

</edit-config>
```

<widget id="com.gzdd.ioloii.dev" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0" xmlns:android="http://schemas.android.com/apk/res/android">



```sh
允许意图
控制允许应用程序要求系统打开哪些 URL。默认情况下，不允许使用任何外部 URL。

属性（类型）
仅适用于平台：
| 说明 ————————— | ————href(字符串) | 必需
定义允许应用程序要求系统打开哪些 URL。有关详细信息，请参阅 cordova-plugin-whitelist cordova-plugin-whitelist。
```

> Q:
Issue with Whitelist class
cordova-plugin-file-transfer for Cordova Android 10
https://github.com/apache/cordova-plugin-file-transfer/issues/316