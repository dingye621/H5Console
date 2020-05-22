using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Text;
using System.Web.Http;

namespace HYIT.Alarm.Con
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var webApiConfiguration = ConfigureWebApi(app);

            // Use the extension method provided by the WebApi.Owin library:
            app.UseWebApi(webApiConfiguration);
        }
        private HttpConfiguration ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{id}",
                new { id = RouteParameter.Optional });

            //清除xml格式，使用json格式
            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());

            app.UseWebApi(config);
            return config;
        }
    }
}
