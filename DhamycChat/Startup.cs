using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(DhamycChat.Startup))]
namespace DhamycChat
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}