using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace HYIT.Alarm.Con
{
  public class Alarm : MetaEntity
  {
    public string TagId { get; set; }

    public string TagValue { get; set; }

    public string AlarmFlag { get; set; }  //报警 0 未报警 1低报 2高报

    public string LongName { get; set; }

    public string TagName { get; set; }
  }

  [Table("A_ALARMRECORD")]
  public class AlarmRecord : MetaEntity
  {
    [StringLength(50), Required]
    [Column("TAG_NAME")]
    public string TagName { get; set; }
    [StringLength(50), Required]
    [Column("TAG_VALUE")]
    public string TagValue { get; set; }
    [StringLength(50)]
    [Column("Flag")]
    public string AlarmFlag { get; set; }

    [Column("IS_DEAL")]
    public int? IsDeal { get; set; }
    [StringLength(50)]
    [Column("DEALER")]
    public string Dealer { get; set; }

    [Column("DEAL_TIME")]
    public DateTime? DealTime { get; set; }
  }
}

