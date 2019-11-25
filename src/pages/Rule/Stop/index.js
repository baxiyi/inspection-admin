import React, {PureComponent} from 'react'
import {Input, Table} from 'antd'
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ruleId: '',
      deviceId: '',
    }
  }

  searchByRuleId(value) {
    console.log('search rule id ' + value)
    this.setState({
      ruleId: value,
    }, () => this.updateRuleList)
  }

  searchByServiceId(value) {
    console.log('search device id '+ value)
    this.setState({
      deviceId: value,
    }, () => this.updateRuleList())
  }

  updateRuleList() {
    console.log('update rule list')
  }

  onOrStop(status) {
    console.log(status);
  }

  deleteRule(id) {
    console.log('delete rule ' + id);
  }

  render() {
    const columns = [
      {
        title: '规则ID',
        dataIndex: 'ruleId',
      },
      {
        title: '警告信息',
        dataIndex: 'warningInfor',
      },
      {
        title: '关联的设备',
        dataIndex: 'devices',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '',
        dataIndex: 'onOrStop',
        render: (value, record) => (
          <a onClick={this.onOrStop(record.status)}>
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
    const tableData = [
      {key: '1', }
    ];
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
          onSearch={(value) => this.searchByServiceId(value)}
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