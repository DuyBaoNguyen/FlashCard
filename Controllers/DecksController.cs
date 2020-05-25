using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class DecksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;

		public DecksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<IEnumerable<DeckDto>> GetAllDecks(string name)
		{
			var userId = UserUtil.GetUserId(User);
			var decks = await repository.Deck
				.Query(userId, name)
				.AsNoTracking()
				.MapToDeckDto()
				.ToListAsync();

			var now = DateTime.Now;
			foreach (var deck in decks)
			{
				if (deck.LastTestedTime != null) {
					deck.LastTestedTime = DateTimeUtil.GetDuration(DateTime.Parse(deck.LastTestedTime), now);
				}
			}

			return decks;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<DeckDto>> GetDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.MapToDeckDto()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			return deck;
		}

		[HttpGet("{id}/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOfDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.QueryByDeckId(id)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			return cards;
		}

		[HttpGet("{id}/remainingcards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOutOfDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryById(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var remainingCards = await repository.Card
				.QueryRemainingByDeckId(userId, id)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			return remainingCards;
		}

		[HttpPost]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> Create(DeckRequestModel deckRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var deckSameName = await repository.Deck
				.QueryByName(userId, deckRqModel.Name)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deckSameName != null)
			{
				ModelState.AddModelError("Name", "The deck name is taken.");
				return BadRequest(ModelState);
			}

			var now = DateTime.Now;
			var newDeck = new Deck()
			{
				Name = deckRqModel.Name.Trim(),
				Description = deckRqModel.Description == null || deckRqModel.Description.Trim().Length == 0
					? null : deckRqModel.Description.Trim(),
				Theme = deckRqModel.Theme,
				CreatedDate = now,
				LastModifiedDate = now,
				OwnerId = userId,
				AuthorId = userId
			};

			repository.Deck.Create(newDeck);
			await repository.SaveChangesAsync();

			return CreatedAtAction(nameof(GetDeck), new { Id = newDeck.Id },
				new { Message = "Created Successfully", Id = newDeck.Id });
		}

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Update(int id, DeckRequestModel deckRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var existingDeck = await repository.Deck
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (existingDeck == null)
			{
				return NotFound();
			}

			var deckSameName = await repository.Deck
				.QueryByName(userId, deckRqModel.Name)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deckSameName != null && deckSameName.Id != existingDeck.Id)
			{
				ModelState.AddModelError("Name", "The deck name is taken.");
				return BadRequest(ModelState);
			}

			existingDeck.Name = deckRqModel.Name.Trim();
			existingDeck.Description = deckRqModel.Description == null || deckRqModel.Description.Trim().Length == 0
				? null : deckRqModel.Description.Trim();
			existingDeck.Theme = deckRqModel.Theme;
			existingDeck.LastModifiedDate = DateTime.Now;

			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{id}/public")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> UpdateStatus(int id, BoolValueRequestModel valueRqModel)
		{
			var user = await UserUtil.GetUser(userManager, User);
			var deck = await repository.Deck
				.QueryById(user.Id, id)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var userIsAdmin = await userManager.IsInRoleAsync(user, Roles.Administrator);

			deck.Public = valueRqModel.Value;
			deck.Approved = valueRqModel.Value && (userIsAdmin || deck.Approved);

			await repository.SaveChangesAsync();
			return NoContent();
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Delete(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var existingDeck = await repository.Deck
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (existingDeck == null)
			{
				return NotFound();
			}

			repository.Deck.Delete(existingDeck);
			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{deckId}/cards/{cardId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> AddCardToDeck(int deckId, int cardId)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdIncludesCardAssignments(userId, deckId)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var card = await repository.Card
				.QueryById(userId, cardId)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}
			if (deck.CardAssignments.Any(ca => ca.CardId == cardId))
			{
				return NoContent();
			}

			deck.CardAssignments.Add(new CardAssignment() { Card = card });
			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{deckId}/cards/{cardId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> RemoveCardFromDeck(int deckId, int cardId)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdIncludesCardAssignments(userId, deckId)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var card = await repository.Card
				.QueryById(userId, cardId)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}

			var cardAssignment = deck.CardAssignments.FirstOrDefault(ca => ca.CardId == cardId);
			if (cardAssignment != null)
			{
				deck.CardAssignments.Remove(cardAssignment);
				await repository.SaveChangesAsync();
			}

			return NoContent();
		}

		[HttpGet("{id}/test/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetTestedCardsRandom(int id, int amount = -1)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.QueryByDeckId(id)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			amount = amount < 0 || amount > cards.Count ? cards.Count : amount;

			return Ok(cards.TakeRandom(amount));
		}

		[HttpPost("{id}/test")]
		[ProducesResponseType(200)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> SubmitTest(int id, TestRequestModel testRqModel)
		{
			var user = await userManager.GetUser(User);
			// Admin can't sumbit test
			if (await userManager.IsInRoleAsync(user, Roles.Administrator))
			{
				return Ok();
			}

			if (testRqModel.SucceededCardIds.Intersect(testRqModel.FailedCardIds).Count() > 0)
			{
				ModelState.AddModelError("", "At least a card is both succeeded and failed.");
				return BadRequest(ModelState);
			}

			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(user.Id, id)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var newTest = new Test()
			{
				DateTime = testRqModel.DateTime.Value,
				Deck = deck,
				Taker = user,
				TestedCards = new List<TestedCard>()
			};
			var cards = await repository.Card
				.QueryByDeckId(id)
				.ToListAsync();
			var succeededCards = FilterCards(cards, testRqModel.SucceededCardIds);
			var failedCards = FilterCards(cards, testRqModel.FailedCardIds);

			foreach (var card in succeededCards)
			{
				newTest.TestedCards.Add(new TestedCard()
				{
					Card = card,
					Failed = false
				});
			}
			foreach (var card in failedCards)
			{
				newTest.TestedCards.Add(new TestedCard()
				{
					Card = card,
					Failed = true
				});
			}

			newTest.Score = (float)succeededCards.Count / (succeededCards.Count + failedCards.Count);

			repository.Test.Create(newTest);
			await repository.SaveChangesAsync();

			return Ok();
		}

		[HttpGet("{id}/match/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetMatchedCardsRandom(int id, int amount = -1)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.QueryByDeckId(id)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			amount = amount < 0 || amount > cards.Count ? cards.Count : amount;

			return Ok(cards.TakeRandom(amount));
		}

		[HttpPost("{id}/match")]
		[ProducesResponseType(200)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> SubmitMatch(int id, MatchRequestModel matchRqModel)
		{
			var user = await userManager.GetUser(User);
			// Admin can't sumbit test
			if (await userManager.IsInRoleAsync(user, Roles.Administrator))
			{
				return Ok();
			}

			if (matchRqModel.SucceededCardIds.Intersect(matchRqModel.FailedCardIds).Count() > 0)
			{
				ModelState.AddModelError("", "At least a card is both succeeded and failed.");
				return BadRequest(ModelState);
			}

			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(user.Id, id)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var newMatch = new Match()
			{
				TotalTime = matchRqModel.TotalTime,
				StartTime = matchRqModel.StartTime.Value,
				EndTime = matchRqModel.EndTime.Value,
				Deck = deck,
				Taker = user,
				MatchedCards = new List<MatchedCard>()
			};
			var cards = await repository.Card
				.QueryByDeckId(id)
				.ToListAsync();
			var succeededCards = FilterCards(cards, matchRqModel.SucceededCardIds);
			var failedCards = FilterCards(cards, matchRqModel.FailedCardIds);

			foreach (var card in succeededCards)
			{
				newMatch.MatchedCards.Add(new MatchedCard()
				{
					Card = card,
					Failed = false
				});
			}
			foreach (var card in failedCards)
			{
				newMatch.MatchedCards.Add(new MatchedCard()
				{
					Card = card,
					Failed = true
				});
			}

			newMatch.Score = (float)succeededCards.Count / (succeededCards.Count + failedCards.Count);

			repository.Match.Create(newMatch);
			await repository.SaveChangesAsync();

			return Ok();
		}

		[HttpGet("{id}/statistics/test")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult> GetTestStatistics(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (deck == null)
			{
				return NotFound();
			}

			var amountTests = 2;
			var dates = DateTimeUtil.GetDaysOfWeek();

			var tests = await repository.Test
				.QueryByDeckIdIncludesTestedCards(userId, deck.Id, dates)
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

		[HttpGet("{id}/statistics/match")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult> GetMatchStatistics(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (deck == null)
			{
				return NotFound();
			}

			var amountMatches = 2;
			var dates = DateTimeUtil.GetDaysOfWeek();

			var matches = await repository.Match
				.QueryByDeckIdIncludesMatchedCards(userId, deck.Id, dates)
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

		// [HttpGet("{id}/statistics")]
		// [ProducesResponseType(200)]
		// [ProducesResponseType(404)]
		// public async Task<ActionResult> GetStatistics(int id)
		// {
		// 	var amountTest = 5;
		// 	var amountMatch = 5;
		// 	var userId = UserUtil.GetUserId(User);
		// 	var deck = await repository.Deck
		// 		.QueryByIdCheckingSharedDeck(userId, id)
		// 		.AsNoTracking()
		// 		.FirstOrDefaultAsync();

		// 	if (deck == null)
		// 	{
		// 		return NotFound();
		// 	}

		// 	var today = DateTime.Now;
		// 	var tests = await repository.Test
		// 		.QueryByDeckIdIncludesTestedCards(userId, id)
		// 		.AsNoTracking()
		// 		.ToListAsync();
		// 	var testsToday = tests.Where(t => t.DateTime.Date == today.Date);
		// 	var matches = await repository.Match
		// 		.QueryByDeckIdIncludesMatchedCards(userId, id)
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

		private List<Card> FilterCards(List<Card> source, int[] cardIds)
		{
			var filteredList = new List<Card>();
			foreach (var card in source)
			{
				if (cardIds.Contains(card.Id))
				{
					filteredList.Add(card);
				}
			}
			return filteredList;
		}
	}
}