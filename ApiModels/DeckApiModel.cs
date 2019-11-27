using System;
using System.Collections.Generic;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class DeckApiModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Public { get; set; }
        public bool Approved { get; set; }
        public bool FromAdmin { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModified { get; set; }
        public CategoryApiModel Category { get; set; }
        public DeckApiModel Source { get; set; }
        public object Owner { get; set; }
        public object Author { get; set; }
        public ICollection<object> Contributors { get; set; }
        public object Statistics { get; set; }
        public int TotalCards { get; set; }
        public ICollection<CardApiModel> Cards { get; set; }

        public DeckApiModel()
        {

        }

        public DeckApiModel(Deck deck)
        {
            Id = deck.Id;
            Name = deck.Name;
            Description = deck.Description;
            CreatedDate = deck.CreatedDate;
            LastModified = deck.LastModified;
            Public = deck.Public;
            Approved = deck.Approved;
            FromAdmin = deck.FromAdmin;
            Category = new CategoryApiModel() { Id = deck.CategoryId, Name = deck.Category.Name };
            Owner = deck.Owner == null ? null : new { Id = deck.OwnerId, DisplayName = deck.Owner.Name };
            Author = deck.Author == null ? null : new { Id = deck.AuthorId, DisplayName = deck.Author.Name };
            TotalCards = deck.CardAssignments == null ? 0 : deck.CardAssignments.Count;
            Source = deck.Source == null ? null : new DeckApiModel(deck.Source);    

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