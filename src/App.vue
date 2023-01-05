<!--
 * @Author: smilexxy15050618 smilexxy15050618@126.com
 * @Date: 2022-11-17 19:27:00
 * @LastEditors: xingxiaoying 15050628@suning.com
 * @LastEditTime: 2022-11-29 18:35:59
 * @FilePath: /Vue3.0VideoUpload/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px;margin: auto;"
  >
    <el-form-item label="Vid">
      <el-input v-model="formLabelAlign.vid" />
    </el-form-item>
    <el-form-item label="Pid">
      <el-input v-model="formLabelAlign.pid" />
    </el-form-item>
    <!-- 上传 -->
    <el-upload
      class="upload-demo"
      :drag="true"
      action=""
      ref='ruleUpload'
      :limit="1"
      :multiple="true"
      :before-upload="beforeUpload"
      :on-change="onUpload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :auto-upload="false"
      style="max-width: 460px;margin:auto;"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        <em>单击文件上传</em>
      </div>
      <!-- <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template> -->
    </el-upload>
    <div class="demo-progress" style="max-width: 460px;margin:auto;">
      <el-progress :percentage="loadNumber" />
    </div>
    <el-form-item style="margin-top: 20px">
      <el-button type="primary" @click="submitForm"
        >Create</el-button
      >
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>
  </el-form>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAccessToken, postApplyUpload, uploadAjax, fragmentUploadAjax, completeUploadAjax, PostPublishUpload, GetMapping } from './http/index'
const formLabelAlign = ref()
const ruleUpload = ref(null)
formLabelAlign.value = {
  channelId: '253345',
  vid: '',
  pid: '',
  customVid: ''
}

const fpdx = 10*1024*1024 //分片大小
let loadNumber = ref<number>()

const onUpload = async (file: any) =>{
  console.log('file',file)
  const fileSize = file.size
  let zfp = Math.ceil(fileSize / fpdx) //总分片
  if(fileSize < fpdx){
    zfp = 1
  }
  console.log("总分片"+zfp)
  // 获取token
  let res = await getAccessToken();
  if(res.data.result == 1){
    // 申请上传
    let applyUpload = await postApplyUpload(res.data.access_token)
    if(applyUpload.data.result == 1){
      for (let index = 0; index < zfp; index++) {
        const start = index*fpdx //分片结束
        const end =  Math.min(fileSize, start + fpdx) // 分片结束
        const _chunkFile = file.raw.slice(start,end) // 分片文件
        // console.log('_chunkFile',_chunkFile)
        // console.log('start',start)
        // console.log('end',end)
        const formdata = new FormData()
        formdata.append('data', _chunkFile) //分片文件数据
        formdata.append('lastModified', file.uid)  //文件uid
        formdata.append('total', zfp.toString())  //总分片大小
        formdata.append('fileName', file.name)  //文件名称
        formdata.append('index', (index).toString())  //当前分片
        console.log(`"上传第N个分片 ${index}`);
        if(zfp == 1){
          // 上传整片
          let uploadCallBack = await uploadAjax(_chunkFile,applyUpload.data.data)
          if(uploadCallBack.data.result == 1){
            // 上传完成
            let PublishUpload = await PostPublishUpload(res.data.access_token,applyUpload.data.data.upload_token)
            if(PublishUpload.data.result == 1){
              formLabelAlign.value.customVid = PublishUpload.data.data.videoId
            }
          }
        } else {
          // 上传分片
          await fragmentUploadAjax(_chunkFile,index,applyUpload.data.data)
        }
        loadNumber.value = parseFloat((((index+1)/zfp)*100).toFixed(2))
      }
      // 分片上传
      if(zfp > 1){
        // 提交分片
        let completeCallBack = await completeUploadAjax(zfp,applyUpload.data.data)
        if(completeCallBack.data.result == 1){
          // 上传完成
          let PublishUpload = await PostPublishUpload(res.data.access_token,applyUpload.data.data.upload_token)
          if(PublishUpload.data.result == 1){
            formLabelAlign.value.customVid = PublishUpload.data.data.videoId
          }
        }
      }
    }
  }
}


// 超出限制执行的函数
const handleExceed = (files: any) => {
  ElMessage.warning(
    `每次只允许上传一个视频, 您选择了 ${files.length} 个视频，请修改`
  )
}

// 上传成功
const handleSuccess = () => {
  console.log('上传成功')
  formLabelAlign.value = {
    channelId: '253345',
    vid: '',
    pid: '',
    customVid: ''
  }
  // 清空上传文件
  ruleUpload.value.clearFiles()
  loadNumber.value = 0
}


// 创建
const submitForm = async () => {
  console.log('submitForm',formLabelAlign.value)
  if(formLabelAlign.value.vid == '' && formLabelAlign.value.pid==''){
    ElMessage.warning('请填写vid或pid')
  } else if(formLabelAlign.value.vid && formLabelAlign.value.pid){
    alert('vid，pid只能选一个填')
    ElMessage.warning('vid，pid只能选一个填')
  } else if(formLabelAlign.value.customVid == ''){
    ElMessage.warning('请上传视频')
  } else {
    let res = await GetMapping(formLabelAlign.value)
    if(res.data.msg == 'success'){
      ElMessage.success('成功')
      setTimeout(()=>{
        formLabelAlign.value = {
          channelId: '253345',
          vid: '',
          pid: '',
          customVid: ''
        }
        // 清空上传文件
        ruleUpload.value.clearFiles()
        loadNumber.value = 0
      },500)
    }
  }
}

// 重置
const resetForm = () => {
  formLabelAlign.value = {
    channelId: '253345',
    vid: '',
    pid: '',
    customVid: ''
  }

  // 清空上传文件
  ruleUpload.value.clearFiles()
  loadNumber.value = 0
  
  console.log('resetForm',formLabelAlign.value)
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
