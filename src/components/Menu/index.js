import React, {PureComponent} from 'react'
import {Menu} from 'antd'
import {Link, withRouter} from 'react-router-dom'

import './index.css'

const { SubMenu } = Menu;

class MenuComp extends PureComponent {

  render() {
    const map = {
      '/shelf': '1',
      '/rule/insert': '2',
      '/rule/stop': '3',
      '/backup/log': '4',
      '/backup/img': '5',
      '/system': '6',
    };
    const curPath = this.props.location.pathname;
    let openKeys = [];
    if (curPath.indexOf('/rule') !== -1) {
      openKeys.push('sub1');
    }
    if (curPath.indexOf('/backup') !== -1) {
      openKeys.push('sub2');
    }
    return (
      <Menu
        onClick={this.handleClick} 
        defaultSelectedKeys={[map[curPath]]}
        defaultOpenKeys={openKeys}
        mode="inline"
        className="menu"
      >

        <Menu.Item key="1">
          <Link to="/shelf">启用/停用屏柜</Link>
        </Menu.Item>

        <SubMenu key='sub1'           
            title={          
              <span>更新规则</span>
          }>
          
          <Menu.Item key='2'>
          <Link to="/rule/insert">录入规则页</Link>
          </Menu.Item>

          <Menu.Item key='3'>
          <Link to="/rule/stop">停用规则页</Link>
          </Menu.Item>

        </SubMenu>

        <SubMenu key='sub2'           
            title={          
              <span>备份与删除</span>
          }>

          <Menu.Item key='4'>
          <Link to="/backup/log">删除/导出系统日志</Link>
          </Menu.Item>

          <Menu.Item key='5'>
          <Link to="/backup/img">删除采集图像</Link>
          </Menu.Item>

        </SubMenu>

        {/* <Menu.Item key='6'>
          <Link to="/on">启用/停用设备单元</Link>
        </Menu.Item> */}

        <Menu.Item key='6'>
          <Link to="/system">系统信息</Link>
        </Menu.Item>

      </Menu>
    )
  }
}

export default withRouter(MenuComp)