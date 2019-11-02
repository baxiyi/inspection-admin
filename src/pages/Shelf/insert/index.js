import React, {PureComponent} from 'react'
import { Steps, Button, message, Table } from 'antd';
import './index.css'

const { Step } = Steps;

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      shelfId: '',
      shelfName: '',
      row: '',
      column: '',
      cnt: '',
      unitCnt: '',
      unitInfor: [],
    };
  }

  next() {
    const currentStep = this.state.currentStep + 1;
    this.setState({ currentStep });
  }

  prev() {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  }

  renderFistStep() {
    const renderEdit = (value) => (<a>可编辑</a>)
    const columns = [
      {
        title: '屏柜编号',
        dataIndex: 'shelfId',
        editable: true,
        render: renderEdit,
      },
      {
        title: '屏柜名称',
        dataIndex: 'shelfName',
        editable: true,
        render: renderEdit,
      },
      {
        title: '第几行',
        dataIndex: 'row',
        editable: true,
        render: renderEdit,
      },
      {
        title: '第几列',
        dataIndex: 'column',
        editable: true,
        render: renderEdit,
      },
      {
        title: '部分个数',
        dataIndex: 'unitCnt',
        editable: true,
        render: renderEdit,
      }
    ];
    const data = [
      {
        key: '1',
      }
    ]
    return (
      <Table
        columns={columns}
        dataSource={data}
        bordered
        className="my-table"
        pagination={false}
      />
    )
  }

  renderSecondStep() {
    const renderUpLoad = (value) => (<a>上传</a>);
    const renderEdit = (value) => (<a>可编辑</a>)
    const columns = [
      {
        title: '部分序号',
        dataIndex: 'unitSeq',
        editable: true,
      },
      {
        title: '图像文件',
        dataIndex: 'imageFile',
        editable: true,
        render: renderUpLoad,
      },
      {
        title: '标注文件',
        dataIndex: 'labelFile',
        editable: true,
        render: renderUpLoad,
      },
      {
        title: '对应摄像头IP地址',
        dataIndex: 'ipAddress',
        editable: true,
        render: renderEdit,
      },
    ];
    const data = [
      {unitSeq: '1'},
      {unitSeq: '2'},
    ]
    return (
      <Table 
        className="my-table"
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    );
  }

  renderThirdStep() {
    const renderEdit = (value) => (<a>可编辑</a>)
    const renderUneitable = (value) => (<a className="uneditable-link">不可编辑</a>)
    const columns = [
      {
        title: '设备区域ID',
        dataIndex: 'areaId',
        render: renderUneitable,
      },
      {
        title: '设备区域名称',
        dataIndex: 'areaName',
        editable: true,
        render: renderEdit,
      },
      {
        title: '左上点横坐标',
        dataIndex: 'leftTopX',
        render: renderUneitable,
      },
      {
        title: '左上点纵坐标',
        dataIndex: 'leftTopY',
        render: renderUneitable,
      },
      {
        title: '右下点横坐标',
        dataIndex: 'rightBottomX',
        render: renderUneitable,
      },
      {
        title: '右下点纵坐标',
        dataIndex: 'rightBottomY',
        render: renderUneitable,
      }
    ];
    const data = [
      {key: '1'},
      {key: '2'},
    ]
    return (
      <Table 
        className="my-table"
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    )
  }
  
  renderFourthStep() {
    const renderEdit = (value) => (<a>可编辑</a>)
    const renderUneitable = (value) => (<a className="uneditable-link">不可编辑</a>)
    const columns = [
      {
        title: '设备单元ID',
        dataIndex: 'devUnitId',
        render: renderUneitable,
      },
      {
        title: '设备含义',
        dataIndex: 'devMeaning',
        render: renderEdit,
      },
      {
        title:'设备类别',
        dataIndex: 'devCategory',
        render: renderEdit,
      },
      {
        title: '设备正常状态',
        dataIndex: 'devNormalStatus',
        render: renderEdit,
      },
      {
        title: '是否启用',
        dataIndex: 'isOn',
        render: renderEdit,
      },
      {
        title: '左上点横坐标',
        dataIndex: 'leftTopX',
        render: renderUneitable,
      },
      {
        title: '左上点纵坐标',
        dataIndex: 'leftTopY',
        render: renderUneitable,
      },
      {
        title: '右下点横坐标',
        dataIndex: 'rightBottomX',
        render: renderUneitable,
      },
      {
        title: '右下点纵坐标',
        dataIndex: 'rightBottomY',
        render: renderUneitable,
      }
    ];
    const data = [
      {key: '1'},
      {key: '2'},
    ];
    return (
      <Table 
        columns={columns}
        dataSource={data}
        bordered
        className="my-table"
        pagination={false}
      />
    )
  }

  render() {
    const steps = [
      {
        title: '第一步:输入屏柜信息',
        renderMethod: this.renderFistStep,
      },
      {
        title: '第二步:导入屏柜部分标注文件',
        renderMethod: this.renderSecondStep,
      },
      {
        title: '第三步:完善设备区域信息',
        renderMethod: this.renderThirdStep,
      },
      {
        title: '第四步:完善设备单元信息',
        renderMethod: this.renderFourthStep,
      }
    ];
    const { currentStep } = this.state;
    return (
      <div className="shelf-insert">
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div>
          {steps[currentStep].renderMethod()}
        </div>
        <div className="steps-action">
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={() => {
              message.success('录入屏柜完成');
              this.setState({
                currentStep: 0,
              })
            }}>
              确认无误，完成
            </Button>
          )}
        </div>
      </div>
    );
  }
}