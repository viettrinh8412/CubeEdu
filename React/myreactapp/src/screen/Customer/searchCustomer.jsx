import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import "../Customer/index.css";
import { Modal, Button, Table } from "antd";

export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      data: [],
    };
  }

  componentDidMount() {}

  close() {
    this.setState({ isVisible: false });
  }

  open = (id) => {
    this.setState({ isVisible: true });
    this.searchList();
  };

  handleSearch = (search) => {
    APIHelper.post("Customer/Search?info=" + search).then((data) => {
      this.setState({ data: data });
      if (this.props.onReload) {
        this.props.onReload();
      }
    });
  };

  searchList = () => {
    if (this.state.value !== undefined) {
      this.handleSearch(this.state.value);
    } else {
      this.handleSearch("");
    }
  };

  getColumns() {
    var columns = [
      {
        title: "Học viên",
        dataIndex: "Name",
        key: "name",
        sorter: (a, b) => {
          return a.Name.localeCompare(b.Name);
        },
      },
      {
        title: "Số điện thoại",
        dataIndex: "Phone1",
        key: "Phone1",
        sorter: (a, b) => {
          return a.Phone1 - b.Phone1;
        },
      },
      {
        title: "Action",
        render: (text, record) => (
          <Button type="primary" onClick={this.handleClick}>
            Chọn
          </Button>
        ),
      },
    ];
    return columns;
  }

  handleOk = () => {
    this.setState({ isVisible: false });
  };

  handleClick = (id) => {
    console.log("Click");

    this.setState({ isVisible: false });
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  onDataChange = (name, value) => {
    var data = { ...this.state.data };
    data[name] = value;
    this.setState({ data: data });
  };

  render() {
    var columns = this.getColumns();
    var data = [...this.state.data];
    return (
      <Modal
        title={"Tìm kiếm học viên"}
        visible={this.state.isVisible}
        onOk={this.handleOk}
        onCancel={() => this.close()}
        width={700}
        footer={[
          <Button key="back" onClick={() => this.close()}>
            Quay lại
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={this.handleOk}
          >
            Lưu
          </Button>,
        ]}
      >
        <Table columns={columns} dataSource={data} />
      </Modal>
    );
  }
}
