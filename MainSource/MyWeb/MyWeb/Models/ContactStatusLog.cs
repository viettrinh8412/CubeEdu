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
    
    public partial class ContactStatusLog
    {
        public int ID { get; set; }
        public Nullable<int> ContactID { get; set; }
        public Nullable<int> OldStatusID { get; set; }
        public string OldStatusName { get; set; }
        public Nullable<int> NewStatusID { get; set; }
        public string NewStatusName { get; set; }
        public string ChangeBy { get; set; }
        public Nullable<System.DateTime> ChangeTime { get; set; }
    }
}
