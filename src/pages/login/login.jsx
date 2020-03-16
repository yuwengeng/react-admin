import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import storageUtil from '../../utils/storageUtil'
import memoryUtils from '../../utils/memoryUtils'


import {
    Form,
    Icon,
    Input,
    Button, message } from 'antd'
  
// 先写login登录组件
class Login extends Component {

    handleSubmit= (event)=>{
        event.preventDefault()
        const form = this.props.form;
        // const value_obj = form.getFieldsValue()
        // console.log(value_obj);
        form.validateFields(async (error,values) =>{
            if(!error){
                //表单校验成功, 返回字段对象values 
                const {username,password} = values;
                const result = await reqLogin(username,password)
                if(result.status===0){
                    // 登录成功反馈
                    message.success('登录成功')

                    // 存储数据,实现跳转后可以获取之前登录信息: 1. 通过临时变量存进内存 2.存进浏览器,维持登录
                    const user = result.data
                    memoryUtils.user = user
                    storageUtil.saveUser(user)

                    // 跳转到后台界面,且不需要记录回退
                    this.props.history.replace('/')                    

                }else{
                    // 登录失败msg反馈
                    message.error(result.msg)
                }
            }else{
                message.error("表单校验失败,重新输入")
            }
        })  
        
    }
    // 密码校验函数
    validatePwd = (rule, value, callback) => {
        // console.log('validatePwd()', rule, value)
        if(!value) {
          callback('密码必须输入')
        } else if (value.length<4) {
          callback('密码长度不能小于4位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          callback('密码必须是英文、数字或下划线组成')
        } else {
          callback() // 验证通过
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本
      }

    render() {

        // 登录前数据校验,是否自动登录 如果浏览器信息校验没错 则自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id) {
          return <Redirect to='/'/>
        }


        // 高阶之后得到表单的form对象, 获取form的字段装饰器方法
        let {getFieldDecorator} = this.props.form;

        return (
              
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt=""/>
                    <h1>React: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>

                    <Form
                      name="normal_login"
                    //   form={form}
                      className="login-form" onSubmit={this.handleSubmit}>
                      <Form.Item
                        name="username">
                        {getFieldDecorator('username',{
                            rules: [
                              { required: true, whitespace: true, message: '用户名必须输入' },
                              { min: 4, message: '用户名至少4位' },
                              { max: 12, message: '用户名最多12位' },
                              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                            ],
                            initialValue: 'admin', // 初始值
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>} />)
                        }
                      </Form.Item>
                      <Form.Item
                        name="password">
                        {getFieldDecorator('password',{
                            rules: [
                          {
                            validator: this.validatePwd
                          }
                        ]                            
                        })(
                            <Input
                              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              type="password"
                              placeholder="Password"
                            />)
                        }                        

                      </Form.Item>
                        
                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          登录
                        </Button>
                        Or <a href="">register now!</a>
                      </Form.Item>
                    </Form>
                </section>
            </div>

            
        )
    }
    }
const WrapLogin = Form.create()(Login)
export default WrapLogin 