using System;

namespace FlashCard.Util
{
	public class DateTimeUtil
	{
		public static DateTime[] GetDaysOfWeek()
		{
			var now = DateTime.Now;
			var dates = new DateTime[7];
			var currentIndex = GetIndex(now);

			var count = 0;
			while (count++ <= 6)
			{
				var tempIndex = (currentIndex + count) % 7;
				dates[tempIndex] = now.AddDays(tempIndex - currentIndex).Date;
			}

			return dates;
		}

		private static int GetIndex(DateTime now)
		{
			switch (now.DayOfWeek)
			{
				case DayOfWeek.Monday:
					return 0;
				case DayOfWeek.Tuesday:
					return 1;
				case DayOfWeek.Wednesday:
					return 2;
				case DayOfWeek.Thursday:
					return 3;
				case DayOfWeek.Friday:
					return 4;
				case DayOfWeek.Saturday:
					return 5;
				case DayOfWeek.Sunday:
					return 6;
				default:
					return -1;
			}
		}

		public static string GetDuration(DateTime testedTime, DateTime now) {
			var time = now.Subtract(testedTime).TotalSeconds;
			var temp = 0;
			var unit = "";
			var prefix = "Tested";

			if (time < 60)
			{
				temp = (int)Math.Ceiling(time);
				unit = "second";
			}
			else if (time < 3600)
			{
				temp = (int)Math.Floor(time / 60);
				unit = "minute";
			}
			else if (time < 86400)
			{
				temp = (int)Math.Floor(time / 360);
				unit = "hour";
			}
			else if (time < 2592000)
			{
				temp = (int)Math.Floor(time / 86000);
				unit = "day";
			}
			else
			{
				unit = "date";
			}

			if (unit == "date")
			{
				return $"{prefix} {testedTime.Date}";
			}
			if (temp == 1)
			{
				return $"{prefix} 1 {unit} ago";
			}
			return $"{prefix} {temp} {unit}s ago";
		}
	}
}