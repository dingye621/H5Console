using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace HYIT.Alarm.Con.Cache
{

  public class Const
  {
    //CacheKey
    public static string ALARM_FLAG_KEY = "AlarmFlagKey";  //报警状态标记位
    
  }
  public interface ICache
  {
    T GetCache<T>(string cacheKey) where T : class;
    void WriteCache<T>(T value, string cacheKey) where T : class;
    void WriteCache<T>(T value, string cacheKey, DateTime expireTime) where T : class;
    void RemoveCache(string cacheKey);
    void RemoveCache();
  }
  public class Cache : ICache
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
_cache.xxxx();
   */

