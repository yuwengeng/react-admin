import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'

import {Menu, Icon } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'

import menuList from '../../config/menuConfig'
//引入virtual对象数据,动态渲染菜单 

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

    // map遍历,动态生成菜单列表结构 渲染<Menu.litem /> 或 <SubMenu />
    getMenuNodes = (menuList) => {

      return ( menuList.reduce( (pre,item) => {
        if(!item.children) {
          pre.push( (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {
          pre.push( (
            <SubMenu
              key={item.key}
              title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
        return pre
    },[]) )
  }
    componentWillMount () {
      // 防止多余render执行, 所以在渲染之前要得到menu数据 (必须是同步语句)
      this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // 获取当前页面路径
        const path = this.props.location.pathname
        return (
          <div className="left-nav">
            <Link to='/' className="left-nav-header">
              <img src={logo} alt="logo"/>
              <h1>CMS后台系统</h1>
            </Link>
    
            <Menu
              mode="inline"
              theme="dark"
              selectedKeys={[path]}
              // defaultOpenKeys={[openKey]}
            >
              {
                this.menuNodes
              }
    
            </Menu>
          </div>
        )
    }
}
export default withRouter(LeftNav)