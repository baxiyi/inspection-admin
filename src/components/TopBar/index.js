import React, {PureComponent} from 'react'
import {Icon} from 'antd'
import './index.css'

export default class extends PureComponent {
  render() {
    const storage = window.sessionStorage;
    let userName = '';
    if (storage.getItem('userName')) {
      userName = storage.getItem('userName')
    }
    return (
      <div className="top-bar">
        <div className="title">
          <Icon type="home" style={{marginRight: 5}}/>
          管理员巡检系统
        </div>
        <div className="logout">
          <span className="userid">用户: {userName}</span>
          <a className="logout-link" onClick={() => this.logout()}>
            退出登录 
            <Icon type="logout" />
          </a>
        </div>
      </div>
    )
  }
}