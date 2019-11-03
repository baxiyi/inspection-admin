import React, {PureComponent} from 'react'
import {Table,Input,Divider} from 'antd'
import './index.css'

const { Search } = Input;

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
       on:true,
    }
  }

  open(id,onoff){
    // if(onoff=="已启用")
     
  }

  close(){

  }

  render() {
    const columns = [
      {
        title: '设备单元id',
        dataIndex: 'unitid',
        key: 'unitid',
      },
      {
        title: '设备含义',
        dataIndex: 'unitmeaning',
        key: 'unitmeaning',
      },
      {
        title: '设备类别',
        dataIndex: 'unittype',
        key: 'unittype',
      },
      {
        title: '相关联的告警项',
        dataIndex: 'associatedalert',
        key: 'associatedalert',
      },
      {
        title: '是否启用',
        dataIndex: 'onoff',
        key: 'onoff',
      },
      {
        title: '',
        dataIndex: 'openclose',
        key: 'openclose',
        render: (value, record) => (
          <span>
            <a onClick={id => this.open(record.id,record.onoff) }>启用</a>
            <Divider type="vertical" />
            <a onClick={id => this.close(record.id,record.onoff) }>停用</a>
          </span>
        ),      
      }
    ];
    // 需要获取
    const data = [
      {
        unitid:'11',
        unitmeaning:'1号灯',
        unittype:'1',
        associatedalert:'6,7',
        onoff:'已启用',
      },
      {
        unitid:'20',
        unitmeaning:'2号开关',
        unittype:'3',
        associatedalert:'11,32',
        onoff:'已停用',
      },
    ];
    return (
      <div className="system">

        <Search
          className="exactquery"
          placeholder="设备id"
          enterButton="精确查询"
          size="Small"
          onSearch={value => console.log(value)}
        />
        <Search
          className="fuzzyquery"
          placeholder="屏柜id/设备类型"
          enterButton="模糊查询"
          size="Small"
          onSearch={value => console.log(value)}
        />
        <Table
          columns={columns}
          dataSource={data}
          bordered
          className="system-table"
        ></Table>
      </div>
    );
  } 
}