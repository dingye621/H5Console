using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using HYIT.Alarm.Con.Utils;
using Newtonsoft.Json;
using pSpaceCTLNET;

namespace HYIT.Alarm.Con
{
    public class AlarmHelper
    {
        public List<Alarm> GetAlarm()
        {

            List<Alarm> aList = new List<Alarm>();
            try
            {
                Common.StartAPI();

                var serverName=Configs.GetValue("ServerName");
                var userName = Configs.GetValue("UserName");
                var password = Configs.GetValue("Password");

                var connector = new DbConnector()
                {
                    UseProxy = false,
                    //ServerName ="10.109.75.90",
                    //ServerName = "192.168.0.120",
                    ServerName= serverName,
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
                        var arr = item.TagLongName.Split(new string[] { @"\\"}, StringSplitOptions.None);
                        var longName = string.Empty;
                        if(arr.Length>0)
                             longName = arr[arr.Length - 1];
                        aList.Add(new Alarm() {LongName= longName, TagId=item.TagId.ToString(), TagValue=realdata.Value.ToString()});
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
    }
}
