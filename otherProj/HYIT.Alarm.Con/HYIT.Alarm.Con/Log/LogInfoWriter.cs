
using log4net;
using log4net.Appender;
using log4net.Core;
using log4net.Layout;
using log4net.Repository;
using log4net.Repository.Hierarchy;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using System.Web;

namespace HYIT.Alarm.Con.Log
{
  public class LogInfoWriter
  {
    public enum LogLayout
    {
      Default,
      WebCustom,
      Console
    }

    private const string SLogInfo = "Log.Info";

    private const string SLogError = "Log.Error";

    private const string SLogWarn = "Log.Warn";

    private static readonly string ServerHost = Dns.GetHostName();

    private static readonly string ServerIp = "";

    internal static readonly string LogFolder = ConfigurationManager.AppSettings["ErrorLogFolder"] ?? string.Empty;

    private static readonly string MaxLogFileSize = ConfigurationManager.AppSettings["MaxLogFileSize"] ?? string.Empty;

    private static readonly string LogLevel = ConfigurationManager.AppSettings["LogLevel"] ?? string.Empty;

    private static readonly bool IsSubmitCatLog = ConfigurationManager.AppSettings["IsSubmitCatLog"] != "false";

    private static readonly Dictionary<string, LogInfoWriter> InstanceDict = new Dictionary<string, LogInfoWriter>();

    private static readonly object LockObj = new object();

    private readonly ILog _errorlogger;

    private readonly ILog _infologger;

    private readonly string _logFile;

    private readonly ILog _warnlogger;

    private static Level MyLogLevel
    {
      get
      {
        Level result = Level.All;
        string a = LogInfoWriter.LogLevel.ToUpper();
        if (!(a == "INFO"))
        {
          if (!(a == "WARN"))
          {
            if (a == "ERROR")
            {
              result = Level.Error;
            }
          }
          else
          {
            result = Level.Warn;
          }
        }
        else
        {
          result = Level.Info;
        }
        return result;
      }
    }

    public LogInfoWriter(string logFile = "", int maxLogFileSize = 0, LogInfoWriter.LogLayout logLayout = LogInfoWriter.LogLayout.Default)
    {
      this._logFile = logFile;
      this._infologger = LogInfoWriter.CreateloggerByLevel(Level.Info, logFile, maxLogFileSize, logLayout);
      this._warnlogger = LogInfoWriter.CreateloggerByLevel(Level.Warn, logFile, maxLogFileSize, logLayout);
      this._errorlogger = LogInfoWriter.CreateloggerByLevel(Level.Error, logFile, maxLogFileSize, logLayout);
    }

    private static ILog CreateloggerByLevel(Level level, string logFile, int maxLogFileSize, LogInfoWriter.LogLayout logLayout)
    {
      string str = logFile + level;
      ConsoleAppender consoleAppender = new ConsoleAppender
      {
        Layout = new PatternLayout("%d [%t] %-5p %c [%x] - %m%n")
      };
      ILoggerRepository loggerRepository = null;
      try
      {
        loggerRepository = LogManager.CreateRepository(str + "Repository");
      }
      catch
      {
        loggerRepository = LogManager.GetRepository(str + "Repository");
      }
      Hierarchy hierarchy = (Hierarchy)loggerRepository;
      hierarchy.Root.AddAppender(consoleAppender);
      consoleAppender.ActivateOptions();
      RollingFileAppender rollingFileAppender = new RollingFileAppender();
      string text = level.ToString();
      if (level == Level.Warn)
      {
        text = "WARNING";
      }
      string text2 = LogInfoWriter.LogFolder;
      if (HttpContext.Current == null || HttpContext.Current.Handler == null)
      {
        Assembly assembly = Assembly.GetEntryAssembly();
        if (assembly == null)
        {
          assembly = Assembly.GetExecutingAssembly();
        }
        text2 = text2.Replace("{CurrentDomain}", (assembly != null) ? assembly.GetName().Name : null);
      }
      else
      {
        Type baseType = HttpContext.Current.Handler.GetType().BaseType;
        if (baseType != null)
        {
          string arg_117_0 = text2;
          string arg_117_1 = "{CurrentDomain}";
          Assembly expr_106 = baseType.Assembly;
          text2 = arg_117_0.Replace(arg_117_1, (expr_106 != null) ? expr_106.GetName().Name : null);
        }
      }
      text2 = text2.Replace("{CurrentDirectory}", new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory).Name);
      if (!string.IsNullOrEmpty(text2) && !text2.EndsWith("\\"))
      {
        text2 += "\\";
      }
      rollingFileAppender.File = string.Concat(new string[]
      {
                text2,
                logFile,
                "\\",
                text,
                "\\"
      });
      rollingFileAppender.AppendToFile = true;
      rollingFileAppender.MaxSizeRollBackups = -1;
      if (!string.IsNullOrEmpty(LogInfoWriter.MaxLogFileSize))
      {
        rollingFileAppender.MaximumFileSize = LogInfoWriter.MaxLogFileSize + "MB";
        rollingFileAppender.RollingStyle = RollingFileAppender.RollingMode.Composite;
      }
      else if (maxLogFileSize > 0)
      {
        rollingFileAppender.MaximumFileSize = maxLogFileSize + "MB";
        rollingFileAppender.RollingStyle = RollingFileAppender.RollingMode.Composite;
      }
      else
      {
        rollingFileAppender.RollingStyle = RollingFileAppender.RollingMode.Date;
      }
      rollingFileAppender.DatePattern = "yyyy-MM-dd\".txt\"";
      rollingFileAppender.StaticLogFileName = false;
      rollingFileAppender.LockingModel = new FileAppender.MinimalLock();
      if (logLayout == LogInfoWriter.LogLayout.Default)
      {
        rollingFileAppender.Layout = new PatternLayout("%date [%thread] %-5level - %message%newline");
      }
      else if (logLayout == LogInfoWriter.LogLayout.WebCustom)
      {
        rollingFileAppender.Layout = new PatternLayout(string.Concat(new string[]
        {
                    "%date %newline L-message ：%message%newline L_Level ：%-5level%newline L_Folder ：",
                    logFile,
                    "%newline L_CreatTime:%date%newline L_ServerHostName ：",
                    LogInfoWriter.ServerHost,
                    "%newline L_ServerHostIP ：",
                    LogInfoWriter.ServerIp,
                    "%newline---------------------------------------%newline"
        }));
      }
      rollingFileAppender.Encoding = Encoding.UTF8;
      rollingFileAppender.ActivateOptions();
      hierarchy.Root.AddAppender(rollingFileAppender);
      hierarchy.Configured = true;
      return LogManager.GetLogger(loggerRepository.Name, str + "Log");
    }

    public static LogInfoWriter GetInstance(string logFile = "", int maxLogFileSize = 0, LogInfoWriter.LogLayout logLayout = LogInfoWriter.LogLayout.Default)
    {
      if (LogInfoWriter.InstanceDict.ContainsKey(logFile))
      {
        return LogInfoWriter.InstanceDict[logFile];
      }
      LogInfoWriter result;
      lock (LogInfoWriter.LockObj)
      {
        if (LogInfoWriter.InstanceDict.ContainsKey(logFile))
        {
          result = LogInfoWriter.InstanceDict[logFile];
        }
        else
        {
          LogInfoWriter logInfoWriter = new LogInfoWriter(logFile, maxLogFileSize, logLayout);
          LogInfoWriter.InstanceDict.Add(logFile, logInfoWriter);
          result = logInfoWriter;
        }
      }
      return result;
    }

    private void ProccessCatTransaction(string logInfo, Action action)
    {
      if (!LogInfoWriter.IsSubmitCatLog)
      {
        return;
      }
      //if (Cat.GetManager() != null && Cat.GetManager().HasContext())
      //{
      //    action();
      //    return;
      //}
      //ITransaction arg_34_0 = Cat.NewTransaction(logInfo, this._logFile);
      action();
      //arg_34_0.set_Status("0");
      //arg_34_0.Complete();
    }

    public void Info(object message)
    {
      this.Info(message, true);
    }

    public void Info(object message, bool isSubmitCat)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.Info(message);
        //KafkaOpt.Add(this._logFile, Level.Info, message, null);
      }
    }

    public void Info(object message, Exception exception)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.Info(message, exception);
        //KafkaOpt.Add(this._logFile, Level.Info, message, exception);
      }
    }

    public void InfoFormat(string format, object arg0)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.InfoFormat(format, arg0);
        //KafkaOpt.Add(this._logFile, Level.Info, string.Format(format, arg0), null);
      }
    }

    public void InfoFormat(string format, params object[] args)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.InfoFormat(format, args);
        //KafkaOpt.Add(this._logFile, Level.Info, string.Format(format, args), null);
      }
    }

    public void InfoFormat(IFormatProvider provider, string format, params object[] args)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.InfoFormat(provider, format, args);
        //KafkaOpt.Add(this._logFile, Level.Info, string.Format(format, args), null);
      }
    }

    public void InfoFormat(string format, object arg0, object arg1)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.InfoFormat(format, arg0, arg1);
        //KafkaOpt.Add(this._logFile, Level.Info, string.Format(format, arg0, arg1), null);
      }
    }

    public void InfoFormat(string format, object arg0, object arg1, object arg2)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Info)
      {
        this._infologger.InfoFormat(format, arg0, arg1, arg2);
        //KafkaOpt.Add(this._logFile, Level.Info, string.Format(format, arg0, arg1, arg2), null);
      }
    }

    public void Warn(object message)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.Warn(message);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          //Cat.LogEvent("Log.Warn", this._logFile, Cat.get_Success(), ("msg=" + message) ?? "");
        });
        //KafkaOpt.Add(this._logFile, Level.Warn, message, null);
      }
    }

    public void Warn(object message, Exception exception)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.Warn(message, exception);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          string arg_57_0 = "Log.Warn";
          string arg_57_1 = this._logFile;
          //string arg_57_2 = Cat.get_Success();
          object[] expr_1B = new object[4];
          expr_1B[0] = "msg=";
          expr_1B[1] = message;
          expr_1B[2] = " ";
          int arg_51_1 = 3;
          Exception expr_3C = exception;
          expr_1B[arg_51_1] = (((expr_3C != null) ? expr_3C.ToString() : null) ?? string.Empty);
          //Cat.LogEvent(arg_57_0, arg_57_1, arg_57_2, string.Concat(expr_1B));
        });
        //KafkaOpt.Add(this._logFile, Level.Warn, message, exception);
      }
    }

    public void WarnFormat(string format, object arg0)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.WarnFormat(format, arg0);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          //Cat.LogEvent("Log.Warn", this._logFile, Cat.get_Success(), "msg=" + string.Format(format, arg0));
        });
        //KafkaOpt.Add(this._logFile, Level.Warn, string.Format(format, arg0), null);
      }
    }

    public void WarnFormat(string format, params object[] args)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.WarnFormat(format, args);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          //Cat.LogEvent("Log.Warn", this._logFile, Cat.get_Success(), "msg=" + string.Format(format, args));
        });
        // KafkaOpt.Add(this._logFile, Level.Warn, string.Format(format, args), null);
      }
    }

    public void WarnFormat(IFormatProvider provider, string format, params object[] args)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.WarnFormat(provider, format, args);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          //Cat.LogEvent("Log.Warn", this._logFile, Cat.get_Success(), "msg=" + string.Format(provider, format, args));
        });
        //KafkaOpt.Add(this._logFile, Level.Warn, string.Format(format, args), null);
      }
    }

    public void WarnFormat(string format, object arg0, object arg1)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.WarnFormat(format, arg0, arg1);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          //Cat.LogEvent("Log.Warn", this._logFile, Cat.get_Success(), "msg=" + string.Format(format, arg0, arg1));
        });
        //KafkaOpt.Add(this._logFile, Level.Warn, string.Format(format, arg0, arg1), null);
      }
    }

    public void WarnFormat(string format, object arg0, object arg1, object arg2)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Warn)
      {
        this._warnlogger.WarnFormat(format, arg0, arg1, arg2);
        this.ProccessCatTransaction("Log.Warn", delegate
        {
          // Cat.LogEvent("Log.Warn", this._logFile, Cat.get_Success(), "msg=" + string.Format(format, arg0, arg1, arg2));
        });
        //KafkaOpt.Add(this._logFile, Level.Warn, string.Format(format, arg0, arg1, arg2), null);
      }
    }

    public void Error(object message)
    {
      this.Error(message, true);
    }

    public void Error(object message, bool isSubmitCat)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.Error(message);
        if (isSubmitCat)
        {
          this.ProccessCatTransaction("Log.Error", delegate
          {
            //Cat.LogEvent("Log.Error", this._logFile, "-1", ("msg=" + message) ?? "");
          });
        }
        //KafkaOpt.Add(this._logFile, Level.Error, message, null);
      }
    }

    public void Error(object message, Exception exception)
    {
      this.Error(message, exception, true);
    }

    public void Error(object message, Exception exception, bool isSubmitCat)
    {
      if (exception == null)
      {
        return;
      }
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.Error(message, exception);
        if (isSubmitCat)
        {
          this.ProccessCatTransaction("Log.Error", delegate
          {
            //Cat.LogEvent("Log.Error", this._logFile, "-1", ("msg=" + message) ?? "");
            //Cat.LogError(exception);
          });
        }
        //KafkaOpt.Add(this._logFile, Level.Error, message, exception);
      }
    }

    public void ErrorFormat(string format, object arg0)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.ErrorFormat(format, arg0);
        this.ProccessCatTransaction("Log.Error", delegate
        {
          //Cat.LogEvent("Log.Error", this._logFile, "-1", "msg=" + string.Format(format, arg0));
        });
        //KafkaOpt.Add(this._logFile, Level.Error, string.Format(format, arg0), null);
      }
    }

    public void ErrorFormat(string format, params object[] args)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.ErrorFormat(format, args);
        this.ProccessCatTransaction("Log.Error", delegate
        {
          // Cat.LogEvent("Log.Error", this._logFile, "-1", "msg=" + string.Format(format, args));
        });
        //KafkaOpt.Add(this._logFile, Level.Error, string.Format(format, args), null);
      }
    }

    public void ErrorFormat(IFormatProvider provider, string format, params object[] args)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.ErrorFormat(provider, format, args);
        this.ProccessCatTransaction("Log.Error", delegate
        {
          //Cat.LogEvent("Log.Error", this._logFile, "-1", "msg=" + string.Format(provider, format, args));
        });
        //KafkaOpt.Add(this._logFile, Level.Error, string.Format(format, args), null);
      }
    }

    public void ErrorFormat(string format, object arg0, object arg1)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.ErrorFormat(format, arg0, arg1);
        this.ProccessCatTransaction("Log.Error", delegate
        {
          // Cat.LogEvent("Log.Error", this._logFile, "-1", "msg=" + string.Format(format, arg0, arg1));
        });
        //KafkaOpt.Add(this._logFile, Level.Error, string.Format(format, arg0, arg1), null);
      }
    }

    public void ErrorFormat(string format, object arg0, object arg1, object arg2)
    {
      if (LogInfoWriter.MyLogLevel <= Level.Error)
      {
        this._errorlogger.ErrorFormat(format, arg0, arg1, arg2);
        this.ProccessCatTransaction("Log.Error", delegate
        {
          // Cat.LogEvent("Log.Error", this._logFile, "-1", "msg=" + string.Format(format, arg0, arg1, arg2));
        });
        //KafkaOpt.Add(this._logFile, Level.Error, string.Format(format, arg0, arg1, arg2), null);
      }
    }
  }
}
