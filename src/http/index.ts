/*
 * @Author: smilexxy15050618 smilexxy15050618@126.com
 * @Date: 2022-11-17 19:27:00
 * @LastEditors: xingxiaoying 15050628@suning.com
 * @LastEditTime: 2022-11-29 18:28:47
 * @FilePath: /Vue3.0VideoUpload/src/http/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { ref } from 'vue'

const json = ref("/json")
//const http = ref("http://192.168.1.101")

const http = ref("/oauth2") //前端配置了跨域的话则为这个


// export const getFlowers = (parms: {}) => {
//     console.log(parms);
//     return axios.post(http.value + '/HIV/Article/UploadVideo', parms)
// }
// 获取token
export const getAccessToken = () => {
    // return axios.get("/api/oauth2/access_token?app_id=ks677510272632699148&app_secret=WXjAcWmNKOcOvhx5ZWAagw&grant_type=client_credentials")
    return axios.get("http://10.200.148.186:9094/ksAccessToken?app_id=ks677510272632699148&app_secret=WXjAcWmNKOcOvhx5ZWAagw&grant_type=client_credentials")
}

// 申请上传
export const postApplyUpload = (parms: string) => {
    // return axios.post(`/api/openapi/mp/developer/video/upload/apply?app_id=ks677510272632699148&access_token=${parms}`)
    return axios.post(`http://10.200.148.186:9094/ksApply?app_id=ks677510272632699148&access_token=${parms}`)
}
// 上传图片-整片上传
export const uploadAjax = (formdata: any, params: any) => {
    
    return axios({
        method: 'post',
        url: `http://${params.endpoint}/api/upload?upload_token=${params.upload_token}`,
        data: formdata,
        headers: {
          'Content-Type': '-',
        }
    })
}

// 上传图片-分片上传
export const fragmentUploadAjax = (formdata: any, index: any, params: any) => {
    
    return axios({
        method: 'post',
        url: `http://${params.endpoint}/api/upload/fragment?fragment_id=${index}&upload_token=${params.upload_token}`,
        data: formdata,
        headers: {
            'Content-Type': 'application/binary',
        }
    })
}

// 上传图片-提交分片
export const completeUploadAjax = (fragment_count: any, params: any) => {
    
    return axios.post(`http://${params.endpoint}/api/upload/complete?fragment_count=${fragment_count}&upload_token=${params.upload_token}`)
}

// 上传完成
export const PostPublishUpload = (access_token: string, upload_token: string) => {
    // return axios.post(`/api/openapi/mp/developer/video/upload/publish?app_id=ks677510272632699148&access_token=${access_token}&upload_token=${upload_token}`)
    return axios.post(`http://10.200.148.186:9094/ksPublish?app_id=ks677510272632699148&access_token=${access_token}&upload_token=${upload_token}`)
}

// 渠道上传视频返回id映射回调
export const GetMapping = (params: any) => {

    return axios.get(`https://coapi.pptv.com/coapi-web/api/vid/mapping/callback?channelId=${params.channelId}&vid=${params.vid}&pid=${params.pid}&customVid=${params.customVid}`)
}
