using System.Collections.Generic;

namespace FlashCard.ApiModels
{
    public class CardApiModel
    {
        public int Id { get; set; }
        public string Front { get; set; }
        public ICollection<BackApiModel> Backs { get; set; }
    }
}