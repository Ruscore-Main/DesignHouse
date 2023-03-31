using System;
using System.Collections.Generic;

#nullable disable

namespace diplom_backend.Models
{
    public partial class HouseProject
    {
        public HouseProject()
        {
            Favorites = new HashSet<Favorite>();
            ProjectImages = new HashSet<ProjectImage>();
            Requests = new HashSet<Request>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Area { get; set; }
        public int Price { get; set; }
        public DateTime DatePublication { get; set; }
        public int AmountFloors { get; set; }
        public bool IsPublished { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<ProjectImage> ProjectImages { get; set; }
        public virtual ICollection<Request> Requests { get; set; }
    }
}
