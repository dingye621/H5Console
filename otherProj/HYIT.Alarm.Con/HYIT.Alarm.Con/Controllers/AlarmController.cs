using System.Collections.Generic;
using System.Web.Http;

namespace HYIT.Alarm.Con.Controllers
{
  public class AlarmController : ApiController
  {
    [HttpGet]
    public List<Alarm> Get()
    {
      var res = new AlarmHelper().GetAlarm();
      return res;
    }
    [HttpGet]
    [Route("test")]
    public bool Test()
    {
      return true;
    }
    [HttpGet]
    [Route("On")]
    public void On()
    {
      AlarmHelper.On();
    }
    [HttpGet]
    [Route("Off")]
    public void Off()
    {
      AlarmHelper.Off();
    }
  }
}
