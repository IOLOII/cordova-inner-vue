<template>
  <div class="home">
    <img id="imageElement" src="#" alt="等待图片" srcset="">
    <input type="text" v-model="type" placeholder="请输入权限"/>
    <input type="text" v-model="createAndWriteFileurl" placeholder="请输入下载地址"/>
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
        type: 'CAMERA',
        createAndWriteFileurl: '',
      }
    },
    methods: {
      takePhoto() {
        // alert(1)
        cameraTakePicture()
      },
      download() {
        createAndWriteFile(this.createAndWriteFileurl)
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
