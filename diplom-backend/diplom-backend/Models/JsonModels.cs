using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace diplom_backend.Models
{

    // Json Model for Upload new houseProject
    public class UploadHouseProject
    {
        public string name { get; set; }
        public string description { get; set; }
        public int area { get; set; }
        public int price { get; set; }
        public int amountFloors { get; set; }
        public bool isPublished { get; set; }
        public IFormFile[] images { get; set; }

    }



    // Jsom Model for houseProject
    public class HouseProjectJson
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int area { get; set; }
        public int price { get; set; }
        public DateTime datePublication { get; set; }
        public int amountFloors { get; set; }
        public bool isPublished { get; set; }
        public List<byte[]> images { get; set; }
        public int? userId { get; set; } = null;
    }

    public class ResponseHuseProject
    {
        public int amountPages { get; set; }
        public List<HouseProjectJson> items { get; set; }
    }

    // Json Model for Login
    public class UserRequest
    {
        public string login { get; set; }
        public string password { get; set; }
    };

    // Json Model for Request of User
    public class RequestJson
    {
        public int id { get; set; }
        public string contentText { get; set; }
        public DateTime dateCreating { get; set; }
        public int userId { get; set; }
        public string userLogin { get; set; }
        public string userEmail { get; set; }
        public string? userPhone { get; set; } = null;

        public int houseProjectId { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int area { get; set; } 
        public int price { get; set; }
        public DateTime datePublication { get; set; }
        public int amountFloors { get; set; }
        public List<byte[]> images { get; set; }
    }

    public class ResponseRequestJson
    {
        public int amountPages { get; set; }
        public List<RequestJson> items { get; set; }
    }

    // Json Model for Favoriteitem of User
    public class FavoriteJson
    {
        public int id { get; set; }
        public int userId { get; set; }
        public int houseProjectId { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int area { get; set; }
        public int price { get; set; }
        public DateTime datePublication { get; set; }
        public int amountFlors { get; set; }
        public List<byte[]> images { get; set; }
    }

    // Json Model of User
    public class UserJson
    {
        public int id { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public List<RequestJson> requests { get; set; } = new List<RequestJson>();
        public List<FavoriteJson> favorites { get; set; } = new List<FavoriteJson>();
    }

}
