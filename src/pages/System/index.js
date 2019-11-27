import React, {PureComponent} from 'react'
import {Table,Button, message} from 'antd'
import {HOST} from '../../config'
import './index.css'

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      systemData: {},
    }
  }

  componentDidMount() {
    fetch(`${HOST}/getSystemInfo.json`)
    .then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      this.setState({
        systemData: pageData,
      })
    })
  }

  updateSystem(type) {
    fetch(`${HOST}/updateSystem.json`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `type=${type}`,
    }).then(response => response.json())
    .then(response => {
      if (response.data.pageData.success == 'yes') {
        switch(type) {
          case 0:
            message.success('关闭系统成功');
            break;
          case 1:
            message.success('启动系统成功');
            break;
          case 2:
            message.success('重启系统成功');
            break;
          default:
            break;
        }
        window.location.reload();
      } else {
        message.error(response.data.pageData.message);
      }
    })
  }

  render() {
    const columns = [
      {
        title: '服务器',
        dataIndex: 'serverInfo',
        key: 'serverInfo',
      },
      {
        title: '运行时间',
        dataIndex: 'runningTime',
        key: 'runningTime',
      },
      {
        title: '系统状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'CPU占用',
        dataIndex: 'cpuInfo',
        key: 'cpuInfo',
      },
      {
        title: '磁盘使用',
        dataIndex: 'diskInfo',
        key: 'diskInfo',
      },
      {
        title: '内存使用',
        dataIndex: 'memoryInfo',
        key: 'memoryInfo',
      }
    ];
    // 需要获取
    const {systemData} = this.state;
    const data = [];
    data.push(systemData);
    return (
      <div className="system">
        <Table
          columns={columns}
          dataSource={data}
          bordered
        ></Table>
        {
          systemData.status === '运行中'
          ? (
            <div>
              <Button type="primary" size="large" className="close-system" onClick={() => this.updateSystem(0)}>关闭系统</Button>
              <Button type="primary" size="large" className="reset-system" onClick={() => this.updateSystem(2)}>重启系统</Button>
            </div>
          )
          : (
            <Button type="primary" size="large" className="open-system" onClick={() => this.updateSystem(1)}>启动系统</Button>
          )
        }
      </div>
    );
  } 
}