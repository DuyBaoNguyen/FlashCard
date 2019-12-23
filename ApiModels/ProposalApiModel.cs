using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class ProposalApiModel
    {
        public int Id { get; set; }
        public CardApiModel Card { get; set; }
        public object User { get; set; }

        public ProposalApiModel()
        {

        }

        public ProposalApiModel(Proposal proposal)
        {
            Id = proposal.Id;
            Card = new CardApiModel(proposal.Card);
            User = new { Id = proposal.UserId, Name = proposal.User.Name };
        }
    }
}