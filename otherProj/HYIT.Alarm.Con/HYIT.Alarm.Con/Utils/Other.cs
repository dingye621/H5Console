using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HYIT.Alarm.Con.Utils
{
  public static class StaticFunc
  {

    public static string FilterString(string s)
    {
      //先求出最后出现这个字符的下标
      int index = s.LastIndexOf('\\');
      //从下一个索引开始截取
      var res = s.Substring(index + 1);
      if (res.StartsWith("MTBE")|| res.StartsWith("YXW_A_R"))
        return res;
      return System.Text.RegularExpressions.Regex.Replace(res, @"[^0-9]+", "");
    }
  }
}
