using HYIT.Alarm.Con.Log;
using HYIT.Alarm.Con.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HYIT.Alarm.Con.Utils.Json;

namespace HYIT.Alarm.Con.EF
{
  public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext() : base("AlarmDatabase")
    {
    }
    public IDbSet<Alarm> Alarms { get; set; }

    public IDbSet<Tag> Tags { get; set; }

    public IDbSet<AlarmRecord> AlarmRecords { get; set; }

    public class ApplicationDbInitializer : DropCreateDatabaseAlways<ApplicationDbContext>
    {
      protected override void Seed(ApplicationDbContext context)
      {
        base.Seed(context);
        //context.Alarms.Add(new Alarm { TagValue = "1",TagName="2" });
      }
    }
  }


  public static class EFOperation
  {
    public static void AddAlarmRecord(AlarmRecord alarmRecord)
    {
      using (ApplicationDbContext _Db = new ApplicationDbContext())
      {
        _Db.AlarmRecords.Add(alarmRecord);
        _Db.SaveChanges();
      }
    }

    public static void UpdateTag(Tag tag)
    {
      using (ApplicationDbContext _Db = new ApplicationDbContext())
      {
        var existing = _Db.Tags.FirstOrDefault(c => c.TagName == tag.TagName);
        if (existing != null)
        {
          existing.TagValue = tag.TagValue;
          if(!string.IsNullOrEmpty(tag.AlarmFlag))
          existing.AlarmFlag = tag.AlarmFlag;
          LogInfo.AlarmInfo.InfoFormat("alarm update:{0}", tag.ToJson());
          _Db.SaveChanges();
        }
      }
    }
    public static Tag GetTag(string tagName)
    {
      using (ApplicationDbContext _Db = new ApplicationDbContext())
      {
        return _Db.Tags.FirstOrDefault(c => c.TagName == tagName);
      }
    }
  }
}

  
//下列为Ef用法
/*
 public class CompaniesController : ApiController
    {
        ApplicationDbContext _Db = new ApplicationDbContext();
        public IEnumerable<Company> Get()
        {
            return _Db.Companies;
        }
public async Task<Company> Get(int id)
{
  var company = await _Db.Companies.FirstOrDefaultAsync(c => c.Id == id);
  if (company == null)
  {
    throw new HttpResponseException(
        System.Net.HttpStatusCode.NotFound);
  }
  return company;
}


public async Task<IHttpActionResult> Post(Company company)
{
  if (company == null)
  {
    return BadRequest("Argument Null");
  }
  var companyExists = await _Db.Companies.AnyAsync(c => c.Id == company.Id);

  if (companyExists)
  {
    return BadRequest("Exists");
  }

  _Db.Companies.Add(company);
  await _Db.SaveChangesAsync();
  return Ok();
}


public async Task<IHttpActionResult> Put(Company company)
{
  if (company == null)
  {
    return BadRequest("Argument Null");
  }
  var existing = await _Db.Companies.FirstOrDefaultAsync(c => c.Id == company.Id);

  if (existing == null)
  {
    return NotFound();
  }

  existing.Name = company.Name;
  await _Db.SaveChangesAsync();
  return Ok();
}


public async Task<IHttpActionResult> Delete(int id)
{
  var company = await _Db.Companies.FirstOrDefaultAsync(c => c.Id == id);
  if (company == null)
  {
    return NotFound();
  }
  _Db.Companies.Remove(company);
  await _Db.SaveChangesAsync();
  return Ok();
}
*/
