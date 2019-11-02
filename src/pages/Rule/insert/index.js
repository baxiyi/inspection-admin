import React, { PureComponent } from 'react'
import {Input, Table, Button} from 'antd'
import './index.css'

const {TextArea} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ruleId: '',
      warningInfor: '',
      tableData: [],
    }
  }

  addTableRow() {
    console.log('add table row');
  }

  saveTableData() {
    console.log('save table data')
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
      },
      {
        title: '设备1的ID',
        dataIndex: 'device1Id',
      },
      {
        title: '设备2的ID',
        dataIndex: 'device2Id',
      },
      {
        title: '关系类型',
        dataIndex: 'relationType',
      }
    ];

    return (
      <div className="rule-insert">
        <div className="id-input">
          规则ID：
          <Input
            style={{width: 200}}
            placeholder="请输入规则ID"
          />
        </div>
        <div className="rule-infor">
          告警信息：
          <TextArea 
            style={{width: 800}}
            placeholder="请输入告警信息"
            rows={4}
            className="my-textArea"
          />
        </div>
        <Table 
          columns={columns}
          dataSource={this.state.tableData}
          bordered
          className="rule-table"
        />
        <Button type="primary" onClick={() => this.addTableRow()}>
          + 新增警告项
        </Button>
        <div className="save-button">
          <Button
            type="primary"
            size="large"
            onClick={() => this.saveTableData()}
          >
            确认添加
          </Button>
        </div>
      </div>
    )
  }
}