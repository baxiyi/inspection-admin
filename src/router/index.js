import React, { PureComponent } from 'react'
import Shelf from '../pages/Shelf'
import Rule1 from '../pages/Rule/Insert'
import Rule2 from '../pages/Rule/Stop'
import Backup1 from '../pages/Backup/Img'
import Backup2 from '../pages/Backup/Log'
import On from '../pages/On'
import System from '../pages/System'
import Login from '../pages/Login'
import Menu from '../components/Menu'
import TopBar from '../components/TopBar'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import './index.css'


export default class extends PureComponent {
  render() {
    let storage = window.sessionStorage;
    let isLogin = false;
    if (!storage.getItem('isLogin')) {
      storage.setItem('isLogin', "false");
    } else {
      isLogin = storage.getItem('isLogin') === 'true' ? true : false;
    }
    return (
      <BrowserRouter>
        <div>
          {isLogin && <TopBar />}
          {isLogin && <Menu />}
          <Switch>
            <Route 
              path="/"
              exact
              render = {props => {
                return isLogin ? <div className="welcome">欢迎使用巡检管理员系统</div> : <Redirect to="/login" />
              }}
            />                
            <Route 
              path='/shelf'
              exact
              render = {props => {
                return isLogin ? <Shelf /> : <Redirect to="/login"/>
              }}
            />
            <Route
              path='/rule/insert'
              render = {props => {
                return isLogin ? <Rule1 /> : <Redirect to="/login"/>
              }}
            />
            <Route
              path='/rule/stop'
              render = {props => {
                return isLogin ? <Rule2 /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/backup/img'
              render = {props => {
                return isLogin ? <Backup1 /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/backup/log'
              render = {props => {
                return isLogin ? <Backup2 /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/on'
              render = {props => {
                return isLogin ? <On /> : <Redirect to="/login"/>
              }}
            />
            <Route 
              path='/system'
              render = {props => {
                return isLogin ? <System /> : <Redirect to="/login"/>
              }}
            />
            <Route
              path="/login"
              render={props => {
                return isLogin ? <Redirect to="/" /> : <Login />
              }}
            ></Route>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}