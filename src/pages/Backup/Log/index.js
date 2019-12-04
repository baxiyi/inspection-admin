import React, {PureComponent} from 'react'
import {Table, DatePicker, TimePicker, Button, message, Input, Popconfirm} from 'antd'
import moment from 'moment';
import {HOST} from '../../../config';
import ExportJsonExcel from 'js-export-excel';
import './index.css'

const {Search} = Input;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
      searchText: '',
      searchType: '',
      keyWords: '',
      pageOffset: 1,
      totalPages: 1,
      tableData: [],
      popVisble: false,
    }
  }

  componentDidMount() {
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    fetch(`${HOST}/getLogList.json?startTime=${startTime}&endTime=${endTime}&page=${this.state.pageOffset}&size=10`)
    .then(response => response.json())
    .then(response => {
      const {totalPages} = response.data;
      console.log(totalPages)
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          logId: item.logId,
          seq: index + 1,
          date: this.formatDate(new Date(item.logTime), 'yyyy-MM-dd hh:mm:ss'),
          handleDetail: item.content,
          user: item.usrByUsrId.usrName,
        }
      });
      this.setState({
        tableData,
        totalPages,
      })
    })
  }

  formatDate (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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

  filterUsers(value) {
    this.setState({
      searchText: value,
      searchType: 'userId',
    }, () => this.updateLogs())
    
  }

  searchKeyWords(value) {
    this.setState({
      keyWords: value,
      searchType: 'keyWords',
    }, () => this.updateLogs())
  }

  updateLogs() {
    console.log('update logs')
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    console.log(endTime);
    let url = `${HOST}/getLogList.json?startTime=${startTime}&endTime=${endTime}&page=${this.state.pageOffset}&size=10`;
    if (this.state.searchText !== '' && this.state.searchType === 'userId') {
      url = url + `&userId=${this.state.searchText}`;
    }
    if (this.state.keyWords !== '' && this.state.searchType === 'keyWords') {
      url = url + `&keyWords=${this.state.keyWords}`;
    }
    fetch(url)
    .then(response => response.json())
    .then(response => {
      if (response.code != 0) {
        message.error(response.message);
        return;
      }
      const {totalPages} = response.data;
      console.log(totalPages)
      const {pageData} = response.data;
      const tableData = pageData.map((item, index) => {
        return {
          logId: item.logId,
          seq: index + 1,
          date: this.formatDate(new Date(item.logTime), 'yyyy-MM-dd hh:mm:ss'),
          handleDetail: item.content,
          user: item.usrByUsrId.usrName,
        }
      });
      this.setState({
        tableData,
        totalPages,
      })
    })
  }

  deleteLog(logId) {
    fetch(`${HOST}/deleteLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `userId=${window.sessionStorage.userId}&logId=${logId}`,
    }).then(response => response.json())
    .then(response => {
      if (response.code == 0) {
        message.success('删除日志成功', 1)
        .then(() => window.location.reload())
      } else {
        message.error(response.message);
      }
    })
  }

  exportLogs() {
    const {tableData} = this.state;
    if (tableData.length === 0) {
      message.info('无法导出');
      return;
    }
    let excelData = [];
    for (let item of tableData) {
      let obj = {
        '序号': item.seq,
        '日期': item.date,
        '操作': item.handleDetail,
        '用户': item.user,
      }
      excelData.push(obj);
    }
    let option = {};
    option.fileName = '日志表格';
    option.datas = [
      {
        sheetData: excelData,
        sheetName: 'sheet',
        sheetFilter: ['序号', '日期', '操作', '用户'],
        sheetHeader: ['序号', '日期', '操作', '用户']
      }
    ];
    let toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  beforeDelete() {
    this.setState({
      popVisble: true,
    })
  }

  deleteLogs() {
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss');
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss');
    fetch(`${HOST}/deleteLogs.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `userId=${window.sessionStorage.userId}&startTime=${startTime}&endTime=${endTime}`
    }).then(response => response.json)
    .then(response => {
      if (response.code == 0) {
        message.success('删除日志成功', 1)
        .then(() => window.location.reload())
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
        key: 'seq'
      },
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: '操作',
        dataIndex: 'handleDetail',
        key: 'handleDetail'
      },
      {
        title: '用户',
        dataIndex: 'user',
        key: 'user'
      }
    ];
    if (window.sessionStorage.userPrivilege == 3) {
      columns.push({
        title: '',
        dataIndex: 'delete',
        key: 'delete',
        render: (value, record) => (
          <a onClick={() => this.deleteLog(record.logId)}>删除</a>
        )
      })
    }
    // 需获取
    // const data = [
    //   {
    //     seq: '1',
    //     date: '2019-10-11',
    //     handleDetail: '操作1',
    //     user: '用户1',
    //   },
    //   {
    //     seq: '2',
    //     date: '2019-10-11',
    //     handleDetail: '操作2',
    //     user: '用户2',
    //   },
    //   {
    //     seq: '3',
    //     date: '2019-10-10',
    //     handleDetail: '操作3',
    //     user: '用户3',
    //   }
    // ]
    const data = this.state.tableData;
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    return (
      <div className="log">
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
        <div className="user-search">
          用户筛选：
          <Search 
            placeholder="请输入用户ID"
            onSearch={(value) => this.filterUsers(value)}
            style={{width: 200}}
          />
        </div>
        <div className="keywords-search">
          关键字检索：
          <Search 
            placeholder="请输入搜索关键字"
            onSearch={(value) => this.searchKeyWords(value)}
            sytle={{width: 200}}
            className="keywords-input"
          />
        </div>
        <Table 
          columns={columns}
          dataSource={data}
          bordered
          className="log-table"
          pagination={{
            current: this.state.pageOffset,
            total: this.state.totalPages*10,
            pageSize: 10,
            onChange: (page) => {
              this.setState({
                pageOffset: page,
              }, () => this.updateLogs())
            }
          }}
        />
        <Button type="primary" size="large" className="export" onClick={() => this.exportLogs()}>导出 excel</Button>
        {
          window.sessionStorage.userPrivilege == 3
          ? (
            <Popconfirm
              title={`确定要删除${startTime}到${endTime}这段时间的所有日志吗？`}
              visible={this.state.popVisble}
              onConfirm={() => {
                this.setState({
                  popVisble: false,
                });
                this.deleteLogs();
              }}
              onCancel={() => {
                this.setState({
                  popVisble: false,
                })
              }}
              okText="是"
              cancelText="否"
              className="pop-confirm"
              placement="bottomRight"
            >
              <Button type="primary" size="large" className="delete" onClick={() => this.beforeDelete()}>批量删除</Button>
            </Popconfirm>
          ) : null
        }
      </div>
    )
  }
}