using MyWeb.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyWeb.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            BaseDAO dao = new BaseDAO();
            //Lay ra nhan vien co nam sinh > 1998
            //var lst = dao.Model.Customers.Where(f => f.Birthday.Value.Year > 1998);
            var lst = dao.Model.Contacts.ToList();

            //var conteact = new MyWeb.Models.Contact()
            //{
            //    Address = "123"
            //};

            //dao.Model.Contacts.Add(conteact);
            //dao.SaveToDB();
          
            return View();
        }

        public ActionResult ClassManagement()
        {
            ViewBag.RComponent = "Class";
            ViewBag.Title = "Lớp học";
            return View("~/Views/Home/index.cshtml");
        }
        public ActionResult Teacher()
        {
            ViewBag.RComponent = "Teacher";
            ViewBag.Title = "Giáo viên";
            return View("~/Views/Home/index.cshtml");
        }
        public ActionResult Customer()
        {
            ViewBag.RComponent = "Customer";
            ViewBag.Title = "Khách hàng";
            return View("~/Views/Home/index.cshtml");
        }

    }
}
