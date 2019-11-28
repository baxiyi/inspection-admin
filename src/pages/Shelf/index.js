import React, {PureComponent} from 'react'
import {Input, message, Table} from 'antd'
import {HOST} from '../../config'
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shelfInfo: [],
    }
  }

  getShelfInfo(shelfId) {
    fetch(`${HOST}/getShelfInfo.json?&shelfId=${shelfId}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      let shelfInfoObj = pageData;
      shelfInfoObj.position = `(${pageData.positionX}, ${pageData.positionY})`;
      let shelfInfo = [];
      shelfInfo.push(shelfInfoObj);
      this.setState({
        shelfInfo,
      })
    })
  }

  startOrStopShelf(status) {
    const {shelfInfo} = this.state;
    if (status == '已启用') {
      fetch(`${HOST}/startOrStopShelf.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `shelfId=${shelfInfo[0].shelfId}&type=0&userId=${window.sessionStorage.userId}`,
      }).then(response => response.json())
      .then(response => {
        if (response.data.success == 'yes') {
          message.success('停用成功');
          window.locaction.reload();
        } else {
          message.error(response.data.message);
        }
      })
    } else {
      fetch(`${HOST}/startOrStopShelf.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `shelfId=${shelfInfo[0].shelfId}&type=1&userId=${window.sessionStorage.userId}`,
      }).then(response => response.json())
      .then(response => {
        if (response.data.pageData.success == 'yes') {
          message.success('启用成功');
          window.locaction.reload();
        } else {
          message.error(response.data.message);
        }
      })
    }
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
        title: '摄像头IP地址',
        dataIndex: 'ipAddress',
        render: value => {
          return value.join(' , ');
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '',
        dataIndex: 'startOrStop',
        render: (value, record) => (
          <a onClick={() => this.startOrStopShelf(record.status)}>
            {record.status == '已启用' ? '停用' : '启用'}
          </a>
        )
      }
    ]
    return (
      <div className="shelf">
        屏柜ID：
        <Search 
          placeholder="输入屏柜ID"
          style={{width: 200}}
          onSearch={(value) => this.getShelfInfo(value)}
          className="shelf-search"
        />
        <Table 
          className="shelf-table"
          columns={columns}
          dataSource={this.state.shelfInfo}
          bordered
          pagination={false}
        />
      </div>
    )
  }
}