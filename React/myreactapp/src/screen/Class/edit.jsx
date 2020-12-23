import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import moment from "moment";
import "../Class/index.css";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Input, Modal, message, Checkbox, DatePicker, Select, Tabs, InputNumber, TimePicker, Table, Button, Space } from "antd";

const { Option } = Select;
const { TabPane } = Tabs;

export default class ClassManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      data: {},
      lstBranch: [],
      lstStatusClass: [],
      lstSubject: [],
      lstClassRoom: [],
      lstTeacher: [],
      lstDate: [],
    };
  }

  getSession(record) {
    var format = 'ss';
    if (record <= "12:00:00") {
      format = "Ca 1: " + this.state.data.BeginTime + " - " + this.state.data.EndTime;
    }
    else {
      format = "Ca 2: " + this.state.data.BeginTime + " - " + this.state.data.EndTime;
    }
    return format;
  }

  getNumber(record) {
    var index = 1 + this.state.lstDate.indexOf(record);
    var day = "Buổi " + index;
    return day;
  }

  getOption() {
    var options = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'My chart'
      },
      series: [
        {
          data: [1, 2, 1, 4, 3, 6]
        }
      ]
    };
    return options;
  }

  getColumn() {
    var columns = [
      {
        title: "Buổi",
        render: (text, record) => (
          <>{this.getNumber(record)}</>
        ),
      },
      {
        title: "Buổi",
        dataIndex: "DaysOfTheWeek",
      },
      {
        title: "Ngày",
        dataIndex: "Dates",
        render: (Dates) => (
          <>{moment(Dates).format("DD/MM/YYYY")}</>
        ),
      },
      {
        title: "Ca học",
        dataIndex: "Time",
        render: (text, record) => (
          <>{this.getSession(record.Time)}</>
        ),
      },
      {
        title: "Thao tác",
        render: () => (
          <Space>
            <Select
              placeholder="Thao tác">
              <Option value="Ghi chú">Ghi chú</Option>
              <Option value="Nghỉ học">Nghỉ học</Option>
              <Option value="Đổi lịch">Đổi lịch</Option>
              <Option value="Chỉnh sửa">Chỉnh sửa</Option>
            </Select>
          </Space>
        ),
      },
      {
        title: "Vắng|Tổng số",
      },
      {
        title: "Nội dung",
      },
    ];
    return columns;
  }

  componentDidMount = () => {
    this.getListBranch();
    this.getListSubject();
    this.getListClassRoom();
    this.getListStatusClass();
    this.getListTeacher();
  };

  open(id) {
    this.setState({ isVisible: true });
    if (id) {
      APIHelper.getUrl("ClassManagement/GetSingleClass", { id: id }).then((data) => {
        this.setState({
          data: data,
        });
        this.getClassTimeTable(id);
        this.onDataChange("ClassID", id);
      });
    } else {
      var data = {};
      this.setState({ data: data });
    }
  }

  close() {
    this.setState({ isVisible: false });
  }

  handleOk = () => {
    var check = this.validateData();
    if (check) {
      APIHelper.post("ClassManagement/UpdateClass", this.state.data).then((newData) => {
        if (newData == true) {
          Modal.success({
            title: "This is an success message",
            content: "Successfully",
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
      }
      );
    }
  };

  getListBranch = () => {
    APIHelper.post("ClassManagement/GetBranchID").then((data) => {
      this.setState({ lstBranch: data });
    });
  };

  getListTeacher = () => {
    APIHelper.post("ClassManagement/GetTeacherID").then((data) => {
      this.setState({ lstTeacher: data });
    });
  };

  getListSubject = () => {
    APIHelper.post("ClassManagement/GetSubjectID").then((data) => {
      this.setState({ lstSubject: data });
    });
  };

  getListClassRoom = () => {
    APIHelper.post("ClassManagement/GetClassRoomID").then((data) => {
      this.setState({ lstClassRoom: data });
    });
  };

  getListStatusClass = () => {
    APIHelper.post("ClassManagement/GetStatusClassID").then((data) => {
      this.setState({ lstStatusClass: data });
    });
  };

  getClassTimeTable = (id) => {
    APIHelper.post("ClassManagement/GetClassTimeTables?id=" + id).then((data) => {
      this.setState({
        lstDate: data,
      });
      if (this.props.onReload) {
        this.props.onReload();
      }
    });
  };

  addClassTimeTable = () => {
    // const diffTime = moment().range(this.state.data.EndDate, this.state.data.BeginDate);
    const diffTime = Math.abs(new Date(this.state.data.EndDate) - new Date(this.state.data.BeginDate));
    const diffDays = 0 | diffTime / 864e5;
    const NumberOfLesson = this.state.data.NumberOfLesson;
    let count = 0;
    console.log(count++);
    console.log(NumberOfLesson);
    for (let i = 0; i <= diffDays; i++) {
      const newdate = new Date(new Date(this.state.data.BeginDate).getTime() + (i * 864e5));
      if (count < NumberOfLesson) {
        switch (newdate.getDay()) {
          case 1:
            if (this.state.data.T2 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
          case 2:
            if (this.state.data.T3 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
          case 3:
            if (this.state.data.T4 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
          case 4:
            if (this.state.data.T5 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
          case 5:
            if (this.state.data.T6 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
          case 6:
            if (this.state.data.T7 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
          case 0:
            if (this.state.data.T8 == true) {
              this.handleClassTimeTable(newdate, count);
            }
            break;
        }
      }
    }
  };

  handleClassTimeTable(newdate, count) {
    var date = new Date();
    date.setDate(newdate.getDate());
    var postData = {
      ClassID: this.state.data.ClassID,
      Dates: date
    }
    APIHelper.post("ClassManagement/UpdateClassTimeTables", postData).then((newData) => {
      if (newData == true) {
        count += 1;
        console.log(count);
      }
    });
  };

  onDataChange = (name, value) => {
    var data = { ...this.state.data };
    data[name] = value;
    this.setState({ data: data });
  };

  validateData() {
    var result = true;
    var data = { ...this.state.data };
    if (!data.ID) {
      message.error("Please input your ID!");
      result = false;
    }
    if (!data.Name) {
      message.error("Please input your name!");
      result = false;
    }
    if (!data.BranchID) {
      message.error("Please input your branch!");
      result = false;
    }
    if (!data.SubjectID) {
      message.error("Please input your subject!");
      result = false;
    }
    if (!data.ClassRoomID) {
      message.error("Please input your classroom!");
      result = false;
    }
    if (!data.StatusClassID) {
      message.error("Please input your status class!");
      result = false;
    }
    if (!data.Fee) {
      message.error("Please input your fee!");
      result = false;
    }
    if (!data.FeeType) {
      message.error("Please input your fee type!");
      result = false;
    }
    if (!data.MinStudent) {
      message.error("Please input your min student!");
      result = false;
    }
    if (!data.MaxStudent) {
      message.error("Please input your max student!");
      result = false;
    }
    if (!data.BeginDate) {
      message.error("Please input your begin date!");
      result = false;
    }
    if (!data.EndDate) {
      message.error("Please input your end date!");
      result = false;
    }
    if (!data.BeginTime) {
      message.error("Please input your begin time!");
      result = false;
    }
    if (!data.EndTime) {
      message.error("Please input your end time!");
      result = false;
    }
    return result;
  };

  render() {
    var opt = this.getOption();
    var col = this.getColumn();
    var lstBranch = [...this.state.lstBranch];
    var lstSubject = [...this.state.lstSubject];
    var lstClassRoom = [...this.state.lstClassRoom];
    var lstStatusClass = [...this.state.lstStatusClass];
    var lstTeacher = [...this.state.lstTeacher];
    var lstDate = [...this.state.lstDate];
    var item = this.state.data;
    return (
      <Modal
        className="ant-modal-resize"
        title="Lớp học"
        visible={this.state.isVisible}
        onOk={this.handleOk}
        onCancel={() => this.close()}
      >
        <Tabs defaultActiveKey="1"
          onChange={tabIndex => this.setState({ tabIndex })}
        >
          <TabPane tab="Thông tin" key="1">
            <div className="ant-row col-2">
              <div className="col-2">
                <div style={{ marginRight: "10px" }}>
                  <label>Mã lớp</label>
                  <div>
                    <Input
                      style={{ width: "100%" }}
                      value={item.ID}
                      onChange={(e) => {
                        this.onDataChange("ID", e.target.value);
                      }}
                      name="ID"
                    />
                  </div>
                </div>
                <div style={{ marginRight: "10px" }}>
                  <label>Tên lớp</label>
                  <div>
                    <Input
                      style={{ width: "100%" }}
                      value={item.Name}
                      onChange={(e) => {
                        this.onDataChange("Name", e.target.value);
                      }}
                      name="Name"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label>Chi Nhánh</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select a branch"
                    name="BranchID"
                    value={item.BranchID}
                    onChange={(e) => {
                      this.onDataChange("BranchID", e);
                    }}
                  >
                    {lstBranch.map((item) => (
                      <Option value={item.ID}>{item.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="ant-row col-2">
              <div style={{ marginRight: "10px" }}>
                <label>Môn học</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select a subject"
                    name="SubjectID"
                    value={item.SubjectID}
                    onChange={(e) => {
                      this.onDataChange("SubjectID", e);
                    }}
                  >
                    {lstSubject.map((item) => (
                      <Option value={item.ID}>{item.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <label>Phòng học</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select a classroom"
                    name="ClassRoomID"
                    value={item.ClassRoomID}
                    onChange={(e) => {
                      this.onDataChange("ClassRoomID", e);
                    }}
                  >
                    {lstClassRoom.map((item) => (
                      <Option value={item.ID}>{item.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="ant-row col-2">
              <div style={{ marginRight: "10px" }}>
                <label>Giáo viên</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select a teacher"
                    name="TeacherID"
                    value={item.TeacherID}
                    onChange={(e) => {
                      this.onDataChange("TeacherID", e);
                    }}
                  >
                    {lstTeacher.map((item) => (
                      <Option value={item.ID}>{item.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="ant-row col-2">
              <div style={{ marginRight: "10px" }}>
                <label>Trạng thái</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select a status"
                    name="StatusClassID"
                    value={item.StatusClassID}
                    onChange={(e) => {
                      this.onDataChange("StatusClassID", e);
                    }}
                  >
                    {lstStatusClass.map((item) => (
                      <Option value={item.ID}>{item.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="col-2">
                <div style={{ marginRight: "10px" }}>
                  <label>Học phí</label>
                  <div>
                    <Input
                      style={{ width: "100%" }}
                      value={item.Fee}
                      onChange={(e) => {
                        this.onDataChange("Fee", e.target.value);
                      }}
                      name="Fee"
                    />
                  </div>
                </div>
                <div>
                  <label>Loại</label>
                  <div>
                    <Select
                      style={{ width: "100%" }}
                      value={item.FeeType}
                      onChange={(e) => {
                        this.onDataChange("FeeType", e);
                      }}
                      name="FeeType"
                    >
                      <Option value="Khoá">Khoá</Option>
                      <Option value="Tháng">Tháng</Option>
                      <Option value="Buổi">Buổi</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="ant-row col-2">
              <div style={{ marginRight: "10px" }}>
                <label>Số học sinh tối thiếu</label>
                <InputNumber
                  min={1}
                  max={9999}
                  style={{ width: "100%" }}
                  value={item.MinStudent}
                  onChange={(e) => {
                    this.onDataChange("MinStudent", e);
                  }}
                />
              </div>
              <div>
                <label>Số học sinh tối đa</label>
                <InputNumber
                  min={1}
                  max={9999}
                  style={{ width: "100%" }}
                  value={item.MaxStudent}
                  onChange={(e) => {
                    this.onDataChange("MaxStudent", e);
                  }}
                />
              </div>
            </div>
            <div className="ant-row col-3">
              <div>
                <label>Ngày bắt đầu</label>
                <div style={{ marginRight: "10px" }}>
                  <DatePicker
                    value={moment(item.BeginDate)}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    onChange={(e) => {
                      this.onDataChange("BeginDate", e);
                    }}
                    name="BenginDate"
                  ></DatePicker>
                </div>
              </div>
              <div style={{ marginRight: "10px" }}>
                <label>Số buổi học</label>
                <div>
                  <Input
                    style={{ width: "100%" }}
                    value={item.NumberOfLesson}
                    onChange={(e) => {
                      this.onDataChange("NumberOfLesson", e.target.value);
                    }}
                    name="NumberOfLesson"
                  />
                </div>
              </div>
              <div>
                <label>Ngày kết thúc</label>
                <div>
                  <DatePicker
                    value={moment(item.EndDate)}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    onChange={(e) => {
                      this.onDataChange("EndDate", e);
                    }}
                    name="EndDate"
                  ></DatePicker>
                </div>
              </div>
            </div>
            <label>Lịch học</label>
            <div className="ant-row col-7">
              <div>
                <label>Thứ 2</label>
                <div>
                  <Checkbox
                    checked={item.T2 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T2", e.target.checked);
                    }}
                    name="T2"
                  ></Checkbox>
                </div>
              </div>
              <div>
                <label>Thứ 3</label>
                <div>
                  <Checkbox
                    checked={item.T3 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T3", e.target.checked);
                    }}
                    name="T3"
                  ></Checkbox>
                </div>
              </div>
              <div>
                <label>Thứ 4</label>
                <div>
                  <Checkbox
                    checked={item.T4 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T4", e.target.checked);
                    }}
                    name="T4"
                  ></Checkbox>
                </div>
              </div>
              <div>
                <label>Thứ 5</label>
                <div>
                  <Checkbox
                    checked={item.T5 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T5", e.target.checked);
                    }}
                    name="T5"
                  ></Checkbox>
                </div>
              </div>
              <div>
                <label>Thứ 6</label>
                <div>
                  <Checkbox
                    checked={item.T6 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T6", e.target.checked);
                    }}
                    name="T6"
                  ></Checkbox>
                </div>
              </div>
              <div>
                <label>Thứ 7</label>
                <div>
                  <Checkbox
                    checked={item.T7 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T7", e.target.checked);
                    }}
                    name="T7"
                  ></Checkbox>
                </div>
              </div>
              <div>
                <label>Chủ nhật</label>
                <div>
                  <Checkbox
                    checked={item.T8 == 1 ? true : false}
                    onChange={(e) => {
                      this.onDataChange("T8", e.target.checked);
                    }}
                    name="T8"
                  ></Checkbox>
                </div>
              </div>
            </div>
            <div className="ant-row">
              <div className="space">
                <label>Thời gian bắt đầu</label>
                <div>
                  <TimePicker
                    value={moment(item.BeginTime, "hh:mm:ss")}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      this.onDataChange("BeginTime", e.format("hh:mm:ss"));
                    }}
                    name="BeginTime"
                  ></TimePicker>
                </div>
              </div>
              <div>
                <label>Thời gian kết thúc</label>
                <div>
                  <TimePicker
                    value={moment(item.EndTime, "hh:mm:ss")}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      this.onDataChange("EndTime", e.format("hh:mm:ss"));
                    }}
                    name="EndTime"
                  ></TimePicker>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Học viên" key="2">
            <div>
              <HighchartsReact highcharts={Highcharts} options={opt} />
            </div>
          </TabPane>
          <TabPane tab="Thời khóa biểu" key="3">
            <div style={{
              paddingRight: "10px",
              textAlign: "right",
              marginBottom: "20px"
            }}>
              <Button type="primary">
                Đổi lịch
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="primary"
              >
                Xem điểm danh cả khóa
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="primary"
              >
                Xóa thời khóa biểu
              </Button>
            </div>
            <Table
              style={{ paddingLeft: "10px", paddingRight: "10px", textAlignLast: "center" }}
              bordered
              columns={col}
              dataSource={lstDate}
            />
            <div style={{
              paddingRight: "10px",
              textAlign: "right",
            }}>
              <Button
                type="primary"
                onClick={this.addClassTimeTable}
              >
                Tạo
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Bảng điểm" key="4">
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}