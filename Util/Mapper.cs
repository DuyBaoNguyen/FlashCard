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
				LastModified = d.LastModifiedDate,
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
				Backs = c.Backs.Select(b => new BackDto()
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
	}
}