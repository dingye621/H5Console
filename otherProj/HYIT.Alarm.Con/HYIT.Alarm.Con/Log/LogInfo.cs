using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HYIT.Alarm.Con.Log
{
  public static class LogInfo
  {
    public static readonly LogInfoWriter AlarmException = LogInfoWriter.GetInstance("AlarmException");

  }
}
