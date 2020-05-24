using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HYIT.Alarm.Con
{
  public abstract class Meta
  {

  }

  public abstract class MetaEntity : Meta
  {
    public MetaEntity()
    {
      Id = $"{Guid.NewGuid():N}";
      SortId = 0;
      var now = DateTime.Now;
      CreateTime = now;
      UpdateTime = now;
    }
    [Key, Required, StringLength(32, MinimumLength = 32)]
    [Column("ID")]
    public string Id { get; set; }

    [Required]
    [Column("SORT_ID")]
    public long SortId { get; set; }

    [Required]
    [Column("CREATE_TIME")]
    public DateTime CreateTime { get; set; }

    [Required]
    [Column("UPDATE_TIME")]
    public DateTime UpdateTime { get; set; }
  }

}
