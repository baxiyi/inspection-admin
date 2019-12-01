import React from 'react'
import {Input, Table, Button, Select, message} from 'antd'
import './index.css'
import { HOST } from '../../../config';

const {TextArea} = Input;
const {Option} = Select;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleId: '',
      warningInfor: '',
      importance: 1,
      editingSeq: '',
      editingRelType: 2,
      editingData: {},
      tableData: [],
    }
  }

  cancel() {
    this.setState({
      editingData: {},
      editingSeq: '',
      editingRelType: 2,
    })
  }

  save(seq) {
    const index = parseInt(seq) - 1;
    let {tableData} = this.state;
    const {editingData} = this.state;
    tableData[index] = editingData;
    this.setState({
      tableData,
      editingSeq: '',
      editingData: {},
      editingRelType: 2,
    })
  }

  deleteRow(seq) {
    const index = parseInt(seq) - 1;
    let {tableData} = this.state;
    tableData.splice(index, 1);
    for(let i = 0; i < tableData.length; i++) {
      tableData[i].seq = i + 1;
    }
    this.setState({
      tableData,
      editingData: {},
      editingSeq: '',
      editingRelType: 2,
    })
  }

  edit(seq) {
    const index = parseInt(seq) - 1;
    const {tableData} = this.state;
    const editingData = {...tableData[index]};
    this.setState({
      editingSeq: seq,
      editingData,
      editingRelType: tableData[index].relationType,
    })
  }

  changeData(dataIndex, value) {
    let {editingData} = this.state;
    editingData[dataIndex] = value;
    if (dataIndex == 'relationType' && value == 1) {
      editingData['device2Id'] = '';
    }
    this.setState({
      editingData
    })
  }
  
  addWarningItem() {
    let {tableData} = this.state;
    const len = tableData.length;
    tableData.push({
      seq: len + 1,
      relationType: 2,
      device1Id: '',
      device2Id: '',
      relation: '',
    });
    this.setState({
      tableData,
      editingSeq: tableData.length,
      editingData: {
        seq: tableData.length,
        relationType: 2,
        device1Id: '',
        device2Id: '',
        relation: '',
      },
      editingRelType: 2,
    })
  }

  addRule() {
    const {ruleId} = this.state;
    const {warningInfor} = this.state;
    const {importance} = this.state;
    const {tableData} = this.state;
    const warningItems = tableData.map(item => {
      return {
        relationType: item.relationType,
        deviceId1: parseInt(item.device1Id),
        deviceId2: item.device2Id == '' ? -1 : parseInt(item.device2Id),
        relation: item.relation,
      }
    });
    if (ruleId.trim().length === 0) {
      message.info('规则ID不能为空');
      return;
    }
    if (warningInfor.trim().length === 0) {
      message.info('告警信息不能为空');
      return;
    }
    if (warningItems.length === 0) {
      message.info('告警项不能为空');
      return;
    }
    fetch(`${HOST}/insertRule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `ruleId=${ruleId}&warningInfo=${warningInfor}&importance=${importance}&warningItems=${JSON.stringify(warningItems)}&userId=${window.sessionStorage.userId}`
    }).then(response => response.json())
    .then(response => {
      if (response.data.pageData.success == 'yes') {
        message.success('录入规则成功');
        window.location.reload();
      } else {
        message.error(response.data.pageData.message);
      }
    })
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
      },
      {
        title: '关系类型',
        dataIndex: 'relationType',
        key: 'relationType',
        render: (value, record) => {
          let res = null;
          res = (record.seq == this.state.editingSeq)
          ? (
            <Select 
              value={this.state.editingRelType}
              onChange={(value) => {
                this.changeData('relationType', value);
                this.setState({
                  editingRelType: value,
                });
              }}
            >
              <Option value={1}>一元关系</Option>
              <Option value={2}>二元关系</Option>
            </Select>
          )
          : <span>{value == 1 ? '一元关系' : '二元关系'}</span>
          return res;
        }
      },
      {
        title: '设备1的ID',
        dataIndex: 'device1Id',
        key: 'device1Id',
        editable: true,
        render: (value, record) => {
          let res = null;
          res = (record.seq == this.state.editingSeq)
          ? <Input value={value} onChange={(e) => this.changeData('device1Id', e.target.value)} />
          : <span>{value}</span>
          return res;
        }
      },
      {
        title: '设备2的ID',
        dataIndex: 'device2Id',
        key: 'device2Id',
        editable: true,
        render: (value, record) => {
          let res = null;
          const isDisabled = this.state.editingRelType == 1;
          res = (record.seq == this.state.editingSeq)
          ? <Input value={value} onChange={(e) => this.changeData('device2Id', e.target.value)} disabled={isDisabled} />
          : <span>{value}</span>
          return res;
        }
      },
      {
        title: '关系',
        dataIndex: 'relation',
        key: 'realation',
        editable: true,
        render: (value, record) => {
          let res = null;
          res = (record.seq == this.state.editingSeq)
          ? <Input value={value} onChange={(e) => this.changeData('relation', e.target.value)}/>
          : <span>{value}</span>
          return res;
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        editable: true,
        render: (value, record) => {
          let res = null;
          res = (record.seq == this.state.editingSeq)
          ? <span><a onClick={() => this.save(record.seq)}>保存</a> <a onClick={() => this.cancel()}>取消</a> <a onClick={() => this.deleteRow(record.seq)}>删除</a></span>
          : (this.state.editingSeq == '' ? <a onClick={() => this.edit(record.seq)}>编辑</a> : <span className="unable-link">编辑</span>)
          return res;
        }
      }
    ];

    let tableData = this.state.tableData.slice();
    if (this.state.editingSeq != '') {
      const index = parseInt(this.state.editingSeq) - 1;
      tableData.splice(index, 1, this.state.editingData);
    }
    
    return (
      <div className="rule-insert">
        <div className="id-input">
          规则ID：
          <Input
            style={{width: 200}}
            placeholder="请输入规则ID"
            onChange={(e) => this.setState({
              ruleId: e.target.value,
            })}
          />
        </div>
        <div className="rule-infor">
          告警信息：
          <TextArea 
            style={{width: 800}}
            placeholder="请输入告警信息"
            rows={4}
            className="my-textArea"
            onChange={(e) => this.setState({
              warningInfor: e.target.value,
            })}
          />
        </div>
        <div className="rule-importance">
            重要性：
            <Select onChange={(value) => {
              this.setState({
                importance: value,
              })
            }}
            defaultValue={1}
            >
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
            </Select>
        </div>
        <Table 
          columns={columns}
          dataSource={tableData}
          bordered
          pagination={false}
          className="rule-table"
        />
        <Button type="primary" onClick={() => this.addWarningItem()}>
          + 新增警告项
        </Button>
        <div className="save-button">
          <Button
            type="primary"
            size="large"
            onClick={() => this.addRule()}
          >
            确认添加
          </Button>
        </div>
      </div>
    )
  }
}