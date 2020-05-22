using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace HYIT.Alarm.Con.Controllers
{
    public class AlarmController:ApiController
    {
        [HttpGet]
        public List<Alarm> Get()
        {
            var res = new AlarmHelper().GetAlarm();
          
            return res;
        }
    }
}
