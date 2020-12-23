import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import FormEdit from "./edit";
import moment from "moment";
import "../Customer/index.css";
import {  SearchOutlined,  PlusOutlined,  EditOutlined,  DeleteOutlined,  CodeSandboxOutlined} from "@ant-design/icons";
import { Input, Button, Space, Table, Popconfirm, Layout, Select } from "antd";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      lstClassification: [],
      lstProvince: [],
    };

    this.EditForm = React.createRef();
  }

  getColumn() {
    var columns = [
      {
        title: "Số điện thoại",
        dataIndex: "Phone1",
        key: "phone1",
        sorter: (a, b) => a.Phone1 - b.Phone1,
        render: (text, record) => (
          <a href="#section" onClick={() => this.handleEdit(record.ID)}>
            {text}
          </a>
        ),
      },
      {
        title: "Họ tên",
        dataIndex: "Name",
        key: "name",
        sorter: (a, b) => {
          return a.Name.localeCompare(b.Name);
        },
      },
      {
        title: "Giới tính",
        dataIndex: "Gender",
        key: "gender",
        sorter: (a, b) => {
          return a.Gender.localeCompare(b.Gender);
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
        title: "Tỉnh",
        dataIndex: "ProvinceName",
        key: "provinceName",
        sorter: (a, b) => {
          return a.ProvinceName.localeCompare(b.ProvinceName);
        },
      },
      {
        title: "Quận/Huyện",
        dataIndex: "DistrictName",
        key: "districtID",
        sorter: (a, b) => {
          return a.DistrictID.localeCompare(b.DistrictID);
        },
      },
      {
        title: "Phường/Xã",
        dataIndex: "WardName",
        key: "wardName",
        sorter: (a, b) => {
          return a.WardName.localeCompare(b.WardName);
        },
      },
      {
        title: "Ngày sinh",
        dataIndex: "Birthday",
        key: "birthday",
        sorter: (a, b) => {
          return a.Birthday.localeCompare(b.Birthday);
        },
        render: (text, record) => <>{moment(text).format("DD-MM-YYYY")}</>,
      },
      {
        title: "Action",
        key: "Action",
        render: (text, record) => (
          <Space size="middle">
            <Button type="primary" onClick={() => this.handleEdit(record.ID)}>
              <EditOutlined />
            </Button>

            <Popconfirm
              title="Sure to delete"
              onConfirm={() => this.handleDelete(record.ID)}
            >
              <Button type="default">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
    return columns;
  }

  componentDidMount() {
    this.searchList();
    this.getListProvince();
  }

  getListProvince() {
    APIHelper.get("Customer/GetListProvince").then((data) => {
      this.setState({ lstProvince: data });
    });
  }

  searchList = () => {
    if (this.state.value !== undefined) {
      this.handleSearch(this.state.value);
    } else {
      this.handleSearch("");
    }
  };

  handleDelete = (id) => {
    APIHelper.post("Customer/DeleteCustomer?id=" + id).then((data) => {
      if (this.state.value != null) {
        this.handleSearch(this.state.value);
      } else {
        this.setState({ data: data });
      }
    });
  };

  handleEdit = (id) => {
    this.EditForm.current.open(id);
  };

  handleSearch = (search) => {
    APIHelper.post("Customer/Search?info=" + search).then((data) => {
      this.setState({ data: data });
      if (this.props.onReload) {
        this.props.onReload();
      }
    });
  };

  onDataChange = (value) => {
    this.setState({ value: value });
  };

  render() {
    var item = this.state.data;
    var col = this.getColumn();
    var data = [...this.state.data];
    var lstProvinceRender = [...this.state.lstProvince];

    return (
      <Layout>
        <Layout>
          <Header className="ant-layout-header">
            <label>
              <Button
                size="large"
                className="btn-logo"
                onClick={() => this.searchList()}
              >
                <CodeSandboxOutlined /> Customer
              </Button>
            </label>
          </Header>

          <Content className="border-content">
            <div className="col-3">
              <div className="space">
                <label>Thông tin</label>
                <div>
                  <Input
                    onPressEnter={(e) => this.handleSearch(this.state.value)}
                    className="ant-input"
                    placeholder="Input information"
                    onChange={(e) => {
                      this.onDataChange(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="space">
                <label>Phân loại khách hàng</label>
                <div>
                  <Select
                    mode="multiple"
                    style={{ width: "400px" }}
                    placeholder="Please select classification"
                    onChange={(e) => {
                      this.onDataChange(e);
                    }}
                  >
                    <Option value="Bình thuờng">Bình thuờng</Option>
                    <Option value="Học bổng">Học bổng</Option>
                    <Option value="Hộ nghèo">Hộ nghèo</Option>
                    <Option value="Gia đình chính sách">
                      Gia đình chính sách
                    </Option>
                  </Select>
                </div>
              </div>

              <div className="space">
                <label>Tỉnh </label>
                <div>
                  <Select
                    mode="multiple"
                    style={{ width: "400px" }}
                    placeholder="Please select Province"
                    value={item.ProvinceID}
                    onChange={(e) => {
                      this.onDataChange(e);
                    }}
                  >
                    {lstProvinceRender.map((val, index) => (
                      <Option key={val.Name}>{val.Name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right", marginRight: "15px" }}>
              <Button
                className="btn-create"
                type="primary"
                onClick={() => this.handleEdit()}
              >
                Create <PlusOutlined />
              </Button>
              <Button
                className="btn-search"
                type="primary"
                onClick={(e) => this.handleSearch(this.state.value)}
              >
                Search <SearchOutlined />
              </Button>
            </div>

            <Table
              columns={col}
              dataSource={data}
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
            />
            <FormEdit ref={this.EditForm} onReload={() => this.searchList()} />
          </Content>

          <Footer style={{ textAlign: "center" }}>
            ©2020 Created by VietTrinh
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
