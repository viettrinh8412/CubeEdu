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
    
    public partial class SelectAllName_Result
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public int BranchID { get; set; }
        public Nullable<int> StructureID { get; set; }
        public int MinStudent { get; set; }
        public int MaxStudent { get; set; }
        public int StatusClassID { get; set; }
        public string CreateBy { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
        public string UpdateBy { get; set; }
        public Nullable<System.DateTime> UpdateTime { get; set; }
        public bool IsDelete { get; set; }
        public string DeleteBy { get; set; }
        public string SearchText { get; set; }
        public System.DateTime BeginDate { get; set; }
        public System.DateTime EndDate { get; set; }
        public Nullable<int> NumberOfLesson { get; set; }
        public System.TimeSpan BeginTime { get; set; }
        public System.TimeSpan EndTime { get; set; }
        public Nullable<bool> T8 { get; set; }
        public Nullable<bool> T7 { get; set; }
        public Nullable<bool> T6 { get; set; }
        public Nullable<bool> T5 { get; set; }
        public Nullable<bool> T4 { get; set; }
        public Nullable<bool> T3 { get; set; }
        public Nullable<bool> T2 { get; set; }
        public decimal Fee { get; set; }
        public int SubjectID { get; set; }
        public int ClassRoomID { get; set; }
        public Nullable<bool> IsCreatedTimeTable { get; set; }
        public string FeeType { get; set; }
        public Nullable<int> TeacherID { get; set; }
    }
}