using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using pSpaceCTLNET;
using Newtonsoft.Json;
using Microsoft.Owin.Hosting;
using HYIT.Alarm.Con.Utils;
using System.Timers;
using HYIT.Alarm.Con.EF;
using System.Data.Entity;
using static HYIT.Alarm.Con.EF.ApplicationDbContext;

namespace HYIT.Alarm.Con
{
  class Program
  {
    static void Main(string[] args)
    {
      //Console.WriteLine("Initializing and seeding database...");
      //Database.SetInitializer(new ApplicationDbInitializer());
      //var db = new ApplicationDbContext();
      //int count = db.Companies.Count();
      // Console.WriteLine("Initializing and seeding database with {0} company records...", count);
      Database.SetInitializer<ApplicationDbContext>(null); 
     
      var baseUri = $"{Configs.GetValue("StartUrl")}";
      Console.WriteLine("Starting web Server...");
      WebApp.Start<Startup>(baseUri);
      Console.WriteLine("Server running at {0} - press Enter to quit. ", baseUri);
      Console.WriteLine("timeTick start..");
      bool runTimeTask = Configs.GetValue<bool>("runTimeTask");
      if(runTimeTask)
      {
          AlarmHelper.Load();
      }
      Console.ReadLine();
    }  
  }
}
