using System;
using System.Collections.Generic;
using System.Linq;
using FlashCard.Dto;

namespace FlashCard.Util
{
	public static class CollectionUtil
	{
		public static IEnumerable<CardDto> TakeRandom(this IEnumerable<CardDto> source, int amount)
		{
			return source.OrderBy(x => Guid.NewGuid()).Take(amount);
		}
	}
}