using System.Collections.Generic;
using System.IO;
using System.Linq;
using FlashCard.Dto;
using FlashCard.Models;

namespace FlashCard.Util
{
	public static class Mapper
	{
		public static IQueryable<DeckDto> MapToDeckDto(this IQueryable<Deck> query)
		{
			return query.Select(d => new DeckDto()
			{
				Id = d.Id,
				Name = d.Name,
				Description = d.Description,
				Public = d.Public,
				Approved = d.Approved,
				CreatedDate = d.CreatedDate,
				LastModifiedDate = d.LastModifiedDate,
				FromPublic = d.OwnerId != d.AuthorId,
				Owner = new PersonDto()
				{
					Id = d.OwnerId,
					Name = d.Owner.Name,
					Email = d.Owner.Email
				},
				Author = d.AuthorId != null
							? new PersonDto()
							{
								Id = d.AuthorId,
								Name = d.Author.Name,
								Email = d.Author.Email
							}
							: null,
				TotalCards = d.CardAssignments.Count
			});
		}

		public static IQueryable<CardDto> MapToCardDto(this IQueryable<Card> query, string imageBaseUrl)
		{
			return query.Select(c => new CardDto()
			{
				Id = c.Id,
				Front = c.Front,
				Backs = c.Backs.Where(b => !b.Public || b.Approved).Select(b => new BackDto()
				{
					Id = b.Id,
					Type = b.Type,
					Meaning = b.Meaning,
					Example = b.Example,
					ImageUrl = b.Image != null ? Path.Combine(imageBaseUrl, b.Image) : b.Image
				})
			});
		}

		public static IQueryable<BackDto> MapToBackDto(this IQueryable<Back> query, string imageBaseUrl)
		{
			return query.Select(b => new BackDto()
			{
				Id = b.Id,
				Type = b.Type,
				Meaning = b.Meaning,
				Example = b.Example,
				ImageUrl = b.Image != null ? Path.Combine(imageBaseUrl, b.Image) : b.Image
			});
		}

		public static IEnumerable<TestDto> MapToTestDto(this IEnumerable<Test> source)
		{
			return source.Select(t => new TestDto()
			{
				Score = t.Score,
				DateTime = t.DateTime,
				Deck = new DeckWithNameDto()
				{
					Id = t.DeckId,
					Name = t.Deck.Name
				},
				SucceededCards = t.TestedCards.Where(tc => !tc.Failed).Select(tc => tc.Card.Front),
				FailedCards = t.TestedCards.Where(tc => tc.Failed).Select(tc => tc.Card.Front)
			});
		}

		public static IEnumerable<MatchDto> MapToMatchDto(this IEnumerable<Match> source)
		{
			return source.Select(m => new MatchDto()
			{
				Score = m.Score,
				TotalTime = m.TotalTime,
				StartTime = m.StartTime,
				EndTime = m.EndTime,
				Deck = new DeckWithNameDto()
				{
					Id = m.DeckId,
					Name = m.Deck.Name
				},
				SucceededCards = m.MatchedCards.Where(mc => !mc.Failed).Select(mc => mc.Card.Front),
				FailedCards = m.MatchedCards.Where(mc => mc.Failed).Select(mc => mc.Card.Front)
			});
		}
	}
}