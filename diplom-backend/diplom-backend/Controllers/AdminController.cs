using diplom_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace diplom_backend.Controllers
{
    [Route("api/admin")]
    public class AdminController : Controller
    {
        private HouseProjectDBContext? _db;

        public AdminController(HouseProjectDBContext projectContext)
        {
            _db = projectContext;
        }

        // Получение всех запросов на строительство
        [Route("request")]
        [HttpGet]
        public async Task<ActionResult> GetRequests(int? page, string searchValue, string category, int limit=10)
        {
            List<RequestJson> requestsJson = new List<RequestJson>();

            List<Request> requests = await _db.Requests.ToListAsync();

            requests.ForEach(el =>
            {
                requestsJson.Add(new RequestJson()
                {
                    id = el.Id,
                    contentText = el.ContentText,
                    dateCreating = el.DateCreating,
                    userId = el.UserId,
                    houseProjectId = el.HouseProjectId,
                    name = el.HouseProject.Name,
                    price = el.HouseProject.Price,
                    userEmail = el.User.Email,
                    userPhone = el.User.PhoneNumber,
                    amountFloors = el.HouseProject.AmountFloors,
                    userLogin = el.User.Login
                });
            });

            // Если нет никаких параметров запроса, то сразу возвращаем результат, чтобы ускорить процесс
            if (searchValue == null && category == null && page == null)
            {
                return new JsonResult(requestsJson);
            }

            // Фильтрация списка запросов по содержимому контента
            if (searchValue != null)
            {
                requestsJson = requestsJson.Where(el => el.contentText.ToLower().Contains(searchValue.ToLower())).ToList();
            }

            // Фильтрация списка проектов домов по этажам
            if (category != null)
            {
                switch (category)
                {
                    case "Одноэтажные":
                        {
                            requestsJson = requestsJson.Where(el => el.amountFloors == 1).ToList();
                            break;
                        }
                    case "Двухэтажные":
                        {
                            requestsJson = requestsJson.Where(el => el.amountFloors == 2).ToList();
                            break;
                        }
                    case "Более этажей":
                        {
                            requestsJson = requestsJson.Where(el => el.amountFloors > 2).ToList();
                            break;
                        }
                }
            }

            int amountPages = Convert.ToInt32(Math.Ceiling(requestsJson.Count / (float)limit));

            if (page != null)
            {
                requestsJson = requestsJson.Skip(limit * ((int)page - 1)).Take(limit).ToList();
            }

            ResponseRequestJson responseRequests = new ResponseRequestJson()
            {
                items = requestsJson,
                amountPages = amountPages
            };

            return new JsonResult(responseRequests);
        }

        // Принятие запроса на строительство
        [Route("request")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> AcceptRequest(int id)
        {
            Request request = await _db.Requests.FirstOrDefaultAsync(el => el.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            _db.Requests.Remove(request);
            await _db.SaveChangesAsync();

            return Ok(request);
        }

        // Получение всех пользователей
        [Route("users")]
        [HttpGet]
        public async Task<ActionResult> GetUsers(int? page, string role, string searchValue, int limit = 10)
        {
            List<User> users = await _db.Users.ToListAsync();

            if (searchValue != null)
            {
                users = users.Where(el => el.Login.ToLower().Contains(searchValue.ToLower())).ToList();
            }

            if (role != null)
            {
                users = users.Where(el => el.Role == role).ToList();
            }

            int amountPages = Convert.ToInt32(Math.Ceiling(users.Count / (float)limit));

            if (page != null)
            {
                users = users.Skip(limit * ((int)page - 1)).Take(limit).ToList();
            }

            List<UserJson> usersJson = new List<UserJson>();

            users.ForEach(user =>
            {
                UserJson userJson = new UserJson()
                {
                    id = user.Id,
                    login = user.Login,
                    role = user.Role,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber
                };

                usersJson.Add(userJson);
            });

            ResponseUserJson responseUser = new ResponseUserJson()
            {
                items = usersJson,
                amountPages = amountPages
            };

            return new JsonResult(responseUser);
        }

        // Удаление пользователя
        [Route("users")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            User user = await _db.Users.FirstOrDefaultAsync(el => el.Id == id);
            
            if (user == null)
            {
                return NotFound("Пользователь не найден!");
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Ok(user);

        }
    }
}
