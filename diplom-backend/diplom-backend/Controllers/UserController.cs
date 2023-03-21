﻿using diplom_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace diplom_backend.Controllers
{
    // Json Model for Login
    public class UserRequest
    {
        public string login;
        public string password;
    };

    // Json Model for Request of User
    public class RequestJson
    {
        public int id;
        public string contentText;
        public DateTime dateCreating;
        public int userId;
        public int houseProjectId;
        public string name;
        public string description;
        public int area;
        public int price;
        public DateTime datePublication;
        public int amountFlors;
        public List<byte[]> images;
    }

    // Json Model for Favoriteitem of User
    public class FavoriteJson
    {
        public int id;
        public int userId;
        public int houseProjectId;
        public string name;
        public string description;
        public int area;
        public int price;
        public DateTime datePublication;
        public int amountFlors;
        public List<byte[]> images;
    }

    // Json Model of User
    public class UserJson
    {
        public int id;
        public string login;
        public string password;
        public string role;
        public string email;
        public string phoneNumber;
        public List<RequestJson> requests = new List<RequestJson>();
        public List<FavoriteJson> favorites = new List<FavoriteJson>();
    }

    [Route("api/user")]
    [ApiController]
    public class UserController : Controller
    {
        private HouseProjectDBContext? _db;

        public UserController(HouseProjectDBContext projectContext)
        {
            _db = projectContext;
        }

        // POST /registration
        // Регистрация пользователя
        [Route("registration")]
        [HttpPost]
        public async Task<ActionResult<User>> Registration(UserJson userJson)
        {
            string login = userJson.login;
            List<User> users = await _db.Users.ToListAsync();
            if (users.Any(el => el.Login == login))
            {
                return BadRequest("Пользователь с таким логином уже существует!");
            }

            User newUser = new User()
            {
                Login = login,
                Password = userJson.password,
                Role = "User",
                Email = userJson.email,
                PhoneNumber = userJson.phoneNumber,
                Favorites = new List<Favorite>(),
                Requests = new List<Request>()
            };

            await _db.Users.AddAsync(newUser);
            await _db.SaveChangesAsync();

            userJson.id = newUser.Id;
            userJson.role = newUser.Role;

            return new JsonResult(userJson);
        }

        // POST /authorization
        // Авторизация пользователя
        [Route("authorization")]
        [HttpPost]
        public async Task<ActionResult> Authorization(UserRequest ur)
        {
            string login = ur.login;
            string password = ur.password;
            List<User> users = await _db.Users.ToListAsync();
            User currentUser = users.FirstOrDefault(el => el.Login == login && el.Password == password);
            if (currentUser == null)
            {
                return NotFound("Пользователь не найден!");
            }

            // Добавление всех избранных проектов
            List<FavoriteJson> favorites = new List<FavoriteJson>();

            currentUser.Favorites.ToList().ForEach(el =>
            {
                List<byte[]> images = new();
                el.HouseProject.ProjectImages.ToList().ForEach(el =>
                {
                    images.Add(el.Image);
                });
                favorites.Add(new FavoriteJson()
                {
                    id = el.Id,
                    userId = el.UserId,
                    houseProjectId = el.HouseProjectId,
                    name = el.HouseProject.Name,
                    description = el.HouseProject.Description,
                    area = el.HouseProject.Area,
                    price = el.HouseProject.Price,
                    datePublication = el.HouseProject.DatePublication,
                    amountFlors = el.HouseProject.AmountFloors,
                    images = images
                });
            });

            List<RequestJson> requests = new List<RequestJson>();

            // Добавление всех заявок
            currentUser.Requests.ToList().ForEach(el =>
            {
                List<byte[]> images = new();
                el.HouseProject.ProjectImages.ToList().ForEach(el =>
                {
                    images.Add(el.Image);
                });
                requests.Add(new RequestJson()
                {
                    id = el.Id,
                    contentText = el.ContentText,
                    dateCreating = el.DateCreating,
                    userId = el.UserId,
                    houseProjectId = el.HouseProjectId,
                    name = el.HouseProject.Name,
                    description = el.HouseProject.Description,
                    area = el.HouseProject.Area,
                    price = el.HouseProject.Price,
                    datePublication = el.HouseProject.DatePublication,
                    amountFlors = el.HouseProject.AmountFloors,
                    images = images
                });
            });

            UserJson user = new UserJson()
            {
                id = currentUser.Id,
                login = currentUser.Login,
                password = currentUser.Password,
                role = currentUser.Role,
                email = currentUser.Email,
                phoneNumber = currentUser.PhoneNumber,
                requests = requests,
                favorites = favorites
            };

            return new JsonResult(user);
        }


    }
}
