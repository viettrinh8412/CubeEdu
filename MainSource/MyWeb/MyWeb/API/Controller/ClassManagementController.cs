using Microsoft.Ajax.Utilities;
using MyWeb.DAO;
using MyWeb.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Http;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;

namespace MyWeb.API.Controller
{
    public class ClassManagementController : ApiController
    {
        //
        // GET: /ClassManagement/
        [HttpPost]
        public object GetList()
        {
            BaseDAO dao = new BaseDAO();
            var lst = dao.Model.Classes.Where(f => f.IsDelete == false).ToList();
            return lst;
        }

        [HttpPost]
        public object GetBranchID()
        {
            BaseDAO dao = new BaseDAO();
            var lst = dao.Model.Branches.Where(f => f.IsDelete == false).ToList();
            return lst;
        }

        [HttpPost]
        public object GetSubjectID()
        {
            BaseDAO dao = new BaseDAO();
            var lst = dao.Model.Subjects.Where(f => f.IsDelete == false).ToList();
            return lst;
        }

        [HttpPost]
        public object GetClassRoomID()
        {
            BaseDAO dao = new BaseDAO();
            var lst = dao.Model.ClassRooms.Where(f => f.IsDelete == false).ToList();
            return lst;
        }

        [HttpPost]
        public object GetStatusClassID()
        {
            BaseDAO dao = new BaseDAO();
            var lst = dao.Model.StatusClasses.Where(f => f.IsDelete == false).ToList();
            return lst;
        }

        [HttpPost]
        public object DeleteClass(string id)
        {
            
            BaseDAO dao = new BaseDAO();
            var myClass = dao.Model.Classes.FirstOrDefault(f => f.ID == id );
            if (myClass != null)
            {
                myClass.IsDelete = true;
                myClass.DeleteBy = "quan";

                //luu xuong DB
                dao.Model.SaveChanges();
            }

            var lst = dao.Model.Classes.Where(f=>f.IsDelete==false).ToList();
            return lst;

        }

        [HttpPost]
        public object UpdateClass(Class item)
        {
            BaseDAO dao = new BaseDAO();
            var myClass = dao.Model.Classes.FirstOrDefault(f => f.ID == item.ID);
            if (myClass != null)
            {
                myClass.Name = item.Name;
                myClass.BranchID = item.BranchID;
                myClass.MinStudent = item.MinStudent;
                myClass.MaxStudent = item.MaxStudent;
                myClass.StatusClassID = item.StatusClassID;
                myClass.UpdateTime = DateTime.Now;
                myClass.UpdateBy = "Quân";
                myClass.BeginDate = item.BeginDate;
                myClass.EndDate = item.EndDate;
                myClass.BeginTime = item.BeginTime;
                myClass.EndTime = item.EndTime;
                myClass.T8 = item.T8;
                myClass.T7 = item.T7;
                myClass.T6 = item.T6;
                myClass.T5 = item.T5;
                myClass.T4 = item.T4;
                myClass.T3 = item.T3;
                myClass.T2 = item.T2;
                myClass.Fee = item.Fee;
                myClass.SubjectID = item.SubjectID;
                myClass.ClassRoomID = item.ClassRoomID;
                myClass.IsCreatedTimeTable = item.IsCreatedTimeTable;
                myClass.FeeType = item.FeeType;

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
                Class myClassAdd = new Class();
                myClassAdd.Name = item.Name;
                myClassAdd.BranchID = item.BranchID;
                myClassAdd.MinStudent = item.MinStudent;
                myClassAdd.MaxStudent = item.MaxStudent;
                myClassAdd.StatusClassID = item.StatusClassID;
                myClassAdd.CreateTime = DateTime.Now;
                myClassAdd.CreateBy = "Quân";
                myClassAdd.IsDelete = item.IsDelete;
                myClassAdd.BeginDate = item.BeginDate;
                myClassAdd.EndDate = item.EndDate;
                myClassAdd.EndTime = item.EndTime;
                myClassAdd.T8 = item.T8;
                myClassAdd.T7 = item.T7;
                myClassAdd.T6 = item.T6;
                myClassAdd.T5 = item.T5;
                myClassAdd.T4 = item.T4;
                myClassAdd.T3 = item.T3;
                myClassAdd.T2 = item.T2;
                myClassAdd.Fee = item.Fee;
                myClassAdd.SubjectID = item.SubjectID;
                myClassAdd.ClassRoomID = item.ClassRoomID;
                myClassAdd.IsCreatedTimeTable = item.IsCreatedTimeTable;
                myClassAdd.FeeType = item.FeeType;

                dao.Model.Classes.Add(myClassAdd);
                try
                {
                    dao.Model.SaveChanges();
                }
                catch (DbEntityValidationException e)
                {
                    return false;
                }
            }

            var lst = dao.Model.Classes.Where(f => f.IsDelete == false).ToList();
            return lst;

        }

        
        public object Search(string info)
        {
            BaseDAO dao = new BaseDAO();
            string sql = string.Format("exec [Class_Search] N'{0}'", info);
            var lst = dao.GetDataTable(sql);
            return lst;
        }
        
        public object GetSingleClass(string id)
        {
            BaseDAO dao = new BaseDAO();
            var myClass = dao.Model.Classes.FirstOrDefault(f => f.ID == id);
            return myClass;
        }

        public object GetSingleBranch(int id)
        {
            BaseDAO dao = new BaseDAO();
            var myClass = dao.Model.Branches.FirstOrDefault(f => f.ID == id);
            return myClass;
        }
    }
}
