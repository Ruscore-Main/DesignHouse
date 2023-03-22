using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace diplom_backend.Models
{
    public class UploadHouseProject
    {
        public string name;
        public string description;
        public int area;
        public int price;
        public int amountFloors;
        public IFormFile files;
    }
}
