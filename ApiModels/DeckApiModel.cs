using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class DeckApiModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Public { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModified { get; set; }
        public bool Approved { get; set; }
        public int Version { get; set; }
        public CategoryApiModel Category { get; set; }
        public DeckApiModel Source { get; set; }
        public string Owner { get; set; }
        public string Author { get; set; }
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
            Version = deck.Version;
            Category = new CategoryApiModel() { Id = deck.CategoryId, Name = deck.Category.Name };
            Owner = deck.Owner.Name;
            Author = deck.Author.Name;
            TotalCards = deck.CardAssignments == null ? 0 : deck.CardAssignments.Count;
        }
    }
}