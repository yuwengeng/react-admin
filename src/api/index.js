import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from 'antd'

// 根据接口文档定义app所有接口处理函数, 网络请求都是异步的,所以函数都要写成promise形式
const BASE = ''

// 登录处理
export const reqLogin = (username,password) => ajax('/login',{username,password}, 'POST')

// 配置百度地图的jsonp请求接口函数
export const reqWeather = (city) =>{
  // 如果不用promise写法, 只能写回调函数,获得网络请求数据了
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
          console.log('jsonp()', err, data)
          // 如果成功了
          if (!err && data.status==='success') {
            // 直接解构取出需要的数据
            const {dayPictureUrl, weather} = data.results[0].weather_data[0]  
/*            
还可以解构其他数据:
date: "周二 03月10日 (实时：11℃)"
dayPictureUrl: "http://api.map.baidu.com/images/weather/day/qing.png"
nightPictureUrl: "http://api.map.baidu.com/images/weather/night/qing.png"
weather: "晴"
wind: "北风3-4级"
temperature: "11 ~ -4℃"
*/
            resolve({dayPictureUrl, weather})
          } else {
            // 如果失败了
            message.error('获取天气信息失败!')
          }
    
        }) 
    })

  }


// 分类组件接口配置

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
