using MyWeb.DAO;
using MyWeb.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Http;

namespace MyWeb.API.Controller
{
    public class CustomerController : ApiController
    {

        public object Search(string info)
        {
            BaseDAO dao = new BaseDAO();
            string sql = string.Format("exec [Customer_Search] N'{0}'", info);
            var lst = dao.GetDataTable(sql);
            return lst;
        }

        public object GetClassStudentDetail(string id)
        {
            BaseDAO dao = new BaseDAO();
            string sql = string.Format("exec [usp_ClassStudentDetail] N'{0}'", id);
            var lst = dao.GetDataTable(sql);
            return lst;
        }

        public object ReportInvoice()
        {
            BaseDAO dao = new BaseDAO();
            string sql = string.Format("exec [Report_Invoice]");
            var lst = dao.GetDataTable(sql);
            return lst;
        }

        [HttpPost]
        public object ListInvoice()
        {
            BaseDAO dao = new BaseDAO();
            var lst = dao.Model.Invoices.ToList();
            return lst;
        }


        [HttpPost]
        public object Update(Customer item)
        {

            BaseDAO dao = new BaseDAO();
            var myCustomer = dao.Model.Customers.FirstOrDefault(f => f.ID == item.ID);
            if (myCustomer != null)
            {
                myCustomer.Name = item.Name;
                myCustomer.Gender = item.Gender;
                myCustomer.Phone1 = item.Phone1;
                myCustomer.Email = item.Email;
                myCustomer.ProvinceID = item.ProvinceID;
                myCustomer.WardID = item.WardID;
                myCustomer.DistrictID = item.DistrictID;
                myCustomer.Birthday = item.Birthday;
                myCustomer.Classification = item.Classification;
                myCustomer.Note = item.Note;
                myCustomer.CheckRegister = item.CheckRegister;

                //luu xuong DB
                try
                {
                    dao.Model.SaveChanges();
                }
                catch (DbEntityValidationException e)
                {
                    return false;
                }
            }
            else
            {
                item.CreateDate = DateTime.Now;
                item.IsDelete = false;
                item.CreateBy = "trinh";
                item.CubeID = 0;

                //luu xuong DB
                dao.Model.Customers.Add(item);
                try
                {
                    dao.Model.SaveChanges();
                }
                catch (DbEntityValidationException e)
                {
                    return false;
                }
            }
            return true;
        }

        [HttpPost]
        public object UpdateInvoice(Invoice invoice)
        {
            BaseDAO dao = new BaseDAO();
            var myInvoice = dao.Model.Invoices.FirstOrDefault(f => f.ID == invoice.ID);
            if (myInvoice != null)
            {
                myInvoice.InvoiceDate = invoice.InvoiceDate;
                myInvoice.ClassID = invoice.ClassID;
                myInvoice.AccountID = invoice.AccountID;
                myInvoice.Payer = invoice.Payer;
                myInvoice.StatusID = invoice.StatusID;
                myInvoice.TotalAmount = invoice.TotalAmount;
                myInvoice.TotalPayment = invoice.TotalPayment;
                myInvoice.DiscountAmount = invoice.DiscountAmount;
                myInvoice.DiscountReason = invoice.DiscountReason;
                myInvoice.Discount = invoice.Discount;
                myInvoice.Note = invoice.Note;
                myInvoice.Type = invoice.Type;
                myInvoice.Description = invoice.Description;
                myInvoice.RetainID = invoice.RetainID;
                myInvoice.RetainAmount = invoice.RetainAmount;
                dao.Model.SaveChanges();
            }
            else
            {
                myInvoice.Payer = invoice.Payer;
                myInvoice.UpdateTime = DateTime.Now;
                myInvoice.IsDelete = false;
                dao.Model.Invoices.Add(invoice);
                try
                {
                    dao.Model.SaveChanges();
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return true;
        }

        public object GetSingleCustomer(int id)
        {
            BaseDAO dao = new BaseDAO();
            var myCustomer = dao.Model.Customers.FirstOrDefault(f => f.ID == id);
            return myCustomer;
        }

        [HttpPost]
        public object DeleteCustomer(int id)
        {
            BaseDAO dao = new BaseDAO();
            var myCustomer = dao.Model.Customers.FirstOrDefault(f => f.ID == id);
            if (myCustomer != null)
            {
                myCustomer.IsDelete = true;
                //luu xuong DB
                dao.Model.SaveChanges();
            }
            var lst = dao.Model.Customers.Where(f => f.IsDelete == false).ToList();
            return lst;
        }

        public object GetListProvince()
        {
            BaseDAO dao = new BaseDAO();
            var lstProvince = dao.Model.Provinces.ToList();
            return lstProvince;
        }

        public object GetListDistrict(string id)
        {
            BaseDAO dao = new BaseDAO();
            var lstDistrict = dao.Model.Districts.Where(f => f.ProvinceID == id).ToList();
            return lstDistrict;
        }

        public object GetListWard(string id)
        {
            BaseDAO dao = new BaseDAO();
            var lstWard = dao.Model.Wards.Where(f => f.DistrictID == id).ToList();
            return lstWard;
        }
        public object GetSingleInvoice(int id)
        {
            BaseDAO dao = new BaseDAO();
            var lstInvoice = dao.Model.Invoices.FirstOrDefault(f => f.ID == id);
            return lstInvoice;
        }

        [HttpPost]
        public object GetListClass()
        {
            BaseDAO dao = new BaseDAO();
            var lstClass = dao.Model.Classes.Where(f=>f.IsDelete ==false).ToList();
            return lstClass;
        }

        [HttpPost]
        public object GetListAccount()
        {
            BaseDAO dao = new BaseDAO();
            var lstAccount = dao.Model.AccountConfigs.Where(f => f.IsDelete == false).ToList();
            return lstAccount;
        }

        [HttpPost]
        public object GetListInvoiceStatus()
        {
            BaseDAO dao = new BaseDAO();
            var lstInvoiceStatus = dao.Model.InvoiceStatus.Where(f => f.IsDelete == false).ToList();
            return lstInvoiceStatus;
        }


        private static readonly string[] VietnameseSigns = new string[]
        {

            "aAeEoOuUiIdDyY",

            "áàạảãâấầậẩẫăắằặẳẵ",

            "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",

            "éèẹẻẽêếềệểễ",

            "ÉÈẸẺẼÊẾỀỆỂỄ",

            "óòọỏõôốồộổỗơớờợởỡ",

            "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",

            "úùụủũưứừựửữ",

            "ÚÙỤỦŨƯỨỪỰỬỮ",

            "íìịỉĩ",

            "ÍÌỊỈĨ",

            "đ",

            "Đ",

            "ýỳỵỷỹ",

            "ÝỲỴỶỸ"
        };

        public static string RemoveSign4VietnameseString(string str)
        {
            for (int i = 1; i < VietnameseSigns.Length; i++)
            {
                for (int j = 0; j < VietnameseSigns[i].Length; j++)
                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
            }
            return str;
        }


        public void Test()
        {
            BaseDAO dao = new BaseDAO();
            var lstProv = dao.Model.Provinces.ToList();
            foreach (var item in lstProv)
            {
                string NameKoDAU = RemoveSign4VietnameseString(item.Name);
                var id = item.ID; ///AG

                string sql = string.Format("Update JTEXPRESS_WARD set Trust_MaTinhThanh='{0}' where KHONG_DAU='{1}'", id, NameKoDAU);
                dao.Model.Database.ExecuteSqlCommand(sql);
                
            }
            
        }
    }

}