import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'

import './index.less'
// 类链接按钮组件
import LinkButton from '../link-button'

import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtil'
import menuList from '../../config/menuConfig'

// 后台头部区域要获取到用户的登录信息
class Header extends Component {


  // 组件内部可变的数据放在state里面
  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: '', // 天气图片url
    weather: '', // 天气的文本
  }
  // 一系列操作数据函数
  getTime = () => {
    // 每隔1s获取当前时间并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }  
  getWeather = async () => {
    // 调用weather接口异步获取数据
    const {dayPictureUrl, weather} = await reqWeather('北京')
    this.setState({dayPictureUrl, weather})
  }
  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    // 标题要到menuList中取,
    menuList.forEach(item => {
      if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0) // 返回第一个满足条件的即可
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        console.log('OK', this)
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }  

  // 一般在此执行异步操作: 发ajax请求/启动定时器
  componentDidMount () {
    // 获取当前的时间
    this.getTime()
    // 获取当前天气
    this.getWeather()  
  }
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }
  render(){
      const {currentTime, dayPictureUrl, weather} = this.state
      const username = memoryUtils.user.username  
      const title = this.getTitle() // title要实时计算,必须放在render()里面

      return (
          <div>
    <div className="header">
      <div className="header-top">
        <span>欢迎, {username}</span>
        <LinkButton onClick={this.logout}>退出</LinkButton>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">{title}</div>
        <div className="header-bottom-right">
          <span>{currentTime}</span>
          <img src={dayPictureUrl} alt="weather"/>
          <span>{weather}</span>
        </div>
      </div>
    </div>                
          </div>
      )
  }
}
export default withRouter(Header)