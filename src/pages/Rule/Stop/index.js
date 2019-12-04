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
      pageOffset: 1,
      totalPages: 1,
    }
  }

  componentDidMount() {
    fetch(`${HOST}/getAllRules.json?page=1&size=10`)
    .then(response => response.json())
    .then(response => {
      const {rules} = response.data.pageData;
      const {totalPages} = response.data;
      const tableData = rules.map(rule => {
        return {
          ...rule,
          ruleId: rule.ruleid,
        }
      })
      this.setState({
        tableData: tableData,
        totalPages
      })
    })
  }

  updateRules() {
    fetch(`${HOST}/getAllRules.json?page=${this.state.pageOffset}&size=10`)
    .then(response => response.json())
    .then(response => {
      const {rules} = response.data.pageData;
      const {totalPages} = response.data;
      const tableData = rules.map(rule => {
        return {
          ...rule,
          ruleId: rule.ruleid,
        }
      })
      this.setState({
        tableData: tableData,
        totalPages
      })
    })
  }

  searchByRuleId(ruleId) {
    fetch(`${HOST}/getRuleByRuleId.json?ruleId=${ruleId}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      if (response.code != 0) {
        message.error(response.message);
        return;
      }
      const {rules} = response.data.pageData;
      const {totalPages} = response.data;
      const tableData = rules.map(rule => {
        return {
          ...rule,
          ruleId: rule.ruleid,
        }
      })
      this.setState({
        tableData: tableData,
        totalPages
      })
    })
  }

  searchByUnitId(unitId) {
    fetch(`${HOST}/getRuleByUnitId.json?unitId=${unitId}`, {
      method: 'GET',
    }).then(response => response.json())
    .then(response => {
      const {rules} = response.data.pageData;
      const {totalPages} = response.data;
      const tableData = rules.map(rule => {
        return {
          ...rule,
          ruleId: rule.ruleid,
        }
      })
      this.setState({
        tableData: tableData,
        totalPages
      })
    })
  }

  startOrStopRule(status, ruleId) {
    if (status > 0) {
      fetch(`${HOST}/StartOrStopRule.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ruleId=${ruleId}&type=0&userId=${window.sessionStorage.userId}`
      }).then(response => response.json())
      .then(response => {
        if (response.code == 0) {
          message.success('停用规则成功', 1)
          .then(() => window.location.reload())
        } else {
          message.error(response.message);
        }
      })
    } else {
      fetch(`${HOST}/StartOrStopRule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ruleId=${ruleId}&type=1&userId=${window.sessionStorage.userId}`
      }).then(response => response.json())
      .then(response => {
        if (response.code == 0) {
          message.success('启用规则成功', 1)
          .then(() => window.location.reload())
        } else {
          message.error(response.message);
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
      if (response.code == 0) {
        message.success('删除规则成功', 1)
        .then(() => window.location.reload());
      } else {
        message.error(response.message);
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
        render: (value) => {
          return value > 0 ? '启用' : '停用'
        }
      },
      {
        title: '',
        dataIndex: 'onOrStop',
        render: (value, record) => (
          <a onClick={() => this.startOrStopRule(record.status, record.ruleId)}>
            {record.status > 0 ? '停用' : '启用'}
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
          pagination={{
            current: this.state.pageOffset,
            total: this.state.totalPages*10,
            pageSize: 10,
            onChange: (page) => {
              this.setState({
                pageOffset: page,
              }, () => this.updateRules())
            }
          }}
        />
      </div>
    )
  }
}