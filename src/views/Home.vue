<template>
  <div class="home">
    <input type="text" v-model="type" placeholder="请输入权限"/>
    <button @click="takePhoto">点击拍照</button>
    <button @click="download(true)">点击下载网络资源到本地</button>
    <button @click="createFolder">创建文件夹</button>
    <button @click="checkPermission">校验权限</button>
  </div>
</template>

<script>
  // @ is an alias to /src
  import {
    cameraTakePicture,
    // downloadImage,
    createAndWriteFile,
    checkIOUserPermission
  } from '@/plugins/cordovaplugin'
  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        type: 'CAMERA'
      }
    },
    methods: {
      takePhoto() {
        // alert(1)
        cameraTakePicture()
      },
      download() {
        createAndWriteFile(true)
      },
      createFolder() {
        createAndWriteFile(false)
      },
      checkPermission() {
        console.log(this.type)
        checkIOUserPermission(this.type)
      }
    }
  }
</script>
