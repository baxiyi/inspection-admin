import React, {PureComponent} from 'react'
import {Table,Input, Modal, message} from 'antd'
import './index.css'
import { HOST } from '../../config';

const { Search } = Input;

export default class extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      searchType: '',
      unitId: '',
      shelfId: '',
      category: '',
      tableData: [],
      isShowWarningItems: false,
      warningItemsData: [],
      totalPages: 1,
      pageOffset: 1,
    }
  }

  componentDidMount() {
    fetch(`${HOST}/getUnitList.json?page=${this.state.pageOffset}&size=10`)
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
      const {totalPages} = response.data;
      this.setState({
        tableData,
        totalPages,
      })
    })
  }

  updateUnitList() {
    const {searchType} = this.state;
    const {unitId} = this.state;
    const {shelfId} = this.state;
    const {category} = this.state;
    let url = '';
    switch(searchType) {
      case 'unitId':
        url = `${HOST}/getUnitList.json?page=${this.state.pageOffset}&size=10&unitId=${unitId}`;
        break;
      case 'shelfId':
        url = `${HOST}/getUnitList.json?page=${this.state.pageOffset}&size=10&shelfId=${shelfId}`;
        break;
      case 'category':
        url = `${HOST}/getUnitList.json?page=${this.state.pageOffset}&size=10&category=${category}`;
        break;
      default:
        break;
    }
    fetch(url)
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
      const {totalPages} = response.data;
      this.setState({
        tableData,
        totalPages,
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

  showWarningItems(warningItems) {
    const warningItemsData = warningItems.map((item, index) => {
      return {
        seq: index + 1,
        ...item,
      }
    });
    this.setState({
      isShowWarningItems: true,
      warningItemsData,
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
        render: (arr, record) => (
          <a onClick={() => this.showWarningItems(arr)}>查看详情</a>
        )
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
    const warningItemsColumns = [
      {
        title: '序号',
        dataIndex: 'seq',
        key: 'seq',
      },
      {
        title: '设备单元1',
        dataIndex: 'unitId1',
        key: 'unitId1',
      },
      {
        title: '设备单元2',
        dataIndex: 'unitId2',
        key: 'unitId2'
      },
      {
        title: '关系',
        dataIndex: 'relation',
        key: 'relation',
      }
    ];
    const {warningItemsData} = this.state;
    const data = this.state.tableData;
    return (
      <div className="on">
        <Search
          className="dev-query"
          placeholder="设备单元id"
          enterButton="查询"
          size="Small"
          onSearch={value => this.setState({
            searchType: 'unitId',
            unitId: value,
          }, () => this.updateUnitList())}
        />
        <Search
          className="shelf-query"
          placeholder="屏柜ID"
          enterButton="查询"
          size="Small"
          onSearch={value => this.setState({
            searchType: 'shelfId',
            shelfId: value,
          }, () => this.updateUnitList())}
        />
        <Search
          className="category-query"
          placeholder="设备类型"
          enterButton="查询"
          size="Small"
          onSearch={value => this.setState({
            searchType: 'category',
            category: value,
          }, () => this.updateUnitList())}
        />
        <Table
          columns={columns}
          dataSource={data}
          bordered
          className="unit-table"
          pagination={{
            current: this.state.pageOffset,
            total: this.state.totalPages*10,
            pageSize: 10,
            onChange: (page) => {
              this.setState({
                pageOffset: page,
              }, () => this.updateUnitList())
            }
          }}
        ></Table>
        <Modal 
          visible={this.state.isShowWarningItems}
          title="警告项详情"
          okText="确认"
          cancelText="取消"
          onOk={() => {
            this.setState({
              isShowWarningItems: false,
              warningItemsData: [],
            })
          }}
          onCancel={() => {
            this.setState({
              isShowWarningItems: false,
              warningItemsData: [],
            })
          }}
        >
          <Table
            columns={warningItemsColumns}
            dataSource={warningItemsData}
            bordered
            pagination={false}
          ></Table>
        </Modal>
      </div>
    );
  } 
}