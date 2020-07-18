namespace FlashCard.Dto
{
	public class PublicDeckDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Theme { get; set; }
		public int? LocalDeckId { get; set; }
		public bool Pinned { get; set; }
		public PersonDto Owner { get; set; }
		public PersonDto Author { get; set; }
		public int TotalCards { get; set; }
	}
}