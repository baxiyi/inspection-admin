import React, {PureComponent} from 'react'
import {Table,Button} from 'antd'
import './index.css'

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  closesystem(){}

  opensystem(){}

  resetsystem(){}

  render() {
    const columns = [
      {
        title: '服务器',
        dataIndex: 'server',
        key: 'server',
      },
      {
        title: '运行时间',
        dataIndex: 'runtime',
        key: 'runtime',
      },
      {
        title: '系统状态',
        dataIndex: 'sysstate',
        key: 'sysstate',
      },
      {
        title: 'CPU占用',
        dataIndex: 'CPU',
        key: 'CPU',
      },
      {
        title: '磁盘使用',
        dataIndex: 'disk',
        key: 'disk',
      },
      {
        title: '内存使用',
        dataIndex: 'ram',
        key: 'ram',
      }
    ];
    // 需要获取
    const data = [
      {
        sysstate:'运行中'
      },
    ];
    return (
      <div className="system">
        <Table
          columns={columns}
          dataSource={data}
          bordered
        ></Table>
        <Button type="primary" size="large" className="close-system" onClick={(num) => this.closesystem()}>关闭系统</Button>
        <Button type="primary" size="large" className="open-system" onClick={(num) => this.opensystem()}>启动系统</Button>
        <Button type="primary" size="large" className="reset-system" onClick={(num) => this.resetsystem()}>重启系统</Button>
      </div>
    );
  } 
}