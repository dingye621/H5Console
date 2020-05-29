using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Timers;
using HYIT.Alarm.Con.Log;
using HYIT.Alarm.Con.Utils;
using Newtonsoft.Json;
using pSpaceCTLNET;
using HYIT.Alarm.Con;
using System.Web.Caching;
using HYIT.Alarm.Con.CacheHelper;
using HYIT.Alarm.Con.EF;
using HYIT.Alarm.Con.Models;

namespace HYIT.Alarm.Con
{
  public class AlarmHelper
  {
    private static string _serverName { get; set; }
    private static string _userName { get; set; }
    private static string _password { get; set; }
    private static bool _runStatus { get; set; } //任务运行状态
    private static CacheClass _cache { get; set; }
    static Random r { get; set; }
    private static int _random { get; set; }
    private static int lightTimes { get; set; }
    private static string _url { get; set; }

    // private static EFOperation db { get; set; }



    static AlarmHelper()
    {
      _url = Configs.GetValue("LightUrl");
      _serverName = Configs.GetValue("ServerName");
      _userName = Configs.GetValue("UserName");
      _password = Configs.GetValue("Password");
      _random= Configs.GetValue<int>("Random");
      lightTimes = Configs.GetValue<int>("LightTimes");
      _runStatus = false;
      _cache = new CacheClass();
      // db = new EFOperation();
      r = new Random();

    }

    public List<Alarm> GetAlarm()
    {

      List<Alarm> aList = new List<Alarm>();
      try
      {
        Common.StartAPI();

       /// var serverName = Configs.GetValue("ServerName");
      //  var userName = Configs.GetValue("UserName");
       // var password = Configs.GetValue("Password");

        var connector = new DbConnector()
        {
          UseProxy = false,
          //ServerName ="10.109.75.90",
          //ServerName = "192.168.0.120",
          ServerName = _serverName,
          UserName = _userName,
          Password = _password,
          TimeOut = 5,
          ExecuteTimeout = 10
        };

        var err = connector.Connect();

        if (err.HasErrors)
        {
          Console.WriteLine("建立连接失败，错误号：{0}，描述：{1}", err.ErrorCode, err.ErrorMessage);
          //Console.ReadLine();
          return null;
        }

        TagTypeSystem.Initialize(connector);
        var tree = TagTree.CreateInstance(connector);
        var root = tree.GetTreeRoot();

        var ret = root.GetSubTags(true);

        foreach (var item in ret)
        {
          var elm = item as ITagElement;
          if (elm != null)
          {
            var realdata = DataIO.Snapshot(connector, elm);
            //Console.WriteLine(JsonConvert.SerializeObject(item));
           // var res = JsonConvert.SerializeObject(item);
            aList.Add(new Alarm() { LongName = item.TagLongName, TagId = item.TagId.ToString(), TagValue = realdata.Value.ToString() });
            //Console.WriteLine($"{item.TagLongName}: {realdata.Value}:tagId:{item.TagId}");
          }
        }
        connector.Disconnect();
        Common.StopAPI();
        return aList;
        //Console.ReadLine();
      }
      catch (Exception ex)
      {
          LogInfo.AlarmException.Error(ex);
          return new List<Alarm>();
      }
    }

    /// <summary>
    /// 报警监测
    /// </summary>
    /// <returns></returns>
    public static void RunAlarmMonitor()
    {

      // System.Threading.Thread.Sleep(5000);
      // Console.WriteLine("task end  " +DateTime.Now.ToLongTimeString());
      // return;
      int count = 0;
      int count2 = 0;
      Common.StartAPI();
      var connector = new DbConnector()
      {
        UseProxy = false,
        ServerName = _serverName,
        UserName = _userName,
        Password = _password,
        TimeOut = 5,
        ExecuteTimeout = 10
      };

      var err = connector.Connect();
      if (err.HasErrors)
      {
        LogInfo.AlarmException.ErrorFormat("建立连接失败，错误号：{0}，描述：{1}", err.ErrorCode, err.ErrorMessage);
        Console.WriteLine("建立连接失败，错误号：{0}，描述：{1}", err.ErrorCode, err.ErrorMessage);
        return;
      }
      TagTypeSystem.Initialize(connector);
      var tree = TagTree.CreateInstance(connector);
      var root = tree.GetTreeRoot();
      var ret = root.GetSubTags(true);
      var cachKey = string.Empty;
      var cachKeyStatus = string.Empty;
      var flag = string.Empty;
      var status = string.Empty;
      double tagValue = Const.DEFAULT_VALUE;
      double lowLimit = Const.DEFAULT_VALUE;
      double highLimit = Const.DEFAULT_VALUE;
      string tagName = string.Empty;
      Tag tag = null;
      AlarmRecord record = null;

      var tagNameList = EFOperation.GetTagNameList();

      foreach (var item in ret)
      {
        if(string.IsNullOrEmpty(_cache.GetCache<string>(Const.ALARM_LIGHT)))
          Off();//关闭报警灯
        var elm = item as ITagElement;
        if (elm != null)
        {
          cachKey = Const.ALARM_FLAG_KEY + item.TagLongName;
          cachKeyStatus = Const.ALARM_STATUS_KEY + item.TagLongName;
          flag = _cache.GetCache<string>(cachKey);
          status = _cache.GetCache<string>(cachKeyStatus);
          var realdata = DataIO.Snapshot(connector, elm);
          tagName = StaticFunc.FilterString(item.TagLongName.ToString());
          if (!item.TagLongName.Contains("YDKR") && !item.TagLongName.Contains("MTBE"))
          {
            continue;
          }
          if (!double.TryParse(realdata.Value.ToString(), out tagValue))
          {
            continue;
          }
          if (!tagNameList.Contains(tagName))
            continue;
          if (string.IsNullOrEmpty(tagName))
            continue;
        
          count2++;
          if (r.Next(1, _random) == 8)
          {
            EFOperation.UpdateTag(new Models.Tag()
            {
              TagName = tagName,
              TagValue = realdata.Value.ToString(),
            }, flag, status);
            count++;
          }
          if (item.TagLongName.Contains("YDKR"))//有毒可燃判断方式
          {
            if (tagValue > 25 && tagValue <= 50)
            {
              #region 25 - 50
              flag = _cache.GetCache<string>(cachKey);
              status = _cache.GetCache<string>(cachKeyStatus);
              if (flag != null && flag == Const.ALARM_LEVLE_1)
              {
                if (status != Const.ALARM_LEVLE_1 && status != Const.ALARM_LEVLE_2)
                {
                  //前一次报警0，标记1，这次为一级报警 直接报警写库
                  record = new AlarmRecord()
                  {
                    TagName = StaticFunc.FilterString(item.TagLongName.ToString()),
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_1
                  };
                  EFOperation.AddAlarmRecord(record);
                  EFOperation.UpdateTag(new Models.Tag()
                  {
                    TagName = StaticFunc.FilterString(item.TagLongName.ToString()),
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_1
                  }, flag, status);
                  _cache.RemoveCache(cachKey);
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_1, cachKeyStatus, DateTime.Now.AddHours(10));
                  AddAlarmLog(record);
                  On();//亮起报警灯
                  count++;
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              else if (flag != null && flag == Const.ALARM_LEVLE_2)
              {
                if (status != Const.ALARM_LEVLE_1 || status != Const.ALARM_LEVLE_2)
                {
                  //前一次报警0，标记2，这次为1级报警 直接报警写库
                  record = new AlarmRecord()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_1
                  };
                  EFOperation.AddAlarmRecord(record);
                  EFOperation.UpdateTag(new Models.Tag()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_1
                  }, flag, status);
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_1, cachKeyStatus, DateTime.Now.AddHours(10));
                  _cache.RemoveCache(cachKey);
                  AddAlarmLog(record);
                  On();//亮起报警灯
                  count++;
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              else
              {
                if (status != Const.ALARM_LEVLE_1 || status != Const.ALARM_LEVLE_2)
                {
                  //前一次报警0，标记0，这次标记1
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_1, cachKey, DateTime.Now.AddHours(10));
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              #endregion
            }
            else if (tagValue > 50)
            {
              #region >50
             
              if (flag != null && flag == Const.ALARM_LEVLE_1)
              {
                if (status != Const.ALARM_LEVLE_1 && status != Const.ALARM_LEVLE_2)
                {
                  //前一次报警0，标记1，这次为2级报警 直接报警写库
                  record = new AlarmRecord()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_2
                  };
                  EFOperation.AddAlarmRecord(record);
                  EFOperation.UpdateTag(new Models.Tag()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_2
                  }, flag, status);
                  _cache.RemoveCache(cachKey);
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_2, cachKeyStatus, DateTime.Now.AddHours(10));
                  AddAlarmLog(record);
                  On();//亮起报警灯
                  count++;
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              else if (flag != null && flag == Const.ALARM_LEVLE_2)
              {
                if (status != Const.ALARM_LEVLE_1 || status != Const.ALARM_LEVLE_2)
                {
                  //前一次报警0，标记2，这次为2级报警 直接报警写库
                  record = new AlarmRecord()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_2
                  };
                  EFOperation.AddAlarmRecord(record);
                  EFOperation.UpdateTag(new Models.Tag()
                  {
                    TagName = StaticFunc.FilterString(item.TagLongName.ToString()),
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_2
                  }, flag, status);
                  _cache.RemoveCache(cachKey);
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_2, cachKeyStatus, DateTime.Now.AddHours(10));
                  AddAlarmLog(record);
                  On();//亮起报警灯
                  count++;
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              else
              {
                if (status != Const.ALARM_LEVLE_1 || status != Const.ALARM_LEVLE_2)
                {
                  //前一次报警0，标记0，这次标记1
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_1, cachKey, DateTime.Now.AddHours(10));
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              #endregion
            }
            else if (tagValue<25){
              //数据正常随机刷新
              if (r.Next(1, _random) == 8)
              {
                EFOperation.UpdateTag(new Models.Tag()
                {
                  TagName = tagName,
                  TagValue = realdata.Value.ToString(),
                  AlarmFlag = Const.ALARM_LEVLE_0
                }, flag, status);
                count++;
              }


              if (status == Const.ALARM_LEVLE_1 || status == Const.ALARM_LEVLE_2)
              {
                //前一次报警这一次 数据正常消除标记位,消除报警标记 更新状态
                EFOperation.UpdateTag(new Models.Tag()
                {
                  TagName = tagName,
                  TagValue = tagValue.ToString(),
                  AlarmFlag = Const.ALARM_LEVLE_0
                },flag,status);
                _cache.RemoveCache(cachKey);
                _cache.RemoveCache(cachKeyStatus);
                count++;
              }
            }
          }
          //重大危险源判断方式
          else
          {
            tag = EFOperation.GetTag(tagName);
            if (tag == null)
              continue;
            highLimit = tag.HighLimit;
            lowLimit = tag.LowLimit;
            if (!double.TryParse(realdata.Value.ToString(), out tagValue))
            {
                continue;
            }
            flag = _cache.GetCache<string>(cachKey);
            status = _cache.GetCache<string>(cachKeyStatus);

            if ((tag.HighLimitEnable && tagValue > highLimit) || (tag.LowLimitEnable && tagValue < lowLimit))
            {
              if (flag != null && flag == Const.ALARM_LEVLE_1)
              {
                if (status != Const.ALARM_LEVLE_1)
                {
                  //前一次报警0，标记1，报警
                  record = new AlarmRecord()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_1
                  };
                  EFOperation.AddAlarmRecord(record);
                  EFOperation.UpdateTag(new Models.Tag()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_1
                  },flag,status);
                  _cache.RemoveCache(cachKey);
                  _cache.WriteCache<string>(Const.ALARM_LEVLE_1, cachKeyStatus, DateTime.Now.AddHours(10));
                  AddAlarmLog(record);
                  On();//亮起报警灯
                  count++;
                }
                else
                {
                  //已经是报警状态，消除报警标记位
                  _cache.RemoveCache(cachKey);
                }
              }
              else
              {
                if (status != Const.ALARM_LEVLE_1)
                {
                  //前一次报警0，标记0，报警消除
                  _cache.RemoveCache(cachKeyStatus);
                  _cache.RemoveCache(cachKey);
                }
                else
                {
                  //前一次报警1，标记0，消除标记位
                  _cache.RemoveCache(cachKey);
                }
              }
            }
            else {
              //数据正常随机消除报警
              if (r.Next(1, _random) == 8)
              {
                EFOperation.UpdateTag(new Models.Tag()
                {
                  TagName = tagName,
                  TagValue = realdata.Value.ToString(),
                  AlarmFlag = Const.ALARM_LEVLE_0
                }, flag, status);
                count++;
              }

              if (status == Const.ALARM_LEVLE_1 || status == Const.ALARM_LEVLE_2)
              {
                
                  //前一次报警这一次 数据正常消除标记位,消除报警标记 更新状态
                  EFOperation.UpdateTag(new Models.Tag()
                  {
                    TagName = tagName,
                    TagValue = tagValue.ToString(),
                    AlarmFlag = Const.ALARM_LEVLE_0
                  },flag,status);
                  _cache.RemoveCache(cachKey);
                  _cache.RemoveCache(cachKeyStatus);
                  count++;
                
              }
            }
          }
          //aList.Add(new Alarm() { LongName = item.TagLongName, TagId = item.TagId.ToString(), TagValue = realdata.Value.ToString() });

        }
      }
      connector.Disconnect();

      Common.StopAPI();
      Console.WriteLine("update:"+count);
      Console.WriteLine("valid point:" + count2);
    }
    private static void AddAlarmLog(AlarmRecord record)
    {
      string s = $"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}:alarmInfo:{record.ToJson()}";
      Console.WriteLine(s);
      LogInfo.AlarmInfo.Info(s);
    }

    private static void On()
    {
      try
      {
        var httpCelint = new QxHttpClient();
        httpCelint.Get<string>(_url + "/ecmd?pin%20set%20k1%20on");
        _cache.WriteCache<string>(Const.ALARM_LEVLE_1, Const.ALARM_LIGHT, DateTime.Now.AddSeconds(lightTimes));
      }
      catch (Exception ex)
      {
        LogInfo.LightEx.Error(ex);
      }
    }

    private static void Off()
    {
      try
      {
        var httpCelint = new QxHttpClient();
        httpCelint.Get<string>(_url + "/ecmd?pin%20set%20k1%20off");
      }
      catch (Exception ex)
      {
        LogInfo.LightEx.Error(ex);
      }
    }

    public static void Load()
    {
      System.Timers.Timer aTimer = new System.Timers.Timer();
      aTimer.Elapsed += new ElapsedEventHandler(Task); //到达时间的时候执行事件；
                                                         // 设置引发时间的时间间隔 此处设置为1秒（1000毫秒） 
      aTimer.Interval =Convert.ToDouble(Configs.GetValue("Interval"));
      aTimer.AutoReset = true;//设置是执行一次（false）还是一直执行(true)；
      aTimer.Enabled = true; //是否执行System.Timers.Timer.Elapsed事件；
    }
    public static void Task(object source, System.Timers.ElapsedEventArgs e)
    {
      //如果任务在跑 直接结束
      if (_runStatus)
        return;
      try
      {
        _runStatus = true;
        RunAlarmMonitor();
        _runStatus = false;
      }
      catch (Exception ex)
      {
          LogInfo.AlarmException.Error(ex);
         //记录日志
         _runStatus = false;
      }
    }
  }
}
