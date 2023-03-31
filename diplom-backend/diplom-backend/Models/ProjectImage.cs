using System;
using System.Collections.Generic;

#nullable disable

namespace diplom_backend.Models
{
    public partial class ProjectImage
    {
        public int Id { get; set; }
        public byte[] Image { get; set; }
        public int HouseProjectId { get; set; }
        public string? ImageName { get; set; }
        public virtual HouseProject HouseProject { get; set; }
    }
}
