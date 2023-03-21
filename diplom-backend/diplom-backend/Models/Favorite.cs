using System;
using System.Collections.Generic;

#nullable disable

namespace diplom_backend.Models
{
    public partial class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int HouseProjectId { get; set; }

        public virtual HouseProject HouseProject { get; set; }
        public virtual User User { get; set; }
    }
}
