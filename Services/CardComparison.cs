using System;
using FlashCard.ApiModels;

namespace FlashCard.Services
{
    public class CardComparison
    {
        public static int CompareByFront(CardApiModel card1, CardApiModel card2)
        {
            return String.Compare(card1.Front, card2.Front);
        }
    }
}