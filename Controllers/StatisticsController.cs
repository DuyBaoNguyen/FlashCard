using System;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class StatisticsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;

		public StatisticsController(IRepositoryWrapper repository)
		{
			this.repository = repository;
		}

		[HttpGet("test")]
		[ProducesResponseType(200)]
		public async Task<ActionResult> GetTestStatistics()
		{
			var userId = UserUtil.GetUserId(User);

			var amountTests = 2;
			var dates = DateTimeUtil.GetDaysOfWeek();

			var tests = await repository.Test
				.QueryIncludesTestedCards(userId, dates)
				.AsNoTracking()
				.ToListAsync();
			var groups = tests.GroupBy(t => t.DateTime.Date).ToDictionary(g => g.Key);
			var statistics = dates.Select(d =>
			{
				var tests = groups.ContainsKey(d) ? groups[d] : null;
				return new
				{
					DateTime = d,
					TotalCards = tests != null
						? tests.Sum(t => t.TestedCards.Count) : 0,
					FailedCards = tests != null
						? tests.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()) : 0,
					GradePointAverage = tests == null || tests.Count() == 0
						? 0 : Math.Round(tests.Average(t => t.Score), 2),
					Tests = tests != null ? tests.Take(amountTests).MapToTestDto() : null
				};
			});

			return Ok(statistics);
		}

		[HttpGet("match")]
		[ProducesResponseType(200)]
		public async Task<ActionResult> GetMatchStatistics()
		{
			var userId = UserUtil.GetUserId(User);

			var amountMatches = 2;
			var dates = DateTimeUtil.GetDaysOfWeek();

			var matches = await repository.Match
				.QueryIncludesMatchedCards(userId, dates)
				.AsNoTracking()
				.ToListAsync();
			var groups = matches.GroupBy(m => m.StartTime.Date).ToDictionary(g => g.Key);
			var statistics = dates.Select(d =>
			{
				var matches = groups.ContainsKey(d) ? groups[d] : null;
				return new
				{
					DateTime = d,
					TotalCards = matches != null
						? matches.Sum(m => m.MatchedCards.Count) : 0,
					FailedCards = matches != null
						? matches.Sum(m => m.MatchedCards.Where(mc => mc.Failed).Count()) : 0,
					GradePointAverage = matches == null || matches.Count() == 0
						? 0 : Math.Round(matches.Average(m => m.Score), 2),
					Tests = matches != null ? matches.Take(amountMatches).MapToMatchDto() : null
				};
			});

			return Ok(statistics);
		}

		// [HttpGet]
		// [ProducesResponseType(200)]
		// public async Task<ActionResult> GetStatistics()
		// {
		// 	var userId = UserUtil.GetUserId(User);
		// 	var today = DateTime.Now;
		// 	var amountTest = 5;
		// 	var amountMatch = 5;
		// 	var tests = await repository.Test
		// 		.QueryIncludesTestedCards(userId)
		// 		.AsNoTracking()
		// 		.ToListAsync();
		// 	var testsToday = tests.Where(t => t.DateTime.Date == today.Date);
		// 	var matches = await repository.Match
		// 		.QueryIncludesMatchedCards(userId)
		// 		.AsNoTracking()
		// 		.ToListAsync();
		// 	var matchesToday = matches.Where(m => m.StartTime.Date == today.Date);

		// 	return Ok(new
		// 	{
		// 		Test = new
		// 		{
		// 			Statistics = new
		// 			{
		// 				Today = new
		// 				{
		// 					TotalCards = testsToday.Sum(t => t.TestedCards.Count),
		// 					FailedCards = testsToday.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
		// 					GradePointAverage = testsToday.Count() == 0 ? 0 : Math.Round(testsToday.Average(t => t.Score), 2)
		// 				},
		// 				Summary = new
		// 				{
		// 					TotalCards = tests.Sum(t => t.TestedCards.Count),
		// 					FailedCards = tests.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
		// 					GradePointAverage = tests.Count == 0 ? 0 : Math.Round(tests.Average(t => t.Score), 2)
		// 				}
		// 			},
		// 			Data = tests.Take(amountTest).MapToTestDto()
		// 		},
		// 		Match = new
		// 		{
		// 			Statistics = new
		// 			{
		// 				Today = new
		// 				{
		// 					TotalCards = matchesToday.Sum(t => t.MatchedCards.Count),
		// 					FailedCards = matchesToday.Sum(t => t.MatchedCards.Where(tc => tc.Failed).Count()),
		// 					GradePointAverage = matchesToday.Count() == 0 ? 0 : Math.Round(matchesToday.Average(t => t.Score), 2)
		// 				},
		// 				Summary = new
		// 				{
		// 					TotalCards = matches.Sum(t => t.MatchedCards.Count),
		// 					FailedCards = matches.Sum(t => t.MatchedCards.Where(tc => tc.Failed).Count()),
		// 					GradePointAverage = matches.Count == 0 ? 0 : Math.Round(matches.Average(t => t.Score), 2)
		// 				}
		// 			},
		// 			Data = matches.Take(amountMatch).MapToMatchDto()
		// 		}
		// 	});
		// }
	}
}