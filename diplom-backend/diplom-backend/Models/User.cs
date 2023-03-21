using System;
using System.Collections.Generic;

#nullable disable

namespace diplom_backend.Models
{
    public partial class User
    {
        public User()
        {
            Favorites = new HashSet<Favorite>();
            Requests = new HashSet<Request>();
        }

        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<Request> Requests { get; set; }
    }
}
