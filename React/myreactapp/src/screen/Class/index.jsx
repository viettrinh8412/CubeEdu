import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import FormEdit from "./edit";
import moment from "moment";
import "../Class/index.css";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Button, Popconfirm, Table, Space, Layout, Card, Select, Tag, DatePicker } from "antd";

const { Header, Footer } = Layout;
const { Option } = Select;

export default class ClassManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      lstBranch: [],
      lstStatusClass: [],
      lstSubject: [],
      lstClassRoom: [],
    };
    this.EditForm = React.createRef();
  }

  openPopup = (id) => {
    this.EditForm.current.open(id);
  };

  componentDidMount() {
    this.loadData();
    this.getListBranch();
    this.getListStatusClass();
    this.getListSubject();
    this.getListClassRoom();
  }

  loadData = () => {
    if (this.state.value !== undefined) {
      this.handleSearch(this.state.value);
    } else {
      this.handleSearch("");
    }
  };

  handleDelete = (id) => {
    APIHelper.post("ClassManagement/DeleteClass?id=" + id).then((data) => {
      this.setState({ data: data });
    });
  };

  getListBranch = () => {
    APIHelper.post("ClassManagement/GetBranchID").then((data) => {
      this.setState({ lstBranch: data });
    });
  };

  getListStatusClass = () => {
    APIHelper.post("ClassManagement/GetStatusClassID").then((data) => {
      this.setState({ lstStatusClass: data });
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

  onChange(event) {
    this.setState({ search: event.target.value });
  }

  handleSearch = (search) => {
    APIHelper.post("ClassManagement/Search?info=" + search).then((data) => {
      if (this.props.onReload) {
        this.props.onReload();
      }
      this.setState({ data: data });
    });
  };

  onDataChange = (value) => {
    this.setState({ value: value });
  };

  getColumn() {
    var columns = [
      {
        title: "Mã Lớp",
        dataIndex: "ID",
        width: 90,
        sorter: (a, b) => {
          return a.ID.localeCompare(b.ID);
        },
      },
      {
        title: "Tên Lớp",
        dataIndex: "Name",
        width: 200,
        sorter: (a, b) => {
          return a.Name.localeCompare(b.Name);
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "StatusClassName",
        width: 130,
        sorter: (a, b) => a.StatusClassID - b.StatusClassID,
        render: (text, record) => (
          <Tag color="success">{record.StatusClassName}</Tag>
        ),
      },
      {
        title: "Trung tâm",
        dataIndex: "BranchName",
        width: 120,
        sorter: (a, b) => {
          return a.BranchName.localeCompare(b.BranchName);
        },
      },
      {
        title: "Đăng ký",
        dataIndex: "MinStudent",
        width: 120,
        sorter: (a, b) => a.MinStudent - b.MinStudent,
      },
      {
        title: "Tối đa",
        dataIndex: "MaxStudent",
        width: 120,
        sorter: (a, b) => a.MaxStudent - b.MaxStudent,
      },
      {
        title: "BeginDate",
        dataIndex: "BeginDate",
        width: 105,
        sorter: (a, b) => {
          return a.BeginDate.localeCompare(b.BeginDate);
        },
        render: (text, record) => (
          <>{moment(record.BenginDate).format("DD-MM-YYYY")}</>
        ),
      },
      {
        title: "EndDate",
        dataIndex: "EndDate",
        width: 105,
        sorter: (a, b) => {
          return a.EndDate.localeCompare(b.EndDate);
        },
        render: (text, record) => (
          <>{moment(record.EndDate).format("DD-MM-YYYY")}</>
        ),
      },
      {
        title: "BeginTime",
        dataIndex: "BeginTime",
        width: 105,
        sorter: (a, b) => {
          return a.BeginTime.localeCompare(b.BeginTime);
        },
      },
      {
        title: "EndTime",
        dataIndex: "EndTime",
        width: 95,
        sorter: (a, b) => {
          return a.EndTime.localeCompare(b.EndTime);
        },
      },
      {
        title: "Giáo viên",
        dataIndex: "TeacherName",
        width: 120,
        sorter: (a, b) => {
          return a.TeacherName.localeCompare(b.TeacherName);
        },
      },
      {
        title: () => (
          <Button icon={<PlusOutlined />}
            onClick={() => this.openPopup()}
          >
            Thêm mới
          </Button>
        ),
        key: "action",
        width: 150,
        fixed: "right",
        render: (text, record) => (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                this.openPopup(record.ID);
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá?"
              onConfirm={() => this.handleDelete(record.ID)}
            >
              <Button type="ghost" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
    return columns;
  }

  render() {
    var col = this.getColumn();
    var data = [...this.state.data];
    var { lstBranch, lstStatusClass, lstClassRoom, lstSubject } = this.state;
    var optionBranch = lstBranch.map((item) => (
      <Option key={item.Name}>{item.Name}</Option>
    ));
    var optionStatusClass = lstStatusClass.map((item) => (
      <Option key={item.Name}>{item.Name}</Option>
    ));
    var optionClassRoom = lstClassRoom.map((item) => (
      <Option key={item.Name}>{item.Name}</Option>
    ));
    var optionSubject = lstSubject.map((item) => (
      <Option key={item.Name}>{item.Name}</Option>
    ));
    return (
      <Layout>
        <Header style={{ background: "#009cde" }}>
        </Header>
        <Card style={{ marginBottom: "0px" }}>
          <div className="ant-row col-4">
            <div>
              <label>Thông tin</label>
              <div>
                <Input
                  className="ant-input"
                  placeholder="Thông tin"
                  onChange={(e) => {
                    this.onDataChange(e.target.value);
                  }}
                  onPressEnter={(e) => this.handleSearch(this.state.value)}
                />
              </div>
            </div>
            <div>
              <label>Ngày học</label>
              <div>
                <DatePicker.RangePicker></DatePicker.RangePicker>
              </div>
            </div>
            <div>
              <label>Trạng thái</label>
              <div>
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  className="select-box"
                  onChange={(e) => {
                    this.onDataChange(e);
                  }}
                >
                  {optionStatusClass}
                </Select>
              </div>
            </div>
            <div>
              <label>Chi nhánh</label>
              <div>
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  className="select-box"
                  onChange={(e) => {
                    this.onDataChange(e);
                  }}
                >
                  {optionBranch}
                </Select>
              </div>
            </div>
          </div>
          <div className="ant-row col-4">
            <div>
              <label>Môn học</label>
              <div>
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  className="select-box"
                  onChange={(e) => {
                    this.onDataChange(e);
                  }}
                >
                  {optionSubject}
                </Select>
              </div>
            </div>
            <div>
              <label>Quản lý phòng</label>
              <div>
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  className="select-box"
                  onChange={(e) => {
                    this.onDataChange(e);
                  }}
                >
                  {optionClassRoom}
                </Select>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="button-search"
            onClick={(e) => this.handleSearch(this.state.value)}
          >
            Tìm kiếm <SearchOutlined />
          </Button>
        </Card>
        <Card>
          <Table
            columns={col}
            dataSource={data}
            scroll={{ y: 1903 }}
            style={{ paddingLeft: "10px", paddingRight: "10px" }}
          ></Table>
          <FormEdit
            ref={this.EditForm}
            onReload={() => this.loadData()}
          />
        </Card>
        <Footer>
          <span>©2020 Created by Quan Tong</span>
        </Footer>
      </Layout>
    );
  }
}