using System.Collections.Generic;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class ProposedCardApiModel
    {
        public int Id { get; set; }
        public string Front { get; set; }
        public ICollection<ProposedBackApiModel> Backs { get; set; }

        public ProposedCardApiModel()
        {

        }

        public ProposedCardApiModel(Card card)
        {
            Id = card.Id;
            Front = card.Front;
            Backs = new List<ProposedBackApiModel>();
        }
    }
}