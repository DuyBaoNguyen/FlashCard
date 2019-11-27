using System;
using System.Collections.Generic;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class PublicDeckApiModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public CategoryApiModel Category { get; set; }
        public object Author { get; set; }
        public ICollection<object> Contributors { get; set; }
        public int TotalCards { get; set; }
        public ICollection<CardApiModel> Cards { get; set; }

        public PublicDeckApiModel()
        {

        }

        public PublicDeckApiModel(Deck deck)
        {
            Id = deck.Id;
            Name = deck.Name;
            Description = deck.Description;
            Category = new CategoryApiModel() { Id = deck.CategoryId, Name = deck.Category.Name };
            Author = deck.Author == null ? null : new { Id = deck.AuthorId, DisplayName = deck.Author.Name };
            TotalCards = deck.CardAssignments.Count;

            if (deck.Proposals != null)
            {
                var contributors = new List<object>();

                foreach (var proposal in deck.Proposals)
                {
                    if (proposal.Approved)
                    {
                        contributors.Add(new { Id = proposal.UserId, DisplayName = proposal.User.Name });
                    }
                }

                Contributors = contributors;
            }
        }
    }
}