import React, {PureComponent} from 'react'
import {Table} from 'antd'
import './index.css'

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      iseditable: false,
    }
  }

  editable() {

  }

  render() {
    const columns = [
      {
        title: '屏柜编号',
        dataIndex: 'seq',
        key: 'seq',
        render: (value, record) => <a onClick={id => this.editable(record.id) }>可编辑</a>
      },
      {
        title: '屏柜名称',
        dataIndex: 'name',
        key: 'name',
        render: (value, record) => <a onClick={id => this.editable(record.id) }>可编辑</a>
      },
      {
        title: '第几行',
        dataIndex: 'row',
        key: 'row',
        render: (value, record) => <a onClick={id => this.editable(record.id) }>可编辑</a>
      },
      {
        title: '第几列',
        dataIndex: 'column',
        key: 'column',
        render: (value, record) => <a onClick={id => this.editable(record.id) }>可编辑</a>
      },
      {
        title: '部分个数',
        dataIndex: 'region_num',
        key: 'region_num',
        render: (value, record) => <a onClick={id => this.editable(record.id) }>可编辑</a>
      }
    ];
    // 需要获取
    const data = [
      {
      },
    ];
    return (
      <div className="shelf">
        <Table
          columns={columns}
          dataSource={data}
          bordered
        ></Table>
      </div>
    );
  }
  
}