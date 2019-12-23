using System;
using System.Collections.Generic;
using System.Linq;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class TestApiModel
    {
        public object Deck { get; set; }
        public float Score { get; set; }
        public DateTime Datetime { get; set; }
        public string[] FailedCards { get; set; }

        public TestApiModel(Test test)
        {
            Deck = new { Id = test.DeckId, Name = test.Deck.Name };
            Score = test.Score;
            Datetime = test.DateTime;

            var failedTestedCards = test.TestedCards.Where(tc => tc.Failed);
            FailedCards = new string[failedTestedCards.Count()];

            int i = 0;

            foreach (var testedCard in failedTestedCards)
            {
                FailedCards[i++] = testedCard.Card.Front;
            }
        }
    }
}