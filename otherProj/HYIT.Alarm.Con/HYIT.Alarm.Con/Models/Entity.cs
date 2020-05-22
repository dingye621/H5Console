using System;
using System.Collections.Generic;

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

        public string Id { get; set; }

        public long SortId { get; set; }

        public DateTime CreateTime { get; set; }
      
        public DateTime UpdateTime { get; set; }
    }

}
