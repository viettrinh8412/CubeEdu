import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import {
  Input,
  Modal,
  Select,
  DatePicker,
  Form,
  Button,
  Radio,
  Upload,
  Tabs,
  Table,
  Row,
  Col,
  Card,
  Tag,
} from "antd";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import "../Teacher/index.css";

const { Option } = Select;
const { TabPane } = Tabs;

function callback() {}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      data: {},
      lstBranch: [],
      lstProvince: [],
      lstDistrict: [],
      lstStatusTeacher: [],
      loading: false,
      lstDate: [],
      totalStatus: [],
      statusName: [],                             
    };
  }

  getOption() {

    var a = this.state.statusName;


    debugger;
    var options = {
      chart: {
        type: "pie",
      },
      title: {
        text: "Trạng thái lớp học",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      // plotOptions: {
      //   pie: {
      //     dataLabels: {
      //       enabled: true,
      //       format: "<b>{series.name}</b> ",
      //     },
      //   },
      // },

      series: [
        {
          name: '',
          data: this.state.totalStatus,
        },
      ],
    };
    return options;
  }

 
  getColumn() {
    var columns = [
      {
        title: "Days of the week",
        dataIndex: "DaysOfTheWeek",
        key: "DaysOfTheWeek",
        sorter: (a, b) => {
          return a.DaysOfTheWeek.localeCompare(b.DaysOfTheWeek);
        },
        render: (text, record) => (
          <Tag color="success">{record.DaysOfTheWeek}</Tag>
        ),
      },

      {
        title: "Date",
        dataIndex: "Dates",
        key: "Dates",
        sorter: (a, b) => {
          return a.Dates.localeCompare(b.Dates);
        },
        render: (text, record) => (
          <>{moment(record.Dates).format("DD-MM-YYYY")}</>
        ),
      },

      {
        title: "SubjectName",
        dataIndex: "SubjectName",
        key: "SubjectName",
        sorter: (a, b) => {
          return a.SubjectName.localeCompare(b.SubjectName);
        },
      },
      {
        title: "Time",
        dataIndex: "Time",
        key: "Time",
        sorter: (a, b) => {
          return a.Time.localeCompare(b.Time);
        },
        render: (text, record) => (
          <Tag color="red">{this.getSession(record.Time)}</Tag>
        ),
      },
    ];
    return columns;
  }

  getSession(record) {
    var format = "ss";

    if (record < "12:00:00") {
      format = "Morning";
    } else if (record >= "12:00:00" && record <= "17:00:00") {
      format = "Afternoon";
    } else if (record >= "17:00:00" && record <= "24:00:00") {
      format = "Evening";
    }
    return format;
  }

  componentDidMount() {
    debugger;
    this.getListBranch();
    this.getListProvince();
    this.getListStatusTeacher();
    this.searchList();
    this.getStatusClass();
  }

  //   componentDidUpdate() {
  //     this.getListDistrict(this.state.data.PlaceOfBirth);
  //   }

  getListBranch() {
    APIHelper.get("Teacher/GetListBranch").then((data) => {
      this.setState({ lstBranch: data });
    });
  }

  getListProvince() {
    APIHelper.get("Teacher/GetListProvince").then((data) => {
      this.setState({ lstProvince: data });
    });
  }

  getListDistrict(ID) {
    APIHelper.get("Teacher/GetListDistrict?ID=" + ID).then((data) => {
      this.setState({ lstDistrict: data });
    });
  }

  getListStatusTeacher() {
    APIHelper.get("Teacher/GetListStatusTeacher").then((data) => {
      this.setState({ lstStatusTeacher: data });
    });
  }

  getStatusClass = () => {
    var totalStatus = [...this.state.totalStatus];
    var statusName = [...this.state.statusName];
    APIHelper.post("Teacher/GetStatusClass").then((data) => {
      debugger;
      data.map((item) => {
        totalStatus.push({name: item.StatusName, y: item.TotalStatus});
        statusName.push({name: item.StatusName, y: item.TotalStatus});
      });
      console.log(totalStatus, statusName);
      this.setState({ totalStatus: totalStatus, statusName: statusName },
        ()=>{ console.log(this.state.statusName);});
    });
  };

  searchList = () => {
    this.GetSearchClassTimeTables(" ", " ", " ");
  };

  GetSearchClassTimeTables = (Search, StartDate, EndDate) => {
    var Searchs = Search !== undefined ? Search : " ";
    var StartDates = StartDate !== undefined ? StartDate : " ";
    var EndDates = EndDate !== undefined ? EndDate : " ";
    console.log(StartDates + " " + EndDates);
    APIHelper.post(
      "Teacher/GetSearchClassTimeTables?id=" +
        Searchs +
        "&StartDate=" +
        StartDates +
        "&EndDate=" +
        EndDates
    ).then((data) => {
      console.log(data);
      this.setState({
        lstDate: data,
      });
      if (this.props.onReload) {
        this.props.onReload();
      }
    });
  };

  // getClassTimeTable = (id) => {
  //   APIHelper.get("Teacher/GetClassTimeTables?TeacherID=" + id ).then((data) => {
  //   console.log(id);
  //     this.setState({
  //       lstDate: data,
  //     });
  //     if (this.props.onReload) {
  //       this.props.onReload();
  //     }
  //   }
  //   );
  // };

  open(id) {
    this.setState({ isVisible: true });
    if (id) {
      APIHelper.getUrl("Teacher/GetSingleTeacher", { id: id }).then((data) => {
        this.setState({
          data: data,
        });
        console.log(data);
        //this.getClassTimeTable(id);
        this.onDataChange("id", id);
      });
    } else {
      var data = {};
      this.setState({ data: data });
    }
  }

  close() {
    this.setState({ isVisible: false });
  }

  // validateData() {
  //   var result = true;
  //   var data = { ...this.state.data };
  //   return result;
  // }

  handleOk = () => {
    // var check = this.validateData();
    APIHelper.post("Teacher/UpdateTeacher", this.state.data).then((newData) => {
      if (newData == true) {
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
  };

  onDataChange = (name, value) => {
    var data = { ...this.state.data };
    data[name] = value;
    this.setState({ data: data });
  };
  onSearchDateChange = (name, value) => {
    var data = { ...this.state.data };
    data[name] = value;
    this.setState({ data: data });
  };

  onSelectPlaceOfBirth(value) {
    this.getListDistrict(value);
  }

  handlePhone(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      var data = { ...this.state.data };
      data["Phone"] = e.target.value;
      this.setState({ data: data });
    }
  }

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        //this.setState({ loading: false }),
        this.onDataChange("Images", imageUrl);
      });
    }
  };

  render() {
    var opt = this.getOption();
    var item = this.state.data;
    var lstBranchRender = [...this.state.lstBranch];
    var lstProvinceRender = [...this.state.lstProvince];
    var lstDistrictRender = [...this.state.lstDistrict];
    var lstStatusTeacherRender = [...this.state.lstStatusTeacher];
    var col = this.getColumn();
    var lstDate = [...this.state.lstDate];

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div>Upload</div>
      </div>
    );
    const uploadedButton = (
      <div>{this.state.loading ? <LoadingOutlined /> : <UserOutlined />}</div>
    );

    return (
      <Modal
        title="Personal Information"
        className="ant-modal-resize"
        visible={this.state.isVisible}
        footer={null}
        //onOk={this.handleOk}
        onCancel={() => this.close()}
      >
        <div>
          <div>
            <Upload
              name="Images"
              listType="picture-card"
              className="avatar-uploaded"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={this.handleChange}
            >
              {item.Images ? (
                <img src={item.Images} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadedButton
              )}
            </Upload>
          </div>
        </div>
        <div>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Staff Information" key="1">
              <Tabs tabPosition="left" defaultActiveKey="1" onChange={callback}>
                <TabPane tab="General Information" key="1">
                  <Form onFinish={this.handleOk}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gridGap: 20,
                      }}
                    >
                      <div>
                        <div>
                          <label
                            style={{ fontWeight: "bold", marginBottom: "10px" }}
                          >
                            Avatar
                          </label>
                          <Upload
                            name="Images"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            onChange={this.handleChange}
                          >
                            {item.Images ? (
                              <img
                                src={item.Images}
                                alt="avatar"
                                style={{ width: "100%" }}
                              />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Name</label>
                          <Input
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            required="true"
                            value={item.Name}
                            onChange={(e) => {
                              this.onDataChange("Name", e.target.value);
                            }}
                            name="Name"
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>
                            English Name
                          </label>
                          <Input
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            value={item.EnglishName}
                            onChange={(e) => {
                              this.onDataChange("EnglishName", e.target.value);
                            }}
                            name="EnglishName"
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Email</label>
                          <Input
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            type="email"
                            value={item.Email}
                            onChange={(e) => {
                              this.onDataChange("Email", e.target.value);
                            }}
                            name="Email"
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Phone</label>
                          <Input.Group
                            compact
                            style={{
                              width: "100p%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <Select style={{ width: "25%" }} defaultValue="+84">
                              <Option value="+84">+84</Option>
                              <Option value="+86">+86</Option>
                            </Select>
                            <Input
                              style={{ width: "75%" }}
                              value={item.Phone}
                              onChange={(e) => {
                                this.handlePhone(e);
                              }}
                              name="Phone"
                            />
                          </Input.Group>
                        </div>
                        <div>
                          <label
                            style={{
                              fontWeight: "bold",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            Gender
                          </label>
                          <Radio.Group
                            style={{ width: "100%" }}
                            name="Gender"
                            value={item.Gender}
                            onChange={(e) => {
                              this.onDataChange("Gender", e.target.value);
                            }}
                          >
                            <Radio value="Male">Male</Radio>
                            <Radio value="Female">Female</Radio>
                            <Radio value="Other">Other</Radio>
                          </Radio.Group>
                        </div>
                      </div>
                      <div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>TaxCode</label>
                          <Input
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            value={item.TaxCode}
                            onChange={(e) => {
                              this.onDataChange("TaxCode", e.target.value);
                            }}
                            name="TaxCode"
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Birthday</label>
                          <DatePicker
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            format="DD-MM-YYYY"
                            value={moment.utc(item.Birthday)}
                            onChange={(e) => {
                              this.onDataChange("Birthday", e);
                            }}
                            name="Birthday"
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>
                            Place Of Birth
                          </label>
                          <Select
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            placeholder="Please select your place of birth"
                            value={item.PlaceOfBirth}
                            onChange={(e) => {
                              this.onDataChange("PlaceOfBirth", e);
                              this.onSelectPlaceOfBirth(e);
                            }}
                          >
                            {lstProvinceRender.map((val, index) => (
                              <Option value={val.ID}>{val.Name}</Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Address</label>
                          <Select
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            placeholder="Please select your address"
                            value={item.Address}
                            onChange={(e) => {
                              this.onDataChange("Address", e);
                            }}
                          >
                            {lstDistrictRender.map((val, index) => (
                              <Option value={val.ID}>{val.Name}</Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>
                            Nationality
                          </label>
                          <Input
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            value={item.Nationality}
                            onChange={(e) => {
                              this.onDataChange("Nationality", e.target.value);
                            }}
                            name="Nationality"
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Status</label>
                          <Select
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            placeholder="Please select your status"
                            value={item.Status}
                            onChange={(e) => {
                              this.onDataChange("Status", e);
                            }}
                          >
                            {lstStatusTeacherRender.map((val, index) => (
                              <Option value={val.ID}>{val.Name}</Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label style={{ fontWeight: "bold" }}>Branch</label>
                          <Select
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                            placeholder="Please select your branch"
                            value={item.BranchID}
                            onChange={(e) => {
                              this.onDataChange("BranchID", e);
                            }}
                          >
                            {lstBranchRender.map((val, index) => (
                              <Option value={val.ID}>{val.Name}</Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", marginTop: "50px" }}>
                      <Button
                        style={{ marginRight: "10px" }}
                        onClick={() => this.close()}
                      >
                        Cancel
                      </Button>
                      ,
                      <Button type="primary" htmlType="submit">
                        OK
                      </Button>
                    </div>
                  </Form>
                </TabPane>
                <TabPane tab="HighChart" key="2"></TabPane>
                <TabPane tab="Certificate/Degree Information" key="3"></TabPane>
                <TabPane tab="Health Information" key="4"></TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="HighChart" key="2">
              <div>
                <HighchartsReact highcharts={Highcharts} options={opt} />
              </div>
            </TabPane>
            <TabPane tab="Contract Work" key="3">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="Teaching Schedule" key="4">
              <Form onFinish={this.handleOk}>
                <Card style={{ width: "auto" }}>
                  <Row>
                    <Col span={12}>
                      <div style={{ paddingTop: "0px", width: "100px" }}>
                        <label style={{ fontWeight: "bold" }}>Start Date</label>
                        <DatePicker
                          style={{
                            width: "430px",
                          }}
                          //value={moment.utc(item.StartDate)}
                          format="DD-MM-YYYY"
                          onChange={(e) => {
                            this.onDataChange("StartDate", e);
                          }}
                          //name="StartDate"
                        ></DatePicker>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ paddingTop: "0px", width: "100px" }}>
                        <label style={{ fontWeight: "bold" }}>End Date</label>
                        <DatePicker
                          style={{
                            width: "430px",
                          }}
                          //value={moment(item.EndDate)}
                          format="DD-MM-YYYY"
                          onChange={(e) => {
                            this.onDataChange("EndDate", e);
                            //this.GetSearchClassTimeTables(item.id, item.StartDate, item.EndDate);
                          }}
                          //name="EndDate"
                        ></DatePicker>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Table
                        style={{
                          textAlignLast: "center",
                          marginTop: "20px",
                        }}
                        columns={col}
                        dataSource={lstDate}
                      />
                    </Col>
                  </Row>
                </Card>

                <div style={{ textAlign: "right", marginTop: "50px" }}>
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={() => this.close()}
                  >
                    Cancel
                  </Button>
                  ,
                  <Button type="primary" htmlType="submit">
                    OK
                  </Button>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
