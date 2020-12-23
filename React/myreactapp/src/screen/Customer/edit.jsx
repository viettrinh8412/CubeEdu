import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import moment from "moment";
import "../Customer/index.css";
import FormInvoice from "./invoice";
import {Input, DatePicker, Modal, Select, message, Button, Radio, Checkbox, Space, Tabs, Table, Popconfirm, Tag} from "antd";
import {EditOutlined, PrinterOutlined, DeleteOutlined, ZoomInOutlined, CloseOutlined, SaveOutlined} from "@ant-design/icons";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const { TabPane } = Tabs;
const { Option } = Select;

export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      data: {},
      lstData: [],
      lstProvince: [],
      lstWard: [],
      lstDistrict: [],
      lstInvoice: [],
      lstClass: [],
      totalPayment:[],
      createTime:[],
    };

    this.InvoiceForm = React.createRef();
  }

  getChart() {
    var options = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Biểu đồ phiếu thu'
      },
      xAxis: {
        categories: this.state.createTime
        
      },
      yAxis: {
        title: {
          text: 'Số tiền (VND)'
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [{
        name: 'Phiếu thu',
        data: this.state.totalPayment
      }]
    };
    return options;
  }

  getClassStudentDetail() {
    var columns = [
      {
        title: "Mã lớp",
        dataIndex: "Name",
        sorter: (a, b) => {
          return a.Name.localeCompare(b.Name);
        },
      },
      {
        title: "Lịch học",
        dataIndex: "BeginDate",
        sorter: (a, b) => {
          return a.BeginDate.localeCompare(b.BeginDate);
        },
        render: (text, record) => (
          <>
            <div>{moment(text).format("DD-MM-YYYY")}</div>
            <div>
              <Tag>{record.BeginTime}</Tag>
              <Tag>{record.EndTime}</Tag>
            </div>
          </>
        ),
      },
      {
        title: "Học phí",
        children: [
          {
            title: "Học phí",
            dataIndex: "Fee",
            sorter: (a, b) => {
              return a.Fee - b.Fee;
            },
          },
          {
            title: "Đã đóng",
            dataIndex: "TotalPayment",
            sorter: (a, b) => {
              return a.TotalPayment - b.TotalPayment;
            },
          },
          {
            title: "Miễn giảm",
            dataIndex: "DiscountAmount",
            sorter: (a, b) => {
              return a.DiscountAmount - b.DiscountAmount;
            },
          },
          {
            title: "Phải đóng thêm",
          },
          {
            title: "Ngày hết hạn",
            dataIndex: "EndDate",
            sorter: (a, b) => {
              return a.EndDate.localeCompare(b.EndDate);
            },
            render: (text, record) => (
              <>{moment(record.EndDate).format("DD-MM-YYYY")}</>
            ),
          },
          {
            key: "Action",
            render: (text, record) => (
              <Space size="middle">
                <Button
                  type="primary"
                  onClick={() => this.openInvoice(record.ID)}
                >
                  <EditOutlined />
                </Button>
                <Popconfirm title="Bạn có chắc chắc xoá?">
                  <Button type="default">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ],
      },
    ];
    return columns;
  }

  getColumns() {
    var columns = [
      {
        title: "Mã phiếu",
        dataIndex: "Code",
        sorter: (a, b) => {
          return a.Code.localeCompare(b.Code);
        },
        render: (text, record) => (
          <>
            <p>{text}</p>
            {record.Description}
          </>
        ),
      },
      {
        title: "Ngày đóng",
        dataIndex: "InvoiceDate",
        sorter: (a, b) => {
          return a.InvoiceDate.localeCompare(b.InvoiceDate);
        },
        render: (text, record) => (
          <>{moment(record.InvoiceDate).format("DD-MM-YYYY")}</>
        ),
      },
      {
        title: "Nhân viên thu",
        dataIndex: "Payer",
        sorter: (a, b) => {
          return a.Payer.localeCompare(b.Payer);
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "TotalAmount",
        sorter: (a, b) => {
          return a.TotalAmount.localeCompare(b.TotalAmount);
        },
      },
      {
        title: "Thực thu",
        dataIndex: "TotalPayment",
        sorter: (a, b) => {
          return a.TotalPayment.localeCompare(b.TotalPayment);
        },
      },
      {
        title: "Miễn giảm",
        dataIndex: "Discount",
        sorter: (a, b) => {
          return a.Discount.localeCompare(b.Discount);
        },
      },
      {
        key: "Action",
        render: (text, record) => (
          <Space size="middle">
            <Button type="primary" onClick={() => this.openInvoice(record.ID)}>
              <EditOutlined />
            </Button>

            <Button type="default">
              <PrinterOutlined />
            </Button>
          </Space>
        ),
      },
    ];
    return columns;
  }

  componentDidMount() {
    this.getListProvince();
    this.getListDistrict();
    this.getListWard();
    this.getListInvoices();
    this.getListClass();
    this.getReportInvoice();
  }

  getListClass = () => {
    APIHelper.post("Customer/GetListClass").then((data) => {
      this.setState({ lstClass: data });
    });
  };

  getReportInvoice = () => {
    var totalPayment = this.state.totalPayment;
    var createTime = this.state.createTime;
    APIHelper.post("Customer/ReportInvoice").then((data) => {
      data.map(item =>{
        totalPayment.push(item.TotalPayment);
        createTime.push(item.CreateTime);
      })
      console.log(createTime, totalPayment);
      this.setState({ createTime: createTime, totalPayment: totalPayment });
    });
  };

  getListProvince() {
    APIHelper.get("Customer/GetListProvince").then((data) => {
      this.setState({ lstProvince: data });
    });
  }

  getListDistrict(id) {
    APIHelper.get("Customer/GetListDistrict?id=" + id).then((data) => {
      console.log(data);
      this.setState({ lstDistrict: data });
    });
  }

  getListInvoices = () => {
    APIHelper.post("Customer/ListInvoice").then((data) => {
      this.setState({ lstInvoice: data });
    });
  };
  loadDataInvoice = () => {
    if (this.state.value !== undefined) {
      this.getListInvoices(this.state.value);
    } else {
      this.getListInvoices("");
    }
  };

  getListWard(id) {
    APIHelper.get("Customer/GetListWard?id=" + id).then((data) => {
      console.log(data);
      this.setState({ lstWard: data });
    });
  }

  getClassDetail = (id) => {
    APIHelper.get("Customer/GetClassStudentDetail?id=" + id).then((data) => {
      this.setState({ lstData: data });
      if (this.props.onReload) {
        this.props.onReload();
      }
    });
  };

  loadClassStudentDetail = () => {
    if (this.state.value !== undefined) {
      this.getClassDetail(this.state.value);
    } else {
      this.getClassDetail("");
    }
  };

  openInvoice = (id) => {
    this.InvoiceForm.current.open(id);
  };

  open = (id) => {
    this.setState({ isVisible: true });
    if (id) {
      APIHelper.getUrl("Customer/GetSingleCustomer", { id: id }).then(
        (data) => {
          this.setState({ data: data });
          this.getClassDetail(id);
        }
      );
    } else {
      var data = {};
      this.setState({ data: data });
    }
  };
  close() {
    this.setState({ isVisible: false });
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  validateData() {
    var result = true;
    var data = { ...this.state.data };
    if (!data.Name) {
      message.error("Name is required!");
      result = false;
    }

    return result;
  }

  handleOk = () => {
    var check = this.validateData();
    if (check) {
      APIHelper.post("Customer/Update", this.state.data).then((newData) => {
        if (newData === true) {
          Modal.success({
            content: "Success",
          });
        } else {
          Modal.error({
            title: "This is an error message",
            content: "Error",
          });
        }
        if (this.props.onReload) {
          this.props.onReload();
        }
        this.setState({ isVisible: false });
      });
    }
  };

  onChange = (e) => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  onDataChange = (name, value) => {
    var data = { ...this.state.data };
    data[name] = value;
    this.setState({ data: data });
  };

  onDataChangeDistrict = (value) => {
    console.log(value);
    this.getListDistrict(value);
  };

  onDataChangeWard = (value) => {
    console.log(value);
    this.getListWard(value);
  };

  handlePhone(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      var data = { ...this.state.data };
      data[("Phone1", "Phone2")] = e.target.value;
      this.setState({ data: data });
    }
  }

  render() {
    var columns = this.getColumns();
    var classStudentDetail = this.getClassStudentDetail();
    var options = this.getChart();
    var item = this.state.data;
    var lstProvinceRender = [...this.state.lstProvince];
    var lstWardRender = [...this.state.lstWard];
    var lstDistrictRender = [...this.state.lstDistrict];
    var lstInvoice = [...this.state.lstInvoice];
    var classDetail = [...this.state.lstData];
    var lstClass = [...this.state.lstClass];

    return (
      <Modal
        width={1300}
        title="Customer"
        visible={this.state.isVisible}
        onOk={this.handleOk}
        onCancel={() => this.close()}
        footer={[
          <Button key="close" onClick={() => this.close()}>
            <CloseOutlined /> Đóng
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={this.handleOk}
          >
            <SaveOutlined /> Lưu
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin" key="1">
            <div className="col-2">
              <div>
                <label>Số điện thoại 1 </label>
                <Input.Group compact style={{ width: "600px" }}>
                  <Select style={{ width: "88px" }} defaultValue="+84">
                    <Option value="+84">+84</Option>
                    <Option value="+86">+86</Option>
                  </Select>
                  <Input
                    style={{ width: "512px" }}
                    value={item.Phone1}
                    onChange={(e) => {
                      this.handlePhone(e);
                    }}
                    name="Phone1"
                    placeholder="Please input your phone number"
                  />
                </Input.Group>
              </div>

              <div>
                <label>Số điện thoại 2 </label>
                <Input.Group compact style={{ width: "600px" }}>
                  <Select style={{ width: "88px" }} defaultValue="+84">
                    <Option value="+84">+84</Option>
                    <Option value="+86">+86</Option>
                  </Select>
                  <Input
                    style={{ width: "512px" }}
                    value={item.Phone2}
                    onChange={(e) => {
                      this.handlePhone(e);
                    }}
                    name="Phone2"
                    placeholder="Please input your phone number"
                  />
                </Input.Group>
              </div>
            </div>

            <div className="col-2">
              <div>
                <label>Họ tên </label>
                <div>
                  <Input
                    style={{ width: "600px" }}
                    value={item.Name}
                    onChange={(e) => {
                      this.onDataChange("Name", e.target.value);
                    }}
                    name="Name"
                    placeholder="Please input your name"
                  />
                </div>
              </div>

              <div>
                <label>Email </label>
                <div>
                  <Input
                    style={{ width: "600px" }}
                    type="email"
                    value={item.Email}
                    onChange={(e) => {
                      this.onDataChange("Email", e.target.value);
                    }}
                    key="Email"
                    placeholder="Please input your email"
                  />
                </div>
              </div>
            </div>

            <div className="col-2">
              <div style={{ paddingTop: "0px", marginBottom: "5px" }}>
                <label> Giới tính </label>
                <div>
                  <Radio.Group
                    value={item.Gender}
                    style={{ width: "600px" }}
                    onChange={(e) => {
                      this.onDataChange("Gender", e.target.value);
                    }}
                  >
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                    <Radio value="Khác">Khác</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div>
                <label>Ngày sinh </label>
                <div>
                  <DatePicker
                    style={{ width: "600px" }}
                    format="DD-MM-YYYY"
                    value={moment.utc(item.Birthday)}
                    onChange={(e) => {
                      this.onDataChange("Birthday", e);
                    }}
                    name="Birthday"
                    placeholder="Please select your birthday"
                  />
                </div>
              </div>
            </div>

            <div className="col-2">
              <div>
                <label>Phân loại khách hàng </label>
                <div>
                  <Select
                    style={{ width: "600px" }}
                    placeholder="Please select your classification"
                    value={item.Classification}
                    onChange={(e) => {
                      this.onDataChange("Classification", e);
                    }}
                  >
                    <Option value="Normal">Normal</Option>
                    <Option value="Scholar">Scholar</Option>
                    <Option value="Poor">Poor</Option>
                    <Option value="FamilyPolicy">FamilyPolicy</Option>
                  </Select>
                </div>
              </div>
              <div>
                <label>Địa chỉ </label>
                <div>
                  <Input
                    style={{ width: "600px" }}
                    value={item.Address}
                    onChange={(e) => {
                      this.onDataChange("Address", e.target.value);
                    }}
                    name="Address"
                    placeholder="Please input your name"
                  />
                </div>
              </div>
            </div>

            <div className="col-3">
              <div>
                <label>Tỉnh </label>
                <div>
                  <Select
                    style={{ width: "390px" }}
                    placeholder="Please select your Province"
                    value={item.ProvinceID}
                    onChange={(e) => {
                      this.onDataChange("ProvinceID", e);
                      this.onDataChangeDistrict(e);
                    }}
                  >
                    {lstProvinceRender.map((val, index) => (
                      <Option value={val.ID}>{val.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <label>Quận/Huyện </label>
                <div>
                  <Select
                    style={{ width: "390px" }}
                    placeholder="Please select your District"
                    value={item.DistrictID}
                    onChange={(e) => {
                      this.onDataChange("DistrictID", e);
                      this.onDataChangeWard(e);
                    }}
                  >
                    {lstDistrictRender.map((val, index) => (
                      <Option
                        selected={
                          item.DistrictID === val.Name ? "selected" : ""
                        }
                        value={val.ID}
                      >
                        {val.Name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <label>Phường/Xã </label>
                <div>
                  <Select
                    style={{ width: "390px" }}
                    placeholder="Please select your Ward"
                    value={item.WardID}
                    onChange={(e) => {
                      this.onDataChange("WardID", e);
                    }}
                  >
                    {lstWardRender.map((val, index) => (
                      <Option
                        selected={item.WardID === val.ID ? "selected" : ""}
                        value={val.ID}
                      >
                        {val.Name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <label>Ghi chú </label>
              <div>
                <Input
                  value={item.Note}
                  onChange={(e) => {
                    this.onDataChange("Note", e.target.value);
                  }}
                  placeholder="Please input your language, level"
                />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <Checkbox
                checked={item.CheckRegister === 1 ? true : false}
                onChange={(e) => {
                  this.onDataChange("CheckRegister", e.target.checked);
                }}
              ></Checkbox>
              <label> Đăng ký cho người khác </label>
            </div>
          </TabPane>

          <TabPane tab="Đăng ký lớp" key={2}>
            <Table
              columns={classStudentDetail}
              dataSource={classDetail}
              bordered
            />
            <div>
              <label style={{ marginRight: "8%" }}>Đăng ký lớp</label>
              <Select mode="multiple" style={{ width: "60%" }}>
                {lstClass.map((item, index) => (
                  <Option value={item.ID}>{item.Name}</Option>
                ))}
              </Select>
              <Button type="primary" style={{ marginRight: "5%" }}>
                <ZoomInOutlined />
              </Button>
              <Button type="primary" htmlType="submit">
                Đăng ký
              </Button>
            </div>
          </TabPane>

          <TabPane tab="Học phí" key={3}>
            <Table columns={columns} dataSource={lstInvoice} />
            <FormInvoice
              ref={this.InvoiceForm}
              onReload={() => this.loadDataInvoice()}
            />
            <Button
              className="btn-fee"
              type="primary"
              onClick={() => this.openInvoice()}
            >
              Thu tiền
            </Button>
          </TabPane>
          <TabPane tab="Chart" key={4}>
            <HighchartsReact options={options} highcharts={Highcharts}></HighchartsReact>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
