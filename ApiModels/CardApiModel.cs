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

        public CardApiModel(Card card, ApplicationUser user)
        {
            Id = card.Id;
            Front = card.Front;

            var backs = card.Backs.Where(b => b.OwnerId == user.Id);
            var backmodels = new List<BackApiModel>();

            foreach (var back in backs)
            {
                backmodels.Add(new BackApiModel(back));
            }
            
            Backs = backmodels;
        }
    }
}