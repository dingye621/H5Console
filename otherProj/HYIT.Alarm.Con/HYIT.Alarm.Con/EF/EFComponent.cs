using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HYIT.Alarm.Con.EF
{
  public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext() : base("AlarmDatabase")
    {
    }
    public IDbSet<Alarm> Alarms { get; set; }

    public class ApplicationDbInitializer : DropCreateDatabaseAlways<ApplicationDbContext>
    {
      protected override void Seed(ApplicationDbContext context)
      {
        base.Seed(context);
        //context.Alarms.Add(new Alarm { TagValue = "1",TagName="2" });
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
