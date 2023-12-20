//发送异步ajax请求的模块，封装axios，函数的返回值是promise对象
//modules to send ajax requests, using axios

import axios from "axios";
import {message} from 'antd';

//这部分通过配置proxy处理对当前端口的请求，转发至5000，详情见package.json
const BASEURL = ''
export default function ajax(url, data = {}, type = 'GET'){
    //加入了统一的异常处理，通过在外层包一个自己创建的promise对象
    //并且在出错时不使用reject而是直接显示错误提示达成
    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if(type === 'GET'){
            promise = axios.get(BASEURL + url, { //配置对象
                params: data //指定请求参数
            })
        }
        else{
            promise =  axios.post(BASEURL + url, data)
        }
        //2.如果成功，调用resolve（value.data）
        promise.then(response =>{
            resolve(response.data)
        //3.如果失败，不调用reject（reason），而是提示异常信息
        }).catch(error => {
            message.error('Ajax Failed: ' + error.message)
        })
    })   
}