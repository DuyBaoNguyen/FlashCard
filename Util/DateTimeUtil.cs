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
	}
}