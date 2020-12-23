using MyWeb.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MyWeb.DAO
{
    public class BaseDAO
    {
        public thuctapk39Entities Model { get; set; }

        public BaseDAO()
        {
            Model = new thuctapk39Entities();
        }
        /// <summary>
        /// Lưu vào server
        /// </summary>
        /// <returns></returns>
        public bool SaveToDB()
        {
            try
            {
                return Model.SaveChanges() > 0;
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public System.Data.DataTable GetDataTable(string command)
        {

            SqlConnection sqlConn = (SqlConnection)Model.Database.Connection;

            SqlDataAdapter da = new SqlDataAdapter(command, sqlConn);
            System.Data.DataTable dt = new System.Data.DataTable();
            if (sqlConn.State != ConnectionState.Open)
            {
                sqlConn.Open();
            }
            da.Fill(dt);
            sqlConn.Close();
            return dt;
        }
    }
}