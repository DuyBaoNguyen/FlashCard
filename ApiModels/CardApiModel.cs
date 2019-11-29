using System.Collections.Generic;
using System.Linq;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class CardApiModel
    {
        public int Id { get; set; }
        public string Front { get; set; }
        public ICollection<BackApiModel> Backs { get; set; }

        public CardApiModel()
        {

        }

        public CardApiModel(Card card)
        {
            Id = card.Id;
            Front = card.Front;
            Backs = new List<BackApiModel>();
        }
    }
}