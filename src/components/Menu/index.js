import React, {PureComponent} from 'react'
import {Menu} from 'antd'
import {Link, withRouter} from 'react-router-dom'

import './index.css'

const { SubMenu } = Menu;

class MenuComp extends PureComponent {

  render() {
    const map = {
      '/shelf/insert': '1',
      '/shelf/delete': '2',
      '/rule/insert': '3',
      '/rule/delete': '4',
      '/backup/backup': '5',
      '/backup/deletelog': '6',
      '/backup/deleteimg': '7',
      '/on': '8',
      '/system': '9',
    };
    const curPath = this.props.location.pathname;
    let openKeys = [];
    if (curPath.indexOf('/shelf') !== -1) {
      openKeys.push('sub1');
    }
    if (curPath.indexOf('/rule') !== -1) {
      openKeys.push('sub2');
    }
    if (curPath.indexOf('/backup') !== -1) {
      openKeys.push('sub3');
    }
    return (
      <Menu
        onClick={this.handleClick} 
        defaultSelectedKeys={[map[curPath]]}
        defaultOpenKeys={openKeys}
        mode="inline"
        className="menu"
      >

        <SubMenu key='sub1'           
            title={          
              <span>更新屏柜</span>
          }>

          <Menu.Item key='1'>
          <Link to="/shelf/insert">录入屏柜-向导式</Link>
          </Menu.Item>

          <Menu.Item key='2'>
          <Link to="/shelf/delete">删除屏柜</Link>
          </Menu.Item>

        </SubMenu>

        <SubMenu key='sub2'           
            title={          
              <span>更新规则</span>
          }>
          
          <Menu.Item key='3'>
          <Link to="/rule/insert">录入规则页</Link>
          </Menu.Item>

          <Menu.Item key='4'>
          <Link to="/rule/delete">停用规则页</Link>
          </Menu.Item>

        </SubMenu>

        <SubMenu key='sub3'           
            title={          
              <span>备份与删除</span>
          }>

          <Menu.Item key='5'>
          <Link to="/backup/backup">备份</Link>
          </Menu.Item>

          <Menu.Item key='6'>
          <Link to="/backup/deletelog">删除/导出系统日志</Link>
          </Menu.Item>

          <Menu.Item key='7'>
          <Link to="/backup/deleteimg">删除/导出采集图像</Link>
          </Menu.Item>

        </SubMenu>

        <Menu.Item key='8'>
          <Link to="/on">启用/停用</Link>
        </Menu.Item>

        <Menu.Item key='9'>
          <Link to="/system">系统信息</Link>
        </Menu.Item>

      </Menu>
    )
  }
}

export default withRouter(MenuComp)