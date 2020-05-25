using System;

namespace FlashCard.Dto
{
	public class DeckDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Theme { get; set; }
		public bool FromPublic { get; set; }
		public bool Public { get; set; }
		public bool Approved { get; set; }
		public DateTime CreatedDate { get; set; }
		public DateTime LastModifiedDate { get; set; }
		public string LastTestedTime { get; set; }
		public PersonDto Owner { get; set; }
		public PersonDto Author { get; set; }
		public int TotalCards { get; set; }
	}
}