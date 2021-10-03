using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public class JoinNotification
    {
        public int Id { get; set; }
        public AppUser User { get; set; }
        public AppUser Owner { get; set; }
        public Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}