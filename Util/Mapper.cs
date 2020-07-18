using System.Collections.Generic;
using System.IO;
using System.Linq;
using FlashCard.Dto;
using FlashCard.Models;

namespace FlashCard.Util
{
    public static class Mapper
	{
		public static IQueryable<DeckDto> MapToDeckDto(this IQueryable<Deck> query, string pictureBaseUrl,
			string takerId = null)
		{
			return query.Select(d => new DeckDto()
			{
				Id = d.Id,
				Name = d.Name,
				Description = d.Description,
				Theme = d.Theme,
				Public = d.Public,
				Approved = d.Approved,
				Completed = d.Completed,
				CreatedDate = d.CreatedDate,
				LastModifiedDate = d.LastModifiedDate,
				LastTestedTime = d.Tests
					.OrderByDescending(d => d.DateTime)
					.FirstOrDefault(t => takerId != null ? t.TakerId == takerId : t.TakerId == d.OwnerId).DateTime
					.ToString(),
				FromPublic = d.OwnerId != d.AuthorId,
				Owner = new PersonDto()
				{
					Id = d.OwnerId,
					Name = d.Owner.Name,
					Email = d.Owner.Email,
					PictureUrl = d.Owner.Picture != null ? Path.Combine(pictureBaseUrl, d.Owner.Picture) : null
				},
				Author = d.AuthorId != null
					? new PersonDto()
					{
						Id = d.AuthorId,
						Name = d.Author.Name,
						Email = d.Author.Email,
						PictureUrl = d.Author.Picture != null ? Path.Combine(pictureBaseUrl, d.Author.Picture) : null
					}
					: null,
				TotalCards = d.CardAssignments.Count,
				TotalSucceededCards = d.CardAssignments.Count(ca => ca.Card.Remembered),
				TotalFailedCards = d.CardAssignments.Count(ca => !ca.Card.Remembered)
			});
		}

		public static IQueryable<PublicDeckDto> MapToPublicDeckDto(this IQueryable<Deck> query, string userId,
			string pictureBaseUrl)
		{
			return query.Select(d => new PublicDeckDto()
			{
				Id = d.Id,
				Name = d.Name,
				Description = d.Description,
				Theme = d.Theme,
				Pinned = d.SharedDecks.FirstOrDefault(s => s.UserId == userId).Pinned,
				CreatedDate = d.CreatedDate,
				Owner = new PersonDto()
				{
					Id = d.OwnerId,
					Name = d.Owner.Name,
					Email = d.Owner.Email,
					PictureUrl = d.Owner.Picture != null ? Path.Combine(pictureBaseUrl, d.Owner.Picture) : null
				},
				Author = d.AuthorId != null
					? new PersonDto()
					{
						Id = d.AuthorId,
						Name = d.Author.Name,
						Email = d.Author.Email,
						PictureUrl = d.Author.Picture != null ? Path.Combine(pictureBaseUrl, d.Author.Picture) : null
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
				Remembered = c.Remembered,
				FromPublic = c.OwnerId != c.AuthorId,
				Backs = c.Backs.Where(b => !b.Public || b.Approved).Select(b => new BackDto()
				{
					Id = b.Id,
					Type = b.Type,
					Meaning = b.Meaning,
					Example = b.Example,
					ImageUrl = b.Image != null ? Path.Combine(imageBaseUrl, b.Image) : b.Image,
					FromPublic = c.OwnerId != b.AuthorId
				})
			});
		}

		public static IQueryable<ProposedCardDto> MapToProposedCardDto(this IQueryable<Card> query,
			string imageBaseUrl, string pictureBaseUrl)
		{
			return query.Select(c => new ProposedCardDto()
			{
				Id = c.Id,
				Front = c.Front,
				Backs = c.Backs.Where(b => !b.Public || !b.Approved).Select(b => new ProposedBackDto()
				{
					Id = b.Id,
					Type = b.Type,
					Meaning = b.Meaning,
					Example = b.Example,
					ImageUrl = b.Image != null ? Path.Combine(imageBaseUrl, b.Image) : b.Image,
					Approved = b.Approved,
					Author = new PersonDto()
					{
						Id = b.AuthorId,
						Name = b.Author.Name,
						Email = b.Author.Email,
						PictureUrl = b.Author.Picture != null ? Path.Combine(pictureBaseUrl, b.Author.Picture) : null
					}
				})
			});
		}

		public static IQueryable<ProposedCardDto> MapToProposedCardDto(this IQueryable<Card> query, string userId,
			string imageBaseUrl, string pictureBaseUrl)
		{
			return query.Select(c => new ProposedCardDto()
			{
				Id = c.Id,
				Front = c.Front,
				Backs = c.Backs.Where(b => b.AuthorId == userId).Select(b => new ProposedBackDto()
				{
					Id = b.Id,
					Type = b.Type,
					Meaning = b.Meaning,
					Example = b.Example,
					ImageUrl = b.Image != null ? Path.Combine(imageBaseUrl, b.Image) : b.Image,
					Approved = b.Approved,
					Author = new PersonDto()
					{
						Id = b.AuthorId,
						Name = b.Author.Name,
						Email = b.Author.Email,
						PictureUrl = b.Author.Picture != null ? Path.Combine(pictureBaseUrl, b.Author.Picture) : null
					}
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

		public static IQueryable<ProposedBackDto> MapToProposedBackDto(this IQueryable<Back> query, string imageBaseUrl)
		{
			return query.Select(b => new ProposedBackDto()
			{
				Id = b.Id,
				Type = b.Type,
				Meaning = b.Meaning,
				Example = b.Example,
				ImageUrl = b.Image != null ? Path.Combine(imageBaseUrl, b.Image) : b.Image,
				Approved = b.Approved
			});
		}

		public static IQueryable<DeckWithSourceIdDto> MapToDeckWithSourceId(this IQueryable<Deck> query)
		{
			return query.Select(d => new DeckWithSourceIdDto()
			{
				Id = d.Id,
				SourceId = d.SourceId
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

		public static IQueryable<UserDto> MapToUserDto(this IQueryable<ApplicationUser> query, string pictureBaseUrl)
		{
			return query.Select(u => new UserDto()
			{
				Id = u.Id,
				Name = u.Name,
				Email = u.Email,
				PictureUrl = u.Picture != null ? Path.Combine(pictureBaseUrl, u.Picture) : null
			});
		}
	}
}