namespace Domain.Direct
{
    public class Message
    {
        public int Id { get; set; }
        public AppUser Sender { get; set; }
        public string Body { get; set; }
    }
}