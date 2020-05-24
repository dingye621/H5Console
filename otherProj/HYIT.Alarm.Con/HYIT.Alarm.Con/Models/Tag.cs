using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HYIT.Alarm.Con.Models
{
  [Table("PROC_TAG")]
  public class Tag : MetaEntity
  {
    [Required, StringLength(255)]
    [Column("TAG_NAME")]
    public string TagName { get; set; }

    [StringLength(512)]
    [Column("TAG_DESCRIPTION")]
    public string TagDescription { get; set; }

    [StringLength(50)]
    [Column("TAG_SHORTNAME")]
    public string TagShortName { get; set; }

    [StringLength(32)]
    [Column("TAG_UNIT")]
    public string TagUnit { get; set; }
    [StringLength(32)]
    [Column("EQU_ID")]
    public string EquId { get; set; }
    [Column("HIGH_LIMIT")]
    public double HighLimit { get; set; }
    [Column("HIGH_LIMIT_ENABLE")]
    public bool HighLimitEnable { get; set; }
    [Column("LOW_LIMIT")]
    public double LowLimit { get; set; }
    [Column("LOW_LIMIT_ENABLE")]
    public bool LowLimitEnable { get; set; }
    [Column("ALERT_ENABLE")]
    public bool AlertEnable { get; set; }
    [Column("F_THRESHOLD")]
    public decimal? FThreshold { get; set; }
    [Column("S_THRESHOLD")]
    public decimal? SThreshold { get; set; }
    [StringLength(32)]
    [Column("TAG_VALUE")]
    public string TagValue { get; set; }
    [StringLength(32)]
    [Column("ALARM_FLAG")]
    public string AlarmFlag { get; set; }
  }
}
