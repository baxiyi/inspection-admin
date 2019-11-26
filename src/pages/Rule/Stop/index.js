import React, {PureComponent} from 'react'
import {Input, Table, message} from 'antd'
import {HOST} from '../../../config';
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    }
  }

  searchByRuleId(ruleId) {
    fetch(`${HOST}/getRuleByRuleId.json?ruleId=${ruleId}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      let tableData = [];
      tableData.push(pageData);
      this.setState({
        tableData,
      })
    })
  }

  searchByUnitId(unitId) {
    fetch(`${HOST}/getRuleByUnitId.json?unitId=${unitId}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      const {pageData} = response.data;
      this.setState({
        tableData: pageData,
      })
    })
  }

  startOrStopRule(status, ruleId) {
    if (status == '已启用') {
      fetch(`${HOST}/startOrStopRule.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ruleId=${ruleId}&type=0&userId=${window.sessionStorage.userId}`
      }).then(response => response.json())
      .then(response => {
        if (response.data.pageData.success == 'yes') {
          message.success('停用规则成功');
          window.location.reload()
        } else {
          message.error(response.data.pageData.message);
        }
      })
    } else {
      fetch(`${HOST}/startOrStopRule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ruleId=${ruleId}&type=1&userId=${window.sessionStorage.userId}`
      }).then(response => response.json())
      .then(response => {
        if (response.data.pageData.success == 'yes') {
          message.success('启用规则成功');
          window.location.reload()
        } else {
          message.error(response.data.pageData.message);
        }
      })
    }
  }

  deleteRule(ruleId) {
    fetch(`${HOST}/deleteRule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `ruleId=${ruleId}&userId=${window.sessionStorage.userId}`
    }).then(response => response.json())
    .then(response => {
      if (response.data.pageData.success == 'yes') {
        message.success('删除规则成功');
        window.location.reload()
      } else {
        message.error(response.data.pageData.message);
      }
    })
  }

  render() {
    const columns = [
      {
        title: '规则ID',
        dataIndex: 'ruleId',
      },
      {
        title: '警告信息',
        dataIndex: 'warningInfo',
      },
      {
        title: '关联的设备',
        dataIndex: 'devices',
        render: (arr, record) => {
          let res = '';
          for (let dev of arr) {
            res = res + dev.devId + ',';
          }
          const len = res.length;
          res = res.slice(0, len - 1);
          return res;
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '',
        dataIndex: 'onOrStop',
        render: (value, record) => (
          <a onClick={() => this.startOrStopRule(record.status, record.ruleId)}>
            {record.status == '已启用' ? '停用' : '启用'}
          </a>
        )
      },
      {
        title: '',
        dataIndex: 'deleteRule',
        render: (value, record) => (<a onClick={() => this.deleteRule(record.ruleId)}>删除</a>)
      }
    ];
    const {tableData} = this.state;
    return (
      <div className="rule-stop">
        规则ID：
        <Search 
          placeholder="请输入规则ID"
          style={{width: 200}}
          onSearch={(value) => this.searchByRuleId(value)}
          className="rule-search-input"
        />
        设备ID：
        <Search 
          placeholder="请输入设备ID"
          style={{width: 200}}
          onSearch={(value) => this.searchByUnitId(value)}
        />
        <Table 
          columns={columns}
          dataSource={tableData}
          bordered
          className="rule-table"
          pagination={false}
        />
      </div>
    )
  }
}