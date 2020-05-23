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

namespace HYIT.Alarm.Con
{
  public class AlarmHelper
  {
    private static string _serverName { get; set; }
    private static string _userName { get; set; }
    private static string _password { get; set; }

    private static bool _runStatus { get; set; } //任务运行状态
    public AlarmHelper()
    {
      _serverName = Configs.GetValue("ServerName");
      _userName = Configs.GetValue("UserName");
      _password = Configs.GetValue("Password");
      _runStatus = false;
    }

    public List<Alarm> GetAlarm()
    {

      List<Alarm> aList = new List<Alarm>();
      try
      {
        Common.StartAPI();

        var serverName = Configs.GetValue("ServerName");
        var userName = Configs.GetValue("UserName");
        var password = Configs.GetValue("Password");

        var connector = new DbConnector()
        {
          UseProxy = false,
          //ServerName ="10.109.75.90",
          //ServerName = "192.168.0.120",
          ServerName = serverName,
          UserName = userName,
          Password = password,
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
            var res = JsonConvert.SerializeObject(item);
            var arr = item.TagLongName.Split(new string[] { @"\\" }, StringSplitOptions.None);
            var longName = string.Empty;
            if (arr.Length > 0)
              longName = arr[arr.Length - 1];
            aList.Add(new Alarm() { LongName = longName, TagId = item.TagId.ToString(), TagValue = realdata.Value.ToString() });
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

        throw;
      }
    }

    /// <summary>
    /// 报警监测
    /// </summary>
    /// <returns></returns>
    public static List<Alarm> RunAlarmMonitor()
    {

      List<Alarm> aList = new List<Alarm>();
      try
      {
        Common.StartAPI();

        //var serverName = Configs.GetValue("ServerName");
       // var userName = Configs.GetValue("UserName");
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
            var res = JsonConvert.SerializeObject(item);
            var arr = item.TagLongName.Split(new string[] { @"\\" }, StringSplitOptions.None);
            var longName = string.Empty;
            if (arr.Length > 0)
              longName = arr[arr.Length - 1];
            aList.Add(new Alarm() { LongName = longName, TagId = item.TagId.ToString(), TagValue = realdata.Value.ToString() });
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

        throw;
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
        RunAlarmMonitor();
        _runStatus = false;
      }
      catch (Exception ex)
      {
          LogInfo.AlarmException.Error(ex);
         //记录日志
         _runStatus = false;
        throw;
      }
    }
  }
}
