<!--
 * @Author: smilexxy15050618 smilexxy15050618@126.com
 * @Date: 2022-11-17 19:27:00
 * @LastEditors: smilexxy15050618 smilexxy15050618@126.com
 * @LastEditTime: 2022-11-23 10:50:37
 * @FilePath: /Vue3.0VideoUpload/src/components/UploadCom.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-upload
    class="upload-demo"
    :drag="true"
    action=""
    :multiple="true"
    :on-change="onUpload"
    :auto-upload="false"
    style="width: 550px;margin:auto;"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      <em>单击文件上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
  <div class="demo-progress">
    <el-progress :percentage="loadNumber" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { getAccessToken, postApplyUpload, uploadAjax, PostPublishUpload, GetMapping } from '../http/index'
const fpdx = 10*1024*1024 //分片大小
let loadNumber = ref<number>()
const onUpload = async (file: any) =>{
  const fileSize = file.size
  let zfp = Math.ceil(fileSize / fpdx) //总分片
  if(fileSize < fpdx){
    zfp = 1
  }
  console.log("总分片"+zfp)
  for (let index = 0; index < zfp; index++) {
    console.log('----file----',file)
    const start = index*fpdx //分片结束
    const end =  Math.min(fileSize, start + fpdx) // 分片结束
    const _chunkFile = file.raw.slice(start,end) // 分片文件
    const formdata = new FormData()
    formdata.append('data', _chunkFile) //分片文件数据
    formdata.append('lastModified', file.uid)  //文件uid
    formdata.append('total', zfp.toString())  //总分片大小
    formdata.append('fileName', file.name)  //文件名称
    formdata.append('index', (index).toString())  //当前分片
    console.log("上传第N个分片 "+index);
    // 获取token
    let res = await getAccessToken();
    if(res.data.result == 1){
      // 申请上传
      let applyUpload = await postApplyUpload(res.data.access_token)
      if(applyUpload.data.result == 1){
        if(zfp == 1){
          // 分片上传
          let uploadCallBack = await uploadAjax(file,applyUpload.data.data)
          if(uploadCallBack.data.result == 1){
            // 上传完成
            let PublishUpload = await PostPublishUpload(res.data.access_token,applyUpload.data.data.upload_token)
            if(PublishUpload.data.result == 1){
              console.log('PublishUpload',PublishUpload)
              const params = {
                channelId: '253345',
                vid: '',
                pid: '',
                customVid: PublishUpload.data.data.videoId
              }
              await GetMapping(params)
            }
          }
        } else {
          // 整片上传
          
        }
        
      }
    }
    
    loadNumber.value = parseFloat((((index)/zfp)*100).toFixed(2))
  }
}
</script>
<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  margin: auto;
  width: 350px;
}
</style>