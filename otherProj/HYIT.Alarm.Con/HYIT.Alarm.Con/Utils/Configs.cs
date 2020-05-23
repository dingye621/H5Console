using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HYIT.Alarm.Con.Utils
{
    public class Configs
    {
        /// <summary>
        /// 根据Key取Value值
        /// </summary>
        /// <param name="key"></param>
        public static string GetValue(string key, string defaultValue = "")
        {
            var value = ConfigurationManager.AppSettings[key];
            return value == null ? defaultValue : value.ToString().Trim();
        }
        /// <summary>
        /// 根据Key取Value值
        /// </summary>adm
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>

        public static T GetValue<T>(string key)
        {
            string @object = GetValue(key);
            try
            {
                T t = @object.ToObject<T>();
                return t;
            }
            catch
            {
                return default(T);
            }
        } 
    }
}
