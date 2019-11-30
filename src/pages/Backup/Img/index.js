import React, {PureComponent} from 'react'
import {Table, DatePicker, TimePicker, Button, message, Popconfirm} from 'antd'
import moment from 'moment';
import {HOST} from '../../../config';
import ExportJsonExcel from 'js-export-excel';
import './index.css'

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: this.getOneHourBefore(),
      endTime: new Date(),
      // pageOffset: 1,
      // totalPages: 0,
      popVisble: false,
      tableData: [],
    }
  }

  componentDidMount() {
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    fetch(`${HOST}/getImageInfo.json?startTime=${startTime}&endTime=${endTime}`)
    .then(response => response.json())
    .then(response => {
      // const {totalPages} = response.data;
      const {pageData} = response.data;
      this.setState({
        tableData: pageData,
        // totalPages,
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
    this.updateImgs();
  }

  filterShelf(value) {
    this.setState({
      searchText: value,
    }, () => this.updateImgs())
    
  }

  updateImgs() {
    console.log('update imgs')
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    let url = `${HOST}/getImageInfo.json?startTime=${startTime}&endTime=${endTime}`;
    fetch(url)
    .then(response => response.json())
    .then(response => {
      // const {totalPages} = response.data;
      const {pageData} = response.data;
      this.setState({
        tableData: pageData,
        // totalPages,
      })
    })
  }

  beforeDelete() {
    const now = new Date();
    const halfYearBefore = now.getTime() - 1000 * 60 * 60 * 24 * 30 * 6;
    if (halfYearBefore <= this.state.endTime.getTime()) {
      message.info('无法删除近半年数据');
      this.setState({
        popVisble: false,
      });
    } else {
      this.setState({
        popVisble: true,
      })
    }
  }

  deleteImgs() {
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    fetch(`${HOST}/deleteImgs.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `userId=${window.sessionStorage.userId}&startTime=${startTime}&endTime=${endTime}`,
    }).then(response => response.json())
    .then(response => {
      if (response.data.pageData.success == 'yes') {
        message.success('删除图像成功');
        window.location.reload();
      } else {
        message.error(response.data.pageData.message);
      }
    })
  }

  exportImgs() {
    const {tableData} = this.state;
    if (tableData.length === 0) {
      message.info('无法导出');
      return;
    }
    let excelData = [];
    for (let item of tableData) {
      let obj = {
        '序号': item.seq,
        '屏柜ID': item.shelfId,
        '图像地址': item.imgUrl,
        '拍摄日期': item.time,
        '相机IP地址': item.ipAddress
      }
      excelData.push(obj);
    }
    let option = {};
    option.fileName = '图像表格';
    option.datas = [
      {
        sheetData: excelData,
        sheetName: 'sheet',
        sheetFilter: ['序号', '屏柜ID', '图像地址', '拍摄日期', '相机IP地址'],
        sheetHeader: ['序号', '屏柜ID', '图像地址', '拍摄日期', '相机IP地址']
      }
    ];
    let toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  render() {
    // const columns = [
    //   {
    //     title: '序号',
    //     dataIndex: 'seq',
    //     key: 'seq'
    //   },
    //   {
    //     title: '屏柜ID',
    //     dataIndex: 'shelfId',
    //     key: 'shelfId'
    //   },
    //   {
    //     title: '图像地址',
    //     dataIndex: 'imgUrl',
    //     key: 'imgUrl',
    //     render: (value) => (
    //       <a href={value} target="_blank">查看图像</a>
    //     )
    //   },
    //   {
    //     title: '拍摄日期',
    //     dataIndex: 'time',
    //     key: 'time'
    //   },
    //   {
    //     title: '相机IP地址',
    //     dataIndex: 'ipAddress',
    //     key: 'ipAddress',
    //   },
    //   {
    //     title: '',
    //     dataIndex: 'delete',
    //     key: 'delete',
    //     render: (value, record) => (
    //       <a onClick={() => this.deleteImg(record.imgUrl)}>删除</a>
    //     )
    //   }
    // ];
    const columns = [
      {
        title: '图片数量',
        dataIndex: 'imgNum',
        key: 'imgNum',
      },
      {
        title: '磁盘占用',
        dataIndex: 'diskInfo',
        key: 'diskInfo',
      }
    ]
    const data = [this.state.tableData];
    const startTime = this.formatDate(this.state.startTime, 'yyyy-MM-dd hh:mm:ss')
    const endTime = this.formatDate(this.state.endTime, 'yyyy-MM-dd hh:mm:ss')
    return (
      <div className="img">
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
        {/* <div className="user-search">
          屏柜筛选：
          <Search 
            placeholder="请输入屏柜ID"
            onSearch={(value) => this.filterShelf(value)}
            style={{width: 200}}
          />
        </div> */}
        <Table 
          columns={columns}
          dataSource={data}
          bordered
          className="img-table"
          pagination={false}
          // pagination={{
          //   current: this.state.pageOffset,
          //   total: this.state.totalPages*10,
          //   pageSize: 10,
          //   onChange: (page) => {
          //     this.setState({
          //       pageOffset: page,
          //     }, () => this.updateImgs())
          //   }
          // }}
        />
        {/* <Button type="primary" size="large" className="export" onClick={() => this.exportImgs()}>导出 excel</Button> */}
        <Popconfirm
          title={`确定要删除${startTime}到${endTime}这段时间的所有图片吗？`}
          visible={this.state.popVisble}
          onConfirm={() => {
            this.setState({
              popVisble: false,
            });
            this.deleteImgs();
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
          <Button type="primary" size="large" className="delete" onClick={() => this.beforeDelete()}>删除</Button>
        </Popconfirm>
      </div>
    )
  }
}