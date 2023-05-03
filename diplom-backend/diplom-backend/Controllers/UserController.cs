using diplom_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace diplom_backend.Controllers
{

    [Route("api/user")]
    [ApiController]
    public class UserController : Controller
    {
        private HouseProjectDBContext? _db;

        public UserController(HouseProjectDBContext projectContext)
        {
            _db = projectContext;
        }

        public byte[] GetImage(string sBase64String)
        {
            byte[] bytes = null;

            if (!string.IsNullOrEmpty(sBase64String))
            {
                bytes = Convert.FromBase64String(sBase64String);
            }

            return bytes;
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
                Role = userJson.role,
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
            List<int> favorites = new List<int>();

            currentUser.Favorites.ToList().ForEach(el =>
            {
                List<byte[]> images = new();
                el.HouseProject.ProjectImages.ToList().ForEach(el =>
                {
                    images.Add(el.Image);
                });
                favorites.Add(el.HouseProjectId);
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
                    amountFloors = el.HouseProject.AmountFloors,
                    images = images
                });
            });

            await _db.SaveChangesAsync();

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

        // GET /favorited
        // Получение списка избранных проектов
        [Route("favorites")]
        [HttpGet]
        public async Task<ActionResult> AddFavorite(int userId)
        {
            User currentUser = await _db.Users.FirstOrDefaultAsync(el => el.Id == userId);

            if (currentUser == null)
            {
                return NotFound();
            }

            List<HouseProjectJson> houseProjects = new List<HouseProjectJson>();
            currentUser.Favorites.ToList().ForEach(el =>
            {
                HouseProject hs = el.HouseProject;
                List<byte[]> images = new();
                if (hs.ProjectImages.Count > 0)
                {
                    images = new() { this.GetImage(Convert.ToBase64String(hs.ProjectImages.OrderBy(el => el.ImageName).ToList()[0].Image)) };
                }
                houseProjects.Add(new HouseProjectJson()
                {
                    id = hs.Id,
                    name = hs.Name,
                    area = hs.Area,
                    price = hs.Price,
                    images = images,
                    isPublished = hs.IsPublished
                });
            });


            return new JsonResult(houseProjects);
        }

        // POST /update
        // Регистрация пользователя
        [Route("update")]
        [HttpPost]
        public async Task<ActionResult<User>> Update(UserJson userJson)
        {
            User user = await _db.Users.FirstOrDefaultAsync(el => el.Id == userJson.id);
            if (user == null)
            {
                return NotFound("Пользователь не найден!");
            }

            User userWithSameLogin = await _db.Users.FirstOrDefaultAsync(el => el.Id != userJson.id && el.Login == userJson.login);

            if (userWithSameLogin != null)
            {
                return BadRequest("Пользователь с таким логином уже существует!");
            }

            user.Login = userJson.login;
            user.Email = userJson.email;
            user.PhoneNumber = userJson.phoneNumber;

            await _db.SaveChangesAsync();

            return new JsonResult(userJson);
        }

        // Добавление проекта в избранное
        [Route("addFavorite")]
        [HttpPost]
        public async Task<ActionResult> AddFavorite(HouseProjectJson item)
        {
            User currentUser = await _db.Users.FirstOrDefaultAsync(el => el.Id == item.userId);

            if (currentUser == null)
            {
                return NotFound();
            }

            HouseProject houseProject = await _db.HouseProjects.FirstOrDefaultAsync(el => el.Id == item.id);

            currentUser.Favorites.Add(new Favorite(){
                User = currentUser,
                HouseProject = houseProject
            });

            await _db.SaveChangesAsync();

            return new JsonResult(item);
        }

        // Удаление проекта из избранного
        [Route("removeFavorite")]
        [HttpPost]
        public async Task<ActionResult> RemoveFavorite(HouseProjectJson item)
        {
            User currentUser = await _db.Users.FirstOrDefaultAsync(el => el.Id == item.userId);

            if (currentUser == null)
            {
                return NotFound();
            }

            Favorite foundFavorite = await _db.Favorites.FirstOrDefaultAsync(el => el.UserId == currentUser.Id && el.HouseProjectId == item.id);
            currentUser.Favorites.Remove(foundFavorite);

            await _db.SaveChangesAsync();

            return new JsonResult(item);
        }



        // Добавление запроса на строительство
        [Route("request")]
        [HttpPost]
        public async Task<ActionResult> AddRequest(RequestJson request)
        {
            User currentUser = await _db.Users.FirstOrDefaultAsync(el => el.Id == request.userId);

            if (currentUser == null)
            {
                return NotFound();
            }

            HouseProject houseProject = await _db.HouseProjects.FirstOrDefaultAsync(el => el.Id == request.houseProjectId);

            Request newRequest = new Request() {
                ContentText = request.contentText,
                DateCreating = DateTime.Now,
                HouseProject = houseProject,
                User = currentUser,
                UserId = currentUser.Id,
                HouseProjectId = houseProject.Id
            };

            request.userPhone = currentUser.PhoneNumber;

            currentUser.Requests.Add(newRequest);

            _db.Requests.Add(newRequest);

            await _db.SaveChangesAsync();

            return new JsonResult(request);
        }

       
    }
}
