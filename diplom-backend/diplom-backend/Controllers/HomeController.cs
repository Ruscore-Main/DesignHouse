using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using diplom_backend.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace diplom_backend.Controllers
{


    [Route("api/project")]
    [ApiController]
    public class HomeController : Controller
    {
        private HouseProjectDBContext? _db;
        private static IWebHostEnvironment _owebHostEnvironment;

        public HomeController(HouseProjectDBContext projectContext, IWebHostEnvironment owebHostEnvironment)
        {
            _db = projectContext;
            _owebHostEnvironment = owebHostEnvironment;
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

        public static String GetTimestamp(DateTime value)
        {
            return value.ToString("yyyyMMddHHmmssffff");
        }

        // GET api/project
        // Получение списка проектов
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JsonResult>>> Get(int? page, int limit, string searchValue, string category, string sort)
        {
            List<HouseProject> allProjects = await _db.HouseProjects.Where(el => el.IsPublished).ToListAsync();
            List<HouseProjectJson> houseProjects = new List<HouseProjectJson>();

            allProjects.ForEach(el =>
            {
                List<byte[]> images = el.ProjectImages.OrderBy(el => el.ImageName).Select(s => this.GetImage(Convert.ToBase64String(s.Image))).ToList();
                HouseProjectJson curProject = new HouseProjectJson()
                {
                    id = el.Id,
                    name = el.Name,
                    description = el.Description,
                    area = el.Area,
                    price = el.Price,
                    datePublication = el.DatePublication,
                    amountFloors = el.AmountFloors,
                    images = images
                };

                houseProjects.Add(curProject);
            });

            // Если нет никаких параметров запроса, то сразу возвращаем результат, чтобы ускорить процесс
            if (searchValue == null && category == null && sort == null && page == null)
            {
                return new JsonResult(houseProjects);
            }


            // Фильтрация списка проектов домов по содержимому заголовка
            if (searchValue != null)
            {
                houseProjects = houseProjects.Where(el => el.name.ToLower().Contains(searchValue.ToLower())).ToList();
            }

            // Фильтрация списка проектов домов по этажам
            if (category != null)
            {
                switch (category)
                {
                    case "Одноэтажные":
                        {
                            houseProjects = houseProjects.Where(el => el.amountFloors == 1).ToList();
                            break;
                        }
                    case "Двухэтажные":
                        {
                            houseProjects = houseProjects.Where(el => el.amountFloors == 2).ToList();
                            break;
                        }
                    case "Более этажей":
                        {
                            houseProjects = houseProjects.Where(el => el.amountFloors > 2).ToList();
                            break;
                        }
                }
            }

            // Сортировка списка проектов домов
            if (sort != null)
            {
                switch (sort)
                {
                    case "name":
                        {
                            houseProjects = houseProjects.OrderBy(el => el.name).ToList();
                            break;
                        }
                    case "-name":
                        {
                            houseProjects = houseProjects.OrderByDescending(el => el.name).ToList();
                            break;
                        }

                    case "area":
                        {
                            houseProjects = houseProjects.OrderBy(el => el.area).ToList();
                            break;
                        }
                    case "-area":
                        {
                            houseProjects = houseProjects.OrderByDescending(el => el.area).ToList();
                            break;
                        }
                    case "date":
                        {
                            houseProjects = houseProjects.OrderBy(el => el.datePublication).ToList();
                            break;
                        }
                    case "-date":
                        {
                            houseProjects = houseProjects.OrderByDescending(el => el.datePublication).ToList();
                            break;
                        }
                }
            }

            int amountPages = Convert.ToInt32(Math.Ceiling(houseProjects.Count / (float)limit));

            if (page != null)
            {
                houseProjects = houseProjects.Skip(5 * ((int)page - 1)).Take(limit).ToList();
            }

            ResponseHuseProject responseHusePorject = new ResponseHuseProject()
            {
                items = houseProjects,
                amountPages = amountPages
            };

            return new JsonResult(responseHusePorject);
        }

        // GET api/projects/{id}
        // Получение конкретного проекта
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<JsonResult>>> GetFull(int id)
        {
            HouseProject houseProject = await _db.HouseProjects.FirstOrDefaultAsync(el => el.Id == id);
            if (houseProject == null)
            {
                return NotFound();
            }

            List<byte[]> images = houseProject.ProjectImages.OrderBy(el => el.ImageName).Select(s => this.GetImage(Convert.ToBase64String(s.Image))).ToList();
            HouseProjectJson houseProjectJson = new HouseProjectJson()
            {
                id = houseProject.Id,
                name = houseProject.Name,
                description = houseProject.Description,
                area = houseProject.Area,
                price = houseProject.Price,
                datePublication = houseProject.DatePublication,
                amountFloors = houseProject.AmountFloors,
                images = images
            };

            return new JsonResult(houseProjectJson);
        }

        // POST api/project
        // Создание проекта
        [HttpPost]
        public async Task<ActionResult<HouseProject>> Post([FromForm] UploadHouseProject houseProject)
        {

            if (houseProject == null)
            {
                return BadRequest();
            }

            HouseProject newHouseProject = new HouseProject()
            {
                Name = houseProject.name,
                Description = houseProject.description,
                Area = houseProject.area,
                Price = houseProject.price,
                DatePublication = DateTime.Now,
                AmountFloors = houseProject.amountFloors,
                IsPublished = houseProject.isPublished
            };

            var i = _owebHostEnvironment;
            int index = 0;
            houseProject.images.ToList().ForEach(async (el) =>
            {
                if (el.Length > 0)
                {
                    string path = _owebHostEnvironment.WebRootPath + "\\HouseProjectImages\\";
                    if (!Directory.Exists(path)) Directory.CreateDirectory(path);
                    string fileName = "HouseImg_" + houseProject.name + "_" + $"{GetTimestamp(DateTime.Now)}" + ".png";
                    if (System.IO.File.Exists(path + fileName))
                    {
                        System.IO.File.Delete(path + fileName);
                    }

                    using (var ms = new MemoryStream())
                    {
                        await el.CopyToAsync(ms);
                        var fileBytes = ms.ToArray();
                        newHouseProject.ProjectImages.Add(new ProjectImage()
                        {
                            Image = fileBytes,
                            ImageName = $"{index}"
                        });
                    }
                    index++;

                    using (FileStream fileStream = System.IO.File.Create(path + fileName))
                    {
                        await el.CopyToAsync(fileStream);
                        await fileStream.FlushAsync();
                    }
                }
            });




            await _db.HouseProjects.AddAsync(newHouseProject);
            await _db.SaveChangesAsync();

            return Ok(newHouseProject);

        }

        // Обновление проекта
        // PUT api/project
        [HttpPut("{id}")]
        public async Task<ActionResult<HouseProject>> Put(HouseProjectJson houseProject)
        {
            if (houseProject == null)
            {
                return BadRequest();
            }

            HouseProject foundHouseProject = await _db.HouseProjects.FirstOrDefaultAsync(el => el.Id == houseProject.id);

            if (foundHouseProject == null)
            {
                return NotFound();
            }

            foundHouseProject.Name = houseProject.name;
            foundHouseProject.Description = houseProject.description;
            foundHouseProject.Area = houseProject.area;
            foundHouseProject.Price = houseProject.price;
            foundHouseProject.AmountFloors = houseProject.amountFloors;

            foundHouseProject.ProjectImages.Clear();

            List<ProjectImage> images = new List<ProjectImage>();
            houseProject.images.ForEach(el => images.Add(new ProjectImage() { Image = el }));

            foundHouseProject.ProjectImages = images;

            await _db.SaveChangesAsync();
            return Ok(houseProject);
        }

        // DELETE api/project
        // Удаление проекта
        [HttpDelete("{id}")]
        public async Task<ActionResult<HouseProject>> Delete(int id)
        {
            HouseProject foundHouseProject = await _db.HouseProjects.FirstOrDefaultAsync(el => el.Id == id);

            if (foundHouseProject == null)
            {
                return NotFound();
            }

            _db.HouseProjects.Remove(foundHouseProject);
            await _db.SaveChangesAsync();
            return Ok(foundHouseProject);
        }
    }
}
