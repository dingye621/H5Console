using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using pSpaceCTLNET;
using Newtonsoft.Json;
using Microsoft.Owin.Hosting;
using HYIT.Alarm.Con.Utils;

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


            var baseUri = $"{Configs.GetValue("StartUrl")}";
            Console.WriteLine("Starting web Server...");
            WebApp.Start<Startup>(baseUri);
            Console.WriteLine("Server running at {0} - press Enter to quit. ", baseUri);
            Console.ReadLine();
        }
    }
}
