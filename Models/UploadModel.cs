using System;
using System.Collections.Generic;

namespace BMS.Models
{
    public partial class UploadMediaDTO
    {
        public int uploadMediaID { get; set; }
        public string guidKey { get; set; }
        public string fileName { get; set; }
        public string fileURL { get; set; }
        public string type { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public DateTime uploadDate { get; set; }
    }
    public class UploadMediaViewModel
    {
        public string result { get; set; }
        public string guid { get; set; }
        public UploadMediaDTO uploadMedia { get; set; }
        public UploadMediaViewModel()
        {
            uploadMedia = new UploadMediaDTO();
        }
    }
    public class UploadMediasViewModel
    {
        public string errorMessage { get; set; }
        public string result { get; set; }
        public int? pageIndex { get; set; }
        public int? pageSize { get; set; }
        public int? totalCount { get; set; }
        public List<UploadMediaDTO> uploadMedias { get; set; }
        public UploadMediasViewModel()
        {
            uploadMedias = new List<UploadMediaDTO>();
        }
    }
}