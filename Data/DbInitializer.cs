using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlashCard.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FlashCard.Data
{
    public class DbInitializer
    {
        public async static Task Initialize(IServiceProvider serviceProvider)
        {
            // Seed user role
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            string[] roles = new string[] { "admin", "user" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Seed users
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            if (userManager.Users.Count() == 0)
            {
                // Seed admin
                var user = new ApplicationUser
                {
                    UserName = "admin@admin.com",
                    Email = "admin@admin.com",
                    Name = "Admin"
                };

                var result = await userManager.CreateAsync(user, "Admin123!");

                if (result.Succeeded)
                {
                    result = await userManager.AddToRoleAsync(user, "admin");
                }

                // Seed users
                for (int i = 1; i <= 3; i++)
                {
                    user = new ApplicationUser
                    {
                        UserName = $"user{i}@user.com",
                        Email = $"user{i}@user.com",
                        Name = $"User {i}"
                    };

                    result = await userManager.CreateAsync(user, "User123!");

                    if (result.Succeeded)
                    {
                        result = await userManager.AddToRoleAsync(user, "user");
                    }
                }
            }

            // Seed data
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            string[] categoryNames = { "General", "Family", "Career", "Personality", "Vehicle", "Furniture", "Animal", "Nature", "Fruit" };

            var categories = new List<Category>();
            if (dbContext.Categories.Count() == 0)
            {
                // Seed categories
                foreach (var name in categoryNames)
                {
                    var category = new Category() { Name = name };
                    dbContext.Categories.Add(category);
                    categories.Add(category);
                }

                dbContext.SaveChanges();

                // Seed decks
                // var users = await userManager.Users.Where(u => !u.Email.Contains("@gmail.com")).ToListAsync();
                var rd = new Random();
                var decks = new List<Deck>();

                foreach (var user in userManager.Users)
                {
                    for (int i = 1; i <= 4; i++)
                    {
                        string name = categoryNames[rd.Next(i * 2 - 1, i * 2 + 1)];
                        var deck = new Deck()
                        {
                            Name = name,
                            Description = "Some text here",
                            CreatedDate = DateTime.Now,
                            LastModified = DateTime.Now,
                            CategoryId = categories.Single(c => c.Name == name).Id,
                            Owner = user,
                            Author = user
                        };
                        dbContext.Decks.Add(deck);
                        decks.Add(deck);
                    }
                }

                dbContext.SaveChanges();

                // Seed card
                var cardDictionary = new Dictionary<string, Card[]>();

                var familyCards = new Card[]
                {
                    new Card() { Front = "father" },
                    new Card() { Front = "mother" },
                    new Card() { Front = "son" },
                    new Card() { Front = "daughter" },
                    new Card() { Front = "parent" },
                    new Card() { Front = "child" },
                    new Card() { Front = "children" },
                    new Card() { Front = "husband" },
                    new Card() { Front = "wife" },
                    new Card() { Front = "brother" },
                    new Card() { Front = "sister" },
                    new Card() { Front = "uncle" },
                    new Card() { Front = "aunt" },
                    new Card() { Front = "nephew" },
                    new Card() { Front = "niece" },
                    new Card() { Front = "grandmother" },
                    new Card() { Front = "grandfather" },
                    new Card() { Front = "grandparents" },
                    new Card() { Front = "grandson" },
                    new Card() { Front = "granddaughter" },
                    new Card() { Front = "grandchild" },
                    new Card() { Front = "cousin" }
                };

                cardDictionary.Add("Family", familyCards);

                var careerCards = new Card[]
                {
                    new Card() { Front = "doctor" },
                    new Card() { Front = "dentist" },
                    new Card() { Front = "cashier" },
                    new Card() { Front = "builder" },
                    new Card() { Front = "reporter" },
                    new Card() { Front = "tailor" },
                    new Card() { Front = "teacher" },
                    new Card() { Front = "cook" },
                    new Card() { Front = "magician" },
                    new Card() { Front = "baker" },
                    new Card() { Front = "singer" },
                    new Card() { Front = "artist" },
                    new Card() { Front = "waiter" },
                    new Card() { Front = "carpenter" },
                    new Card() { Front = "actor" },
                    new Card() { Front = "nurse" },
                    new Card() { Front = "secretary" },
                    new Card() { Front = "gardener" },
                    new Card() { Front = "vet" },
                    new Card() { Front = "businessman" },
                    new Card() { Front = "policeman" },
                    new Card() { Front = "painter" },
                    new Card() { Front = "hairdresser" },
                    new Card() { Front = "dancer" },
                    new Card() { Front = "farmer" }
                };

                cardDictionary.Add("Career", careerCards);

                var personalityCards = new Card[]
                {
                    new Card() { Front = "ambitious" },
                    new Card() { Front = "individualistic" },
                    new Card() { Front = "emotional" },
                    new Card() { Front = "careless" },
                    new Card() { Front = "likeable" },
                    new Card() { Front = "shy" },
                    new Card() { Front = "chatty" },
                    new Card() { Front = "moody" },
                    new Card() { Front = "tolerant" },
                    new Card() { Front = "cheerful" },
                    new Card() { Front = "outgoing" },
                    new Card() { Front = "romantic" },
                    new Card() { Front = "childish" },
                    new Card() { Front = "popular" },
                    new Card() { Front = "sociable" },
                    new Card() { Front = "competitive" },
                    new Card() { Front = "reckless" },
                    new Card() { Front = "polite" },
                    new Card() { Front = "considerate" },
                    new Card() { Front = "reliable" },
                    new Card() { Front = "logical" },
                    new Card() { Front = "easy-going" },
                    new Card() { Front = "reserved" },
                    new Card() { Front = "liberal" },
                    new Card() { Front = "hard-working" },
                    new Card() { Front = "romantic" },
                    new Card() { Front = "independent" },
                    new Card() { Front = "idealistic" },
                    new Card() { Front = "selfish" },
                    new Card() { Front = "creative" },
                    new Card() { Front = "impatient" },
                    new Card() { Front = "sensible" },
                    new Card() { Front = "decisive" },
                    new Card() { Front = "kind" },
                    new Card() { Front = "sensitive" },
                    new Card() { Front = "vain" }
                };

                cardDictionary.Add("Personality", personalityCards);

                var vehicleCards = new Card[]
                {
                    new Card() { Front = "car" },
                    new Card() { Front = "truck" },
                    new Card() { Front = "bus" },
                    new Card() { Front = "bicycle" },
                    new Card() { Front = "scooter" },
                    new Card() { Front = "motorbike" },
                    new Card() { Front = "train" },
                    new Card() { Front = "subway" },
                    new Card() { Front = "jet" },
                    new Card() { Front = "horse" },
                    new Card() { Front = "ship" },
                    new Card() { Front = "cruise ship" },
                    new Card() { Front = "cargo ship" },
                    new Card() { Front = "submarine" },
                    new Card() { Front = "donkey" },
                    new Card() { Front = "helicopter" },
                    new Card() { Front = "rocket" },
                    new Card() { Front = "camel" },
                    new Card() { Front = "hot-air balloon" },
                    new Card() { Front = "sailboat" },
                    new Card() { Front = "plane" },
                    new Card() { Front = "propeller plane" }
                };

                cardDictionary.Add("Vehicle", vehicleCards);

                var furnitureCards = new Card[]
                {
                    new Card() { Front = "bed" },
                    new Card() { Front = "chest" },
                    new Card() { Front = "curtain" },
                    new Card() { Front = "drawer" },
                    new Card() { Front = "stool" },
                    new Card() { Front = "bookcase" },
                    new Card() { Front = "shelf" },
                    new Card() { Front = "table" },
                    new Card() { Front = "chair" },
                    new Card() { Front = "carpet" },
                    new Card() { Front = "cupboard" },
                    new Card() { Front = "wardrobe" },
                    new Card() { Front = "chest of drawers" },
                    new Card() { Front = "furniture" },
                    new Card() { Front = "desk" },
                    new Card() { Front = "sink" },
                    new Card() { Front = "lamp" },
                    new Card() { Front = "bookshelf" },
                    new Card() { Front = "sofa" },
                    new Card() { Front = "bench" },
                    new Card() { Front = "armchair" },
                    new Card() { Front = "chandelier" },
                    new Card() { Front = "rocking chair" },
                    new Card() { Front = "file" }
                };

                cardDictionary.Add("Furniture", furnitureCards);

                var animalCards = new Card[]
                {
                    new Card() { Front = "dog" },
                    new Card() { Front = "cat" },
                    new Card() { Front = "animal" },
                    new Card() { Front = "bear" },
                    new Card() { Front = "chimpanzee" },
                    new Card() { Front = "elephant" },
                    new Card() { Front = "fox" },
                    new Card() { Front = "giraffe" },
                    new Card() { Front = "hippopotamus" },
                    new Card() { Front = "jaguar" },
                    new Card() { Front = "lion" },
                    new Card() { Front = "porcupine" },
                    new Card() { Front = "raccoon" },
                    new Card() { Front = "rhinoceros" },
                    new Card() { Front = "squirrel" },
                    new Card() { Front = "alligator" },
                    new Card() { Front = "bat" },
                    new Card() { Front = "deer" },
                    new Card() { Front = "wolf" },
                    new Card() { Front = "beaver" },
                    new Card() { Front = "chipmunk" }
                };

                cardDictionary.Add("Animal", animalCards);

                var natureCards = new Card[]
                {
                    new Card() { Front = "meadow" },
                    new Card() { Front = "jungle" },
                    new Card() { Front = "forest" },
                    new Card() { Front = "rainforest" },
                    new Card() { Front = "mountain" },
                    new Card() { Front = "canyon" },
                    new Card() { Front = "brink" },
                    new Card() { Front = "hill" },
                    new Card() { Front = "liff" },
                    new Card() { Front = "rock" },
                    new Card() { Front = "valley" },
                    new Card() { Front = "dune" },
                    new Card() { Front = "desert" },
                    new Card() { Front = "volcano" },
                    new Card() { Front = "land" },
                    new Card() { Front = "ground" },
                    new Card() { Front = "soil" },
                    new Card() { Front = "plain" },
                    new Card() { Front = "ocean" },
                    new Card() { Front = "sea" },
                    new Card() { Front = "beach" },
                    new Card() { Front = "coast" },
                    new Card() { Front = "shore" },
                    new Card() { Front = "island" },
                    new Card() { Front = "lake" }
                };

                cardDictionary.Add("Nature", natureCards);

                var fruitCards = new Card[]
                {
                    new Card() { Front = "apple" },
                    new Card() { Front = "green apple" },
                    new Card() { Front = "black grape" },
                    new Card() { Front = "banana" },
                    new Card() { Front = "pear" },
                    new Card() { Front = "pomegranate" },
                    new Card() { Front = "orange" },
                    new Card() { Front = "white grape" },
                    new Card() { Front = "strawberry" },
                    new Card() { Front = "pineapple" },
                    new Card() { Front = "peach" },
                    new Card() { Front = "dragon fruit" },
                    new Card() { Front = "starfruit" },
                    new Card() { Front = "passion fruit" },
                    new Card() { Front = "jackfruit" },
                    new Card() { Front = "guava" },
                    new Card() { Front = "date" },
                    new Card() { Front = "mango" },
                    new Card() { Front = "coconut" },
                    new Card() { Front = "lychee" },
                    new Card() { Front = "longan" },
                    new Card() { Front = "durian" },
                    new Card() { Front = "tangerine" }
                };

                cardDictionary.Add("Fruit", fruitCards);

                foreach (var cards in cardDictionary.Values)
                {
                    dbContext.Cards.AddRange(cards);
                }

                dbContext.SaveChanges();

                // Seed CardAssigments
                foreach (var user in userManager.Users)
                {
                    var userDecks = decks.Where(d => d.OwnerId == user.Id);

                    foreach (var deck in userDecks)
                    {
                        var cards = cardDictionary[deck.Category.Name];

                        foreach (var card in cards)
                        {
                            dbContext.CardOwners.Add(new CardOwner
                            {
                                CardId = card.Id,
                                UserId = user.Id
                            });
                        }

                        foreach (var card in cards)
                        {
                            dbContext.CardAssignments.Add(new CardAssignment
                            {
                                CardId = card.Id,
                                DeckId = deck.Id
                            });
                        }
                    }
                }

                dbContext.SaveChanges();
            }
        }
    }
}