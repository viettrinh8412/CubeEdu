//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MyWeb.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class InvoiceCategory
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public bool IsDelete { get; set; }
        public Nullable<bool> IsSystem { get; set; }
        public string CreateBy { get; set; }
        public System.DateTime CreateTime { get; set; }
        public string DeleteBy { get; set; }
        public Nullable<System.DateTime> DeleteTime { get; set; }
        public string UpdateBy { get; set; }
        public Nullable<System.DateTime> UpdateTime { get; set; }
        public string SearchText { get; set; }
    }
}
