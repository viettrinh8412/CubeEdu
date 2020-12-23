import React, { Component } from "react";
import "antd/dist/antd.css";
import { APIHelper } from "../../services";
import "../Customer/index.css";
import moment from "moment";
import {
  Modal,
  Button,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Card,
} from "antd";
import { ZoomInOutlined } from "@ant-design/icons";
import FormSearchCustomer from "./searchCustomer";

const { Option } = Select;

export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      hide: false,
      data: {},
      lstClass: [],
      lstAccount: [],
      lstInvoiceStatus: [],
    };
    this.SearchCustomerForm = React.createRef();
  }

  componentDidMount() {
    this.getListClass();
    this.getListAccount();
    this.getListInvoiceStatus();
    
  }

  close() {
    this.setState({ isVisible: false });
  }

  open = (id) => {
    this.setState({ isVisible: true });
    if (id) {
      APIHelper.getUrl("Customer/GetSingleInvoice", { id: id }).then((data) => {
        this.setState({ data: data });
      });
    } else {
      var data = {};
      this.setState({ data: data });
    }
  };

  openCustomer = (id) => {
    this.SearchCustomerForm.current.open(id);
  };

  getListClass = () => {
    APIHelper.post("Customer/GetListClass").then((data) => {
      this.setState({ lstClass: data });
    });
  };
  getListAccount = () => {
    APIHelper.post("Customer/GetListAccount").then((data) => {
      this.setState({ lstAccount: data });
    });
  };
  getListInvoiceStatus = () => {
    APIHelper.post("Customer/GetListInvoiceStatus").then((data) => {
      this.setState({ lstInvoiceStatus: data });
    });
  };
  

  handleOk = () => {
    APIHelper.post("Customer/UpdateInvoice", this.state.data).then(
      (newData) => {
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
      }
    );
  };

  onDataChange = (name, value) => {
    var data = { ...this.state.data };
    data[name] = value;
    this.setState({ data: data, hide: true });
  };

  render() {
    var item = this.state.data;
    var lstClass = [...this.state.lstClass];
    var lstAccount = [...this.state.lstAccount];
    var lstInvoiceStatus = [...this.state.lstInvoiceStatus];
    return (
      <Modal
        width={1300}
        title={"Phiếu thu"}
        visible={this.state.isVisible}
        onOk={this.handleOk}
        onCancel={() => this.close()}
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
        <div className="col-3">
          <div>
            <label>Mã phiếu</label>
            <Input
              style={{ width: "390px" }}
              value={item.Code}
              onChange={(e) => {
                this.onDataChange("Code", e.target.value);
              }}
              readOnly
            ></Input>
          </div>
          <div>
            <label>Ngày</label>
            <div>
              <DatePicker
                style={{ width: "390px" }}
                key="InvoiceDate"
                format="DD-MM-YYYY"
                value={moment.utc(item.InvoiceDate)}
                onChange={(e) => {
                  this.onDataChange("InvoiceDate", e);
                }}
              ></DatePicker>
            </div>
          </div>
          <div>
            <label>Mã chứng từ</label>
            <Input style={{ width: "390px" }} placeholder="Mã chứng từ"></Input>
          </div>
        </div>

        <div className="col-2">
          <div>
            <label>Học viên</label>
            <div>
              <Input
                style={{ width: "500px" }}
                value={item.Payer}
                onChange={(e) => {
                  this.onDataChange("Payer", e.target.value);
                }}
                key="Payer"
                readOnly
              ></Input>
              <Button
                style={{ width: "100px" }}
                type="primary"
                onClick={() => this.openCustomer()}
              >
                <ZoomInOutlined />
              </Button>
            </div>
            <FormSearchCustomer ref={this.SearchCustomerForm} />
          </div>
          <div>
            <label>Lớp</label>
            <div>
              <Select
                style={{ width: "600px" }}
                value={item.ClassID}
                placeholder="Please select"
                onChange={(e) => {
                  this.onDataChange("ClassID", e);
                }}
              >
                {lstClass.map((item, index) => (
                  <Option value={item.ID}>{item.Name}</Option>
                ))}
              </Select>
            </div>
          </div>

          {/* {this.state.isVisible && <div>ddd</div>} */}
        </div>
        {/* <Card
          style={{ width: "100%" }}
          title="Học phí"
          style={{ display: this.state.hide ? "" : "none" }}
        ></Card> */}

        <div className="col-2">
          <div>
            <label>Tài khoản</label>
            <div>
              <Select
                style={{ width: "600px" }}
                value={item.AccountID}
                onChange={(e) => {
                  this.onDataChange("AccountID", e);
                }}
                key="AccountID"
              >
                {lstAccount.map((item, index) => (
                  <Option value={item.ID}>{item.Name}</Option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <label>Tổng tiền</label>
            <div>
              <Input
                style={{ width: "600px" }}
                value={item.TotalAmount}
                onChange={(e) => {
                  this.onDataChange("TotalAmount", e);
                }}
                key="TotalAmount"
                disabled
              ></Input>
            </div>
          </div>
        </div>

        <div className="col-2">
          <div>
            <label>Người thanh toán</label>
            <div>
              <Input
                style={{ width: "600px" }}
                value={item.Payer}
                onChange={(e) => {
                  this.onDataChange("Payer", e.target.value);
                }}
                key="Payer"
              ></Input>
            </div>
          </div>
          <div className="col-2">
            <div>
              <label>Khuyến mãi</label>
              <div>
                <InputNumber
                  style={{ width: "250px" }}
                  value={item.Discount}
                  onChange={(e) => {
                    this.onDataChange("Discount", e);
                  }}
                  key="Discount"
                ></InputNumber>
                <Button key="btnDiscount" type="primary">
                  %
                </Button>
              </div>
            </div>
            <div>
              <label>Thành tiền khuyến mãi</label>
              <div>
                <Input
                  style={{ width: "272px" }}
                  value={
                    (item.DiscountAmount =
                      (item.TotalAmount * item.Discount) / 100)
                  }
                  onChange={(e) => {
                    this.onDataChange("DiscountAmount", e);
                  }}
                  key="DiscountAmount"
                  disabled
                ></Input>
              </div>
            </div>
          </div>
        </div>

        <div className="col-2">
          <div>
            <label>Trạng thái</label>
            <div>
              <Select
                style={{ width: "600px" }}
                value={item.StatusID}
                onChange={(e) => {
                  this.onDataChange("StatusID", e);
                }}
                key="StatusID"
              >
                {lstInvoiceStatus.map((item, index) => (
                  <Option value={item.ID}>{item.Name}</Option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <label>Lý do thanh toán</label>
            <div>
              <Input
                style={{ width: "600px" }}
                value={item.DiscountReason}
                onChange={(e) => {
                  this.onDataChange("DiscountReason", e.target.value);
                }}
                key="DiscountReason"
              ></Input>
            </div>
          </div>
        </div>

        <div className="col-2">
          <div>
            <label>Ghi chú</label>
            <div>
              <Input
                style={{ width: "600px" }}
                value={item.Note}
                onChange={(e) => {
                  this.onDataChange("Note", e.target.value);
                }}
                key="Note"
              ></Input>
            </div>
          </div>
          <div>
            <label>Phân loại khách hàng</label>
            <div>
              <Select
                style={{ width: "600px" }}
                value={item.Type}
                onChange={(e) => {
                  this.onDataChange("Type", e);
                }}
              >
                <Option value="Normal">Normal</Option>
                <Option value="Scholar">Scholar</Option>
                <Option value="Poor">Poor</Option>
                <Option value="FamilyPolicy">FamilyPolicy</Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="col-2">
          <div>
            <label>Nội dung</label>
            <div>
              <Input.TextArea
                style={{ width: "600px" }}
                value={item.Description}
                onChange={(e) => {
                  this.onDataChange("Description", e.target.value);
                }}
                key="Description"
              ></Input.TextArea>
            </div>
          </div>
          <div className="col-2">
            <div>
              <label>Mã bảo lưu</label>
              <div>
                <Input
                  style={{ width: "250px" }}
                  value={item.RetainID}
                  onChange={(e) => {
                    this.onDataChange("RetainID", e.target.value);
                  }}
                  key="RetainID"
                  disabled
                ></Input>
                <Button type="primary">
                  <ZoomInOutlined />
                </Button>
              </div>
            </div>
            <div>
              <label>Số tiền bảo lưu</label>
              <div>
                <Input
                  style={{ width: "272px" }}
                  value={item.RetainAmount}
                  onChange={(e) => {
                    this.onDataChange("RetainAmount", e.target.value);
                  }}
                  key="RetainAmount"
                  disabled
                ></Input>
              </div>
            </div>
          </div>
        </div>

        <div className="col-2">
          <div></div>
          <div>
            <label>Tổng tiền thanh toán</label>
            <div>
              <Input
                style={{ width: "600px" }}
                value={
                  (item.TotalPayment = item.TotalAmount - item.DiscountAmount)
                }
                onChange={(e) => {
                  this.onDataChange("TotalPayment", e.target.value);
                }}
                key="TotalPayment"
              ></Input>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
