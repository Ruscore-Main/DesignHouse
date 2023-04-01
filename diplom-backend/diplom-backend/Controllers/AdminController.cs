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
        public async Task<ActionResult> GetRequests()
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
                    description = el.HouseProject.Description,
                    area = el.HouseProject.Area,
                    price = el.HouseProject.Price,
                    datePublication = el.HouseProject.DatePublication,
                    amountFloors = el.HouseProject.AmountFloors,
                    userPhone = el.User.PhoneNumber
                });
            });

            return new JsonResult(requestsJson);
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
    }
}
