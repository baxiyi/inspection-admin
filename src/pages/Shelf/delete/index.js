import React, {PureComponent} from 'react'
import {Table, Input} from 'antd'
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    }
  }

  searchShelf(value) {
    console.log('search ' + value);
    this.setState({
      searchText: value,
    }, () => this.updateShelfList())
  }

  deleteShelf(shelfId) {
    console.log('delete shelf');
    this.updateShelfList();
  }

  updateShelfList() {
    console.log('update shelf list');
  }

  render() {
    const columns = [
      {
        title: '屏柜ID',
        dataIndex: 'shelfId',
      },
      {
        title: '屏柜名称',
        dataIndex: 'shelfName',
      },
      {
        title: '物理位置',
        dataIndex: 'position',
      },
      {
        title: '摄像头IP',
        dataIndex: 'ipAddress',
      },
      {
        title: '',
        dataIndex: 'delete',
        render: (value, record) => (<a onClick={() => this.deleteShelf(record.shelfId)}>删除</a>)
      }
    ];
    const data = [
      {key: '1'}
    ]
    return (
      <div className="shelf-delete">
        <div className="user-search">
          屏柜ID：
          <Search 
            placeholder="输入屏柜ID"
            onSearch={(value) => this.searchShelf(value)}
            style={{width: 200}}
          />
        </div>
        <Table 
          columns={columns}
          dataSource={data}
          bordered
          className="shelf-delete-table"
          pagination={false}
        />
      </div>
    )
  }
}

