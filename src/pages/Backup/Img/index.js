import React, {PureComponent} from 'react'
import {Table, DatePicker, TimePicker, Button, message, Input} from 'antd'
import moment from 'moment';
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
      searchText: '',
    }
  }

  getOneHourBefore() {
    const now = new Date();
    return new Date(now.getTime() - 60*60*1000)
  }

  changeDateRange() {
    console.log('change date range');
    const start = this.state.startTime;
    const end = this.state.endTime;
    const now = new Date();
    if (start.getTime() > end.getTime()) {
      message.error('结束时间必须大于开始时间');
      return;
    }
    if (start.getTime() > now.getTime() || end.getTime() > now.getTime()) {
      message.error('开始时间和结束时间均须在当前时间之前');
    }
    this.updateLogs();
  }

  filtershelfid(value) {
    this.setState({
      searchText: value,
    })
    console.log('filter users')
    this.updateLogs();
  }

  updateLogs() {
    console.log('update logs')
  }

  delete() {

  }

  export() {

  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
      },
      {
        title: '屏柜ID',
        dataIndex: 'shelfid',
      },
      {
        title: '图像地址',
        dataIndex: 'imgaddress',
      },
      {
        title: '拍摄日期',
        dataIndex: 'date',
      },
      {
        title: '相机IP地址',
        dataIndex: 'ip',
      },
    ];

    // 需获取
    const data = [
      {
        seq: '1',
        shelfid: '2',
        imgaddress: 'C:/2.png',
        date: '2019-10-11',
        ip: '192.168.1.2',
      },
      {
        seq: '2',
        shelfid: '6',
        imgaddress: 'C:/6.png',
        date: '2019-10-11',
        ip: '192.168.1.6',
      },
      {
        seq: '3',
        shelfid: '11',
        imgaddress: 'C:/11.png',
        date: '2019-10-10',
        ip: '192.168.1.11',
      }
    ]
    return (
      <div className="deleteimg">
        <div className="date">
          <div className="start-date">
            开始时间：
            <DatePicker 
              placeholder="开始日期"
              value={moment(this.state.startTime, 'YYYY-MM-DD')}
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.startTime;
                newTime.setHours(curTime.getHours())
                newTime.setMinutes(curTime.getMinutes())
                newTime.setSeconds(curTime.getSeconds())
                this.setState({
                  startTime: newTime,
                })
              }}
            />
            <TimePicker 
              placeholder="开始时间"
              value={moment(this.state.startTime, 'HH:mm')}
              format='HH:mm'
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.startTime;
                newTime.setFullYear(curTime.getFullYear())
                newTime.setMonth(curTime.getMonth())
                newTime.setDate(curTime.getDate())
                this.setState({
                  startTime: newTime,
                })
              }}
            />
          </div>
          <div className="end-date">
            结束时间：
            <DatePicker 
              placeholder="结束日期"
              value={moment(this.state.endTime, 'YYYY-MM-DD')}
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.endTime;
                newTime.setHours(curTime.getHours())
                newTime.setMinutes(curTime.getMinutes())
                newTime.setSeconds(curTime.getSeconds())
                this.setState({
                  endTime: newTime,
                })
              }}
            />
            <TimePicker 
              placeholder="结束时间"
              value={moment(this.state.endTime, 'HH:mm')}
              format='HH:mm'
              onChange={(date) => {
                if (date == null)
                  return;
                const newTime = date.toDate();
                const curTime = this.state.endTime;
                newTime.setFullYear(curTime.getFullYear())
                newTime.setMonth(curTime.getMonth())
                newTime.setDate(curTime.getDate())
                this.setState({
                  endTime: newTime,
                })
              }}
            />
          </div>
          <Button type="primary" onClick={() => this.changeDateRange()}>筛选</Button>
        </div>
        <div className="shelf-id-search">
          屏柜ID筛选：
          <Search 
            placeholder="屏柜ID"
            onSearch={(value) => this.filtershelfid(value)}
            style={{width: 200}}
          />
        </div>
        <Table 
          columns={columns}
          dataSource={data}
          bordered
          className="log-table"
        />
        <Button type="primary" size="large" className="delete" onClick={(num) => this.delete()}>删除</Button>
        <Button type="primary" size="large" className="export" onClick={(num) => this.export()}>导出</Button>
      </div>
    )
  }
}