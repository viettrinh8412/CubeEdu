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
    
    public partial class SurveyQuestion
    {
        public int ID { get; set; }
        public int SurveyForID { get; set; }
        public string Question { get; set; }
        public bool IsText { get; set; }
    }
}
