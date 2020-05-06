namespace FlashCard.Dto
{
	public class UserPublicDeckDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public PersonDto Owner { get; set; }
		public PersonDto Author { get; set; }
		public int TotalCards { get; set; }
	}
}