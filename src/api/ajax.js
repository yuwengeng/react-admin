import axios from 'axios'
import { message } from 'antd';

export default function ajax(url, data={}, type='GET'){
    // promise封装axios请求, 内部处理http请求异常
    return new Promise((resolve, reject) =>{
        let promise;
        switch (type) {
            case 'GET':
                promise = axios.get(url,{
                    params:data   //配置对象特点属性不能随意
                })    
                break;
            case 'POST':
                promise = axios.post(url,data)
                break;
            
        }
        promise.then(res => resolve(res.data)).catch(() =>message.error("失败请求"))        

    })

}
