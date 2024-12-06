using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace geekstore_api.Hubs
{
    
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task NotifyMessageDeleted()
        {
            await Clients.All.SendAsync("MessageDeleted");
        }
    }
}
