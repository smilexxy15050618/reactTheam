/*
 * @Author: smilexxy15050618 smilexxy15050618@126.com
 * @Date: 2022-11-17 19:27:00
 * @LastEditors: smilexxy15050618 smilexxy15050618@126.com
 * @LastEditTime: 2022-11-24 15:26:10
 * @FilePath: /Vue3.0VideoUpload/vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    //基本路径
    publicPath: './',
    //输出目录
	outputDir: 'dist',
	//指定生成的文件
    indexPath: 'index.html',
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/coapi.': {
                target: 'http://coapiwebsit.cnsuning.com',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/coapi.': ''
                }
            },
            '/api': {
                target: 'https://open.kuaishou.com',
                // 允许跨域
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})