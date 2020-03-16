import React, { Component } from 'react'
import { Layout } from 'antd'
import { Switch, Redirect, Route} from 'react-router-dom'
// 自定义组件
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left_nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout

// 项目后台页面
export default class Admin extends Component {
    render() {
        return (
        <Layout style={{minHeight: '100%'}}>
           <Sider>
             <LeftNav/>
           </Sider>
           <Layout>
             <Header>Header</Header>
             <Content style={{margin: 20, backgroundColor: '#fff'}}>
               <Switch>
                 <Redirect from='/' exact to='/home'/>
                 <Route path='/home' component={Home}/>
                 <Route path='/category' component={Category}/>
                 <Route path='/product' component={Product}/>
                 <Route path='/user' component={User}/>
                 <Route path='/role' component={Role}/>
                 <Route path="/charts/bar" component={Bar}/>
                 <Route path="/charts/pie" component={Pie}/>
                 <Route path="/charts/line" component={Line}/>
                 {/* <Route path="/order" component={Order}/> */}
                 {/* <Route component={NotFound}/> */}
               </Switch>
             </Content>
             <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
           </Layout>
         </Layout>
        )
    }
}
