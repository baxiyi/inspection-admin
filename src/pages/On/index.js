import React, {PureComponent} from 'react'
import {Table,Input,Divider, message} from 'antd'
import './index.css'
import { HOST } from '../../config';

const { Search } = Input;

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    }
  }

  searchByUnitId(unitId) {
    fetch(`${HOST}/getUnitList.json?unitId=${unitId}`)
    .then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          seq: index + 1,
          unitId: item.unitId,
          meaning: item.meaning,
          category: item.category,
          warningItems: item.warningItems,
          isOn: item.isOn,
        }
      })
      this.setState({
        tableData,
      })
    })
  }

  searchByShelfId(shelfId) {
    fetch(`${HOST}/getUnitList.json?shelfId=${shelfId}`)
    .then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          seq: index + 1,
          unitId: item.unitId,
          meaning: item.meaning,
          category: item.category,
          warningItems: item.warningItems,
          isOn: item.isOn,
        }
      })
      this.setState({
        tableData,
      })
    })
  }

  searchByCategory(category) {
    fetch(`${HOST}/getUnitList.json?category=${category}`)
    .then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          seq: index + 1,
          unitId: item.unitId,
          meaning: item.meaning,
          category: item.category,
          warningItems: item.warningItems,
          isOn: item.isOn,
        }
      })
      this.setState({
        tableData,
      })
    })
  }

  startOrStop(isOn, unitId) {
    if (isOn == 0) {
      fetch(`${HOST}/startOrStopUnit.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `unitId=${unitId}&type=1&userId=${window.sessionStorage.userId}`,
      }).then(response => response.json())
      .then(response => {
        if (response.data.pageData.success == 'yes') {
          message.success('启用设备成功');
          window.location.reload();
        } else {
          message.error(response.data.pageData.message);
        }
      })
    } else {
      fetch(`${HOST}/startOrStopUnit.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `unitId=${unitId}&type=0&userId=${window.sessionStorage.userId}`,
      }).then(response => response.json())
      .then(response => {
        if (response.data.pageData.success == 'yes') {
          message.success('停用设备成功');
          window.location.reload();
        } else {
          message.error(response.data.pageData.message);
        }
      })
    }
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
      },
      {
        title: '设备单元id',
        dataIndex: 'unitId',
        key: 'unitId',
      },
      {
        title: '设备含义',
        dataIndex: 'meaning',
        key: 'meaning',
      },
      {
        title: '设备类别',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '相关联的告警项',
        dataIndex: 'warningItems',
        key: 'warningItems',
        render: (arr, record) => {
          return arr.join(',');
        }
      },
      {
        title: '是否启用',
        dataIndex: 'isOn',
        key: 'isOn',
        render: (value) => {
          return value == 0 ? '已停用' : '已启用';
        }
      },
      {
        title: '',
        dataIndex: 'openclose',
        key: 'openclose',
        render: (value, record) => (
          <a onClick={() => this.startOrStop(record.isOn, record.unitId)}>{record.isOn == 0 ? '启用' : '停用'}</a>
        ),      
      }
    ];
    const data = this.state.tableData;
    return (
      <div className="on">
        <Search
          className="dev-query"
          placeholder="设备单元id"
          enterButton="查询"
          size="Small"
          onSearch={value => this.searchByUnitId(value)}
        />
        <Search
          className="shelf-query"
          placeholder="屏柜ID"
          enterButton="查询"
          size="Small"
          onSearch={value => this.searchByShelfId(value)}
        />
        <Search
          className="category-query"
          placeholder="设备类型"
          enterButton="查询"
          size="Small"
          onSearch={value => this.searchByCategory(value)}
        />
        <Table
          columns={columns}
          dataSource={data}
          bordered
          className="unit-table"
        ></Table>
      </div>
    );
  } 
}