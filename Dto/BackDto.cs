namespace FlashCard.Dto
{
	public class BackDto
	{
		public int Id { get; set; }
		public string Type { get; set; }
		public string Meaning { get; set; }
		public string Example { get; set; }
		public string ImageUrl { get; set; }
		public bool FromPublic { get; set; }
	}
}