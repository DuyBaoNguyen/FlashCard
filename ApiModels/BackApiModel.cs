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
        public bool Public { get; set; }
        public DateTime LastModified { get; set; }
        public bool Approved { get; set; }
        public int Version { get; set; }
        public BackApiModel Source { get; set; }
        public string Owner { get; set; }
        public string Author { get; set; }
    }
}