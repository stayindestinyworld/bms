using System;
using System.Collections.Generic;

namespace BMS.Models
{
    public partial class ActivityHistoryDTO
    {
        public int activityHistoryID { get; set; }
        public string content { get; set; }
        public string refJsonObj { get; set; }
        public DateTime? beginTime { get; set; }
        public string beginTimeS { get; set; }
        public int? userProfileID { get; set; }
        public bool? active { get; set; }
        public string createdBy { get; set; }
        public DateTime? createdDate { get; set; }
        public string createdDateS { get; set; }
        public string modifiedBy { get; set; }
        public DateTime? modifiedDate { get; set; }
        public string modifiedDateS { get; set; }
        //end table database field
        public string editMode { get; set; }
        public string guid { get; set; }
        public string userProfileName { get; set; }
        public string userProfileProfileImageUrl { get; set; }
    }

}