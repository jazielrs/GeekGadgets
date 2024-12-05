namespace core.Models
{
    public class Campain
    {
        public string Sender { get; private set; }
        public string MessageContent { get; private set; }
        public int Status { get; private set; } 

        public Campain (string sender, string messageContent, int status){
            this.Sender = sender;
            this.MessageContent = messageContent;
            this.Status = status;
        }
    }
}