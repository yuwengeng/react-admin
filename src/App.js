import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

// 组件引入
import Login from './pages/login/login'
import Admin from './pages/admin/admin'



export default class App extends Component {
  render() {
    return (
        <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={Admin} />
          <Redirect from='/' to='login' />

        </Switch>  
        </Router>
    )
  }
}

