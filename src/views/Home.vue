<template>
  <div class="home">
    <button @click="takePhoto">点击拍照</button>
    <button @click="download(true)">点击下载网络资源到本地</button>
    <button @click="download(false)">点击下载网络资源到本地</button>
  </div>
</template>

<script>
// @ is an alias to /src
import {cameraTakePicture,downloadImage} from '@/plugins/cordovaplugin'
export default {
  name: 'Home',
  components: {
  },
  methods:{
    takePhoto(){
      // alert(1)
      cameraTakePicture()
    },
    download(t){
      downloadImage(t)
    }
  }
}
</script>
