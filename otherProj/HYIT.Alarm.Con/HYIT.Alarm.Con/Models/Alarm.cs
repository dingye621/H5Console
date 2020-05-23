using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HYIT.Alarm.Con
{
  public class Alarm : MetaEntity
  {
    public string TagId { get; set; }

    public string TagValue { get; set; }

    public string AlarmFlag { get; set; }  //报警 0 未报警 1低报 2高报

    public string LongName { get; set; }

    public string TagName { get; set; }
  }

  public class AlarmRecord : MetaEntity
  {
    public string TagName { get; set; }

    public string TagValue { get; set; }

    public string AlarmFlag { get; set; }
  }
}

