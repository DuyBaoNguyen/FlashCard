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

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<ActionResult> GetStatistics()
		{
			var userId = UserUtil.GetUserId(User);
			var today = DateTime.Now;
			var amountTest = 5;
			var amountMatch = 5;
			var tests = await repository.Test
				.QueryIncludesTestedCards(userId)
				.AsNoTracking()
				.ToListAsync();
			var testsToday = tests.Where(t => t.DateTime.Date == today.Date);
			var matches = await repository.Match
				.QueryIncludesMatchedCards(userId)
				.AsNoTracking()
				.ToListAsync();
			var matchesToday = matches.Where(m => m.StartTime.Date == today.Date);

			return Ok(new
			{
				Test = new
				{
					Statistics = new
					{
						Today = new
						{
							TotalCards = testsToday.Sum(t => t.TestedCards.Count),
							FailedCards = testsToday.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
							GradePointAverage = testsToday.Count() == 0 ? 0 : Math.Round(testsToday.Average(t => t.Score), 2)
						},
						Summary = new
						{
							TotalCards = tests.Sum(t => t.TestedCards.Count),
							FailedCards = tests.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
							GradePointAverage = tests.Count == 0 ? 0 : Math.Round(tests.Average(t => t.Score), 2)
						}
					},
					Data = tests.Take(amountTest).MapToTestDto()
				},
				Match = new
				{
					Statistics = new
					{
						Today = new
						{
							TotalCards = matchesToday.Sum(t => t.MatchedCards.Count),
							FailedCards = matchesToday.Sum(t => t.MatchedCards.Where(tc => tc.Failed).Count()),
							GradePointAverage = matchesToday.Count() == 0 ? 0 : Math.Round(matchesToday.Average(t => t.Score), 2)
						},
						Summary = new
						{
							TotalCards = matches.Sum(t => t.MatchedCards.Count),
							FailedCards = matches.Sum(t => t.MatchedCards.Where(tc => tc.Failed).Count()),
							GradePointAverage = matches.Count == 0 ? 0 : Math.Round(matches.Average(t => t.Score), 2)
						}
					},
					Data = matches.Take(amountMatch).MapToMatchDto()
				}
			});
		}
	}
}