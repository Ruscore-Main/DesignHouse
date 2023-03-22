using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace diplom_backend.Models
{
    public class UploadHouseProject
    {
        public string name { get; set; }
        public string description { get; set; }
        public int area { get; set; }
        public int price { get; set; }
        public int amountFloors { get; set; }
        public List<IFormFile> images { get; set; }
    }
}
