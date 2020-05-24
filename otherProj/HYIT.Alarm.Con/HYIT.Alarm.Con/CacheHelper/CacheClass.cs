using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace HYIT.Alarm.Con.CacheHelper
{

  public class Const
  {
    //CacheKey
    public const string ALARM_FLAG_KEY = "AlarmFlag";  //报警前状态标记位
    public const string ALARM_STATUS_KEY = "AlarmStatus"; //已报警状态标记位
    public const string ALARM_LEVLE_0 = "0";   //未报警
    public const string ALARM_LEVLE_1 = "1";   //一级报警
    public const string ALARM_LEVLE_2 = "2";   //二级报警
    public const double DEFAULT_VALUE = -999999;
  }
  public interface ICache
  {
    T GetCache<T>(string cacheKey) where T : class;
    void WriteCache<T>(T value, string cacheKey) where T : class;
    void WriteCache<T>(T value, string cacheKey, DateTime expireTime) where T : class;
    void RemoveCache(string cacheKey);
    void RemoveCache();
  }
  public class CacheClass : ICache
  {
    private static System.Web.Caching.Cache cache = HttpRuntime.Cache;

    public T GetCache<T>(string cacheKey) where T : class
    {
      if (cache[cacheKey] != null)
      {
        return (T)cache[cacheKey];
      }
      return default(T);
    }
    public void WriteCache<T>(T value, string cacheKey) where T : class
    {
      cache.Insert(cacheKey, value, null, DateTime.Now.AddMinutes(10), System.Web.Caching.Cache.NoSlidingExpiration);
    }
    public void WriteCache<T>(T value, string cacheKey, DateTime expireTime) where T : class
    {
      cache.Insert(cacheKey, value, null, expireTime, System.Web.Caching.Cache.NoSlidingExpiration);
    }
    public void RemoveCache(string cacheKey)
    {
      cache.Remove(cacheKey);
    }
    public void RemoveCache()
    {
      IDictionaryEnumerator CacheEnum = cache.GetEnumerator();
      while (CacheEnum.MoveNext())
      {
        cache.Remove(CacheEnum.Key.ToString());
      }
    }
  }
}
/*
Cache _cache=new Cache();

   cache.WriteCache(rcList, routeClassCacheKey, DateTime.Now.AddHours(1));
   _cache.RemoveCache(Const.ROUTE_CACHE_KEY);
    _cache.GetCache<List<D_dj_detectroute>>(cacheKey);
   */

