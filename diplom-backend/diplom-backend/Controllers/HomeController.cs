using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using diplom_backend.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace diplom_backend.Controllers
{
    public class HouseProjectJson
    {
        public int id;
        public string name;
        public string description;
        public int area;
        public int price;
        public DateTime datePublication;
        public int amountFlors;
        public List<byte[]> images;
    }

    [Route("api/project")]
    [ApiController]
    public class HomeController : Controller
    {
        private HouseProjectDBContext? _db;

        public HomeController(HouseProjectDBContext projectContext)
        {
            _db = projectContext;
        }

        // GET api/project
        // Получение списка товаров
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JsonResult>>> Get(string _searchValue, string _category, string _sort)
        {
            List<HouseProject> allProjects = await _db.HouseProjects.ToListAsync();
            List<HouseProjectJson> houseProjects = new List<HouseProjectJson>();

            allProjects.ForEach(el =>
            {
                List<byte[]> images = (from s in el.ProjectImages select s.Image).ToList();
                HouseProjectJson curProject = new HouseProjectJson()
                {
                    id = el.Id,
                    name = el.Name,
                    description = el.Description,
                    area = el.Area,
                    price = el.Price,
                    datePublication = el.DatePublication,
                    amountFlors = el.AmountFloors,
                    images = images
                };

                houseProjects.Add(curProject);
            });

            // Если нет никаких параметров запроса, то сразу возвращаем результат, чтобы ускорить процесс
            if (_searchValue == null && _category == null && _sort == null)
            {
                return new JsonResult(houseProjects);
            }

            // Фильтрация списка проектов домов по содержимому заголовка
            if (_searchValue != null)
            {
                houseProjects = houseProjects.Where(el => el.name.ToLower().Contains(_searchValue.ToLower())).ToList();
            }

            // Фильтрация списка проектов домов по этажам
            if (_category != null)
            {
                switch (_category)
                {
                    case "Одноэтажные":
                        {
                            houseProjects = houseProjects.Where(el => el.amountFlors == 1).ToList();
                            break;
                        }
                    case "Двухэтажные":
                        {
                            houseProjects = houseProjects.Where(el => el.amountFlors == 2).ToList();
                            break;
                        }
                    case "Более этажей":
                        {
                            houseProjects = houseProjects.Where(el => el.amountFlors> 2).ToList();
                            break;
                        }
                }
            }

            // Сортировка списка проектов домов
            if (_sort != null)
            {
                switch (_sort)
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

            return new JsonResult(houseProjects);
        }

        // POST api/project
        // Создание товара
        [HttpPost]
        public async Task<ActionResult<HouseProject>> Post(HouseProjectJson houseProject)
        {
            if (houseProject == null)
            {
                return BadRequest();
            }

            List<ProjectImage> images = new List<ProjectImage>();

            houseProject.images.ForEach(el => images.Add(new ProjectImage() { Image = el }));

            HouseProject newHouseProject = new HouseProject()
            {
                Name = houseProject.name,
                Description = houseProject.description,
                Area = houseProject.area,
                Price = houseProject.price,
                DatePublication = DateTime.Now,
                AmountFloors = houseProject.amountFlors,
                ProjectImages = images
            };

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
            foundHouseProject.AmountFloors = houseProject.amountFlors;

            foundHouseProject.ProjectImages.Clear();

            List<ProjectImage> images = new List<ProjectImage>();
            houseProject.images.ForEach(el => images.Add(new ProjectImage() { Image = el }));

            foundHouseProject.ProjectImages = images;

            await _db.SaveChangesAsync();
            return Ok(houseProject);
        }

        // DELETE api/project
        // Удаление товара
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
