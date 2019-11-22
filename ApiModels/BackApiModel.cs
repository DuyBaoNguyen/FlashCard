using System;

namespace FlashCard.ApiModels
{
    public class BackApiModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Meaning { get; set; }
        public string Example { get; set; }
        public string Image { get; set; }
        public object Author { get; set; }
    }
}