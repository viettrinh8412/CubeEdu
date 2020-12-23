import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import FormEdit from "./edit";
import { Input, Button, Space, Table, Popconfirm, Select, Layout } from "antd";
import moment from "moment";
import {SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, MenuUnfoldOutlined, BellOutlined,} from "@ant-design/icons";
const { Option } = Select;
const { Header, Footer, Content } = Layout;

export default class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      lstBranch: [],
    };
    this.EditForm = React.createRef();
  }

  getColumn() {
    var columns = [
      {
        title: "ID",
        dataIndex: "ID",
        key: "id",
        sorter: (a, b) => a.ID - b.ID,
      },
      {
        title: "Name",
        dataIndex: "Name",
        key: "name",
        sorter: (a, b) => {
          return a.Name.localeCompare(b.Name);
        },
      },
      {
        title: "Email",
        dataIndex: "Email",
        key: "email",
        sorter: (a, b) => {
          return a.Email.localeCompare(b.Email);
        },
      },
      {
        title: "Phone",
        dataIndex: "Phone",
        key: "phone",
        sorter: (a, b) => a.Phone - b.Phone,
      },
      {
        title: "Gender",
        dataIndex: "Gender",
        key: "gender",
        sorter: (a, b) => {
          return a.Gender.localeCompare(b.Gender);
        },
      },
      {
        title: "Birthday",
        dataIndex: "Birthday",
        key: "birthday",
        sorter: (a, b) => {
          return a.Birthday.localeCompare(b.Birthday);
        },
        render: (text, record) => (
          <>{moment(record.Birthday).format("DD-MM-YYYY")}</>
        ),
      },
      {
        title: "Place Of Birth",
        dataIndex: "ProvinceName",
        key: "placeofbirth",
        sorter: (a, b) => {
          return a.ProvinceName.localeCompare(b.ProvinceName);
        },
      },
      {
        title: "Address",
        dataIndex: "DistrictName",
        key: "address",
        sorter: (a, b) => {
          return a.DistrictName.localeCompare(b.DistrictName);
        },
      },
      {
        title: "Branch",
        dataIndex: "BranchName",
        key: "branchid",
        sorter: (a, b) => {
          return a.BranchName.localeCompare(b.BranchName);
        },
      },

      {
        title: "",
        key: "Action",
        render: (text, record) => (
          <Space size="middle">
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.handleDelete(record.ID)}
            >
              <Button icon={<DeleteOutlined />}></Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => this.handleEdit(record.ID)}
            ></Button>
          </Space>
        ),
      },
      {
        title: () => (
          <Button icon={<PlusOutlined />} onClick={() => this.handleEdit()}>
            Add
          </Button>
        ),
      },
    ];
    return columns;
  }

  componentDidMount() {
    this.searchList();
    this.getListBranch();
  }

  getListBranch() {
    APIHelper.get("Teacher/GetListBranch").then((data) => {
      this.setState({ lstBranch: data });
    });
  }



  handleDelete = (id) => {
    APIHelper.post("Teacher/DeleteTeacher?id=" + id).then((data) => {
      if (this.state.value !== null) {
        this.handleSearch(this.state.value);
      } else {
        this.setState({ data: data });
      }
    });
  };

  handleEdit = (id) => {
    this.EditForm.current.open(id);
  };

  searchList = () => {
    this.handleSearch(" ", " ");
  };

  handleSearch = (search, BranchID) => {
    var searchs = search !== undefined ? search : " ";
    var BranchIDs = BranchID !== undefined ? BranchID : " ";
    APIHelper.post(
      "Teacher/SearchTeacher?info=" + searchs + "&BranchID=" + BranchIDs
    ).then((data) => {
      this.setState({ data: data });
      if (this.props.onReload) {
        this.props.onReload();
      }
    });
  };

  onDataChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    var col = this.getColumn();
    var data = [...this.state.data];
    var lstBranchRender = [...this.state.lstBranch];

    return (
      <Layout>
        <Header
          style={{
            background: "#009cde",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <div>
            <Button
              //style={{ color: "#ffffff" }}
              type="text"
              size="small"
              icon={<MenuUnfoldOutlined />}
            >
              Teacher
            </Button>
          </div>
          <div style={{ textAlignLast: "right" }}>
            <Button size="large" type="text" icon={<BellOutlined />}></Button>
          </div>
        </Header>
        <Content style={{ background: "#ffffff" }}>
          <div style={{ border: "1px solid #e8e8e8", margin: "30px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gridGap: 20,
              }}
            >
              <div style={{ marginLeft: "30px", marginTop: "30px" }}>
                <label style={{ fontWeight: "bold" }}>Information</label>
                <Input
                  style={{ width: "100%" }}
                  placeholder="Information"
                  onChange={(e) => {
                    this.onDataChange("Value", e.target.value);
                  }}
                />
              </div>
              <div style={{ marginTop: "30px" }}>
                <label style={{ fontWeight: "bold" }}>Branch</label>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select"
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
            <div
              style={{
                textAlign: "right",
                marginRight: "30px",
                marginBottom: "10px",
              }}
            >
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() =>
                  this.handleSearch(this.state.Value, this.state.BranchID)
                }
              >
                Search
              </Button>
            </div>
            <Table
              style={{
                textAlignLast: "center",
                margin: "30px",
                marginTop: "0px",
              }}
              columns={col}
              dataSource={data}
            />
            <FormEdit ref={this.EditForm} onReload={() => this.searchList()} />
          </div>
        </Content>
        <Footer style={{ background: "#e4e9f0" }}></Footer>
      </Layout>
    );
  }
}
