using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlashCard.Models;
using FlashCard.Services;
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
            string[] roles = new string[] { Roles.Administrator, Roles.User };

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
                    result = await userManager.AddToRoleAsync(user, Roles.Administrator);
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
                        result = await userManager.AddToRoleAsync(user, Roles.User);
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

                // Seed CardAssigments and CardOwner
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

                // Seed Backs
                foreach (var user in userManager.Users)
                {
                    var userDecks = decks.Where(d => d.OwnerId == user.Id);
                    
                    foreach (var deck in userDecks)
                    {
                        var cards = cardDictionary[deck.Category.Name];
                        var backs = getBacks(deck.Category.Name);

                        for (int i = 0; i < cards.Length; i++)
                        {
                            var back = backs[i];

                            back.LastModified = DateTime.Now;
                            back.CardId = cards[i].Id;
                            back.OwnerId = user.Id;
                            back.AuthorId = user.Id;
                        }

                        dbContext.Backs.AddRange(backs);
                    }
                }

                dbContext.SaveChanges();

                // Remove cards having no back
                foreach (var cards in cardDictionary.Values)
                {
                    foreach (var card in cards)
                    {
                        if (card.Backs.Count == 0)
                        {
                            dbContext.Cards.Remove(card);
                        }
                    }
                }

                dbContext.SaveChanges();
            }
        }

        private static Back[] getBacks(string category)
        {
            switch (category)
            {
                case "Family":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "cha", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "mẹ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con trai", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con gái", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cha mẹ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đứa trẻ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "những đứa trẻ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "chồng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "vợ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "anh, em trai", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "chị, em gái", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "chú, cậu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cô, gì", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cháu trai", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cháu gái", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bà", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ông", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ông bà", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cháu trai", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cháu gái", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cháu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "anh chị em họ", Example = "This is an example" }
                    };
                case "Career":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "bác sĩ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "nha sĩ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thu ngân", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thợ xây dựng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "phóng viên", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thợ may", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "giáo viên", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đầu bếp", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ảo thuật gia", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thợ làm bánh", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ca sĩ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "họa sĩ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bồi bàn", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thợ mộc", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "diễn viên", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "y tá", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thư kí", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "người làm vườn", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bác sĩ thú y", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "doanh nhân", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cảnh sát", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thợ sơn nhà", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thợ cắt tóc", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "vũ công", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "nông dân", Example = "This is an example" }
                    };
                case "Personality":
                    return new Back[]
                    {
                        new Back() { Type = "adjective", Meaning = "nhiều hoài bão", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "theo chủ nghĩa cá nhân", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "dễ xúc động", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "bất cẩn", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "dễ thương, đáng yêu", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "nhút nhát, rụt rè", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "hay chuyện trò", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "tính khí thất thường", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "khoan dung", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "vui vẻ", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "thân mật, thoải mái", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "lãng mạn", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "ngây ngô", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "được lòng người khác", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "gần gũi, hòa đồng", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "thích cạnh tranh, ganh đua", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "thiếu thận trọng, hấp tấp", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "lịch sự", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "chu đáo", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "đáng tin cậy", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "hợp lí, suy nghĩ có logic", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "dễ gần", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "dè dặt, kín đáo", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "khoan hồng, rộng lòng; rộng rãi, hào phóng", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "chăm chỉ", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "độc lập", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "(người) luôn hướng đến những chuẩn mực hoàn hảo, nhưng đôi lúc thiếu thực tế", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "ích kỉ", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "sáng tạo", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "không kiên nhẫn", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "khôn ngoan, có óc phán đoán", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "quả quyết", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "tốt bụng", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "nhạy cảm", Example = "This is an example" },
                        new Back() { Type = "adjective", Meaning = "kiêu ngạo, tự phụ", Example = "This is an example" }
                    };
                case "Vehicle":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "xe hơi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "xe tải", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "xe buýt", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "xe đạp", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "xe tay ga", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "xe máy", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "xe lửa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tàu điện ngầm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "máy bay phản lực", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ngựa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tàu, thuyền", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tàu du lịch", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tàu chở hàng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tàu cánh ngầm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "lừa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "máy bay trực thăng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tên lửa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "lạc đà", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "khinh khí cầu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thuyền buồm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "máy bay", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "máy bay xài động cơ cánh quạt", Example = "This is an example" }
                    };
                case "Furniture":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "giường", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "rương, hòm, tủ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "rèm, màn", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ngăn kéo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ghế đẩu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tủ sách", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "kệ, ngăn, giá", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bàn", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ghế", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tấm thảm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bộ giá đỡ có một hoặc nhiều cửa ở phía mặt (hoặc xây chìm vào tường)", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tủ quần áo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "tủ ngăn kéo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đồ đạc (trong nhà)", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bàn viết; bàn làm việc", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bệ rửa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đèn bàn", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "giá sách", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ghế sofa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ghế băng dài", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ghế bành", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đèn chùm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ghế bập bênh, ghế chao", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "ô đựng tài liệu, hồ sơ", Example = "This is an example" }
                    };
                case "Animal":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "con chó", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con mèo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "động vật", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con gấu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con hắc tinh tinh", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con voi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con cáo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con hươu cao cổ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con hà mã", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con báo đốm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con sư tử", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con nhím", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con gấu mèo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con tê giác", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con sóc", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con cá sấu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con dơi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con hươu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con chó sói", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con hải ly", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "con sóc chuột", Example = "This is an example" }
                    };
                case "Nature":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "đồng cỏ", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "rừng nhiệt đới", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "rừng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "rừng mưa nhiệt đới", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "núi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "hẻm núi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bờ vực", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đồi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "vách đá", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đá", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "thung lũng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "cồn cát", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "sa mạc", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "núi lửa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đất liền", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "mặt đất", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đất trồng trọt", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đồng bằng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đại dương", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "biển", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bãi biển", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "vùng đất sát biển", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "bờ biển", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "đảo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "hồ", Example = "This is an example" }
                    };
                case "Fruit":
                    return new Back[]
                    {
                        new Back() { Type = "noun", Meaning = "trái táo", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái táo xanh", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái nho tím", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái chuối", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái lê", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái lựu", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái cam", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái nho xanh", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái dâu tây", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái thơm", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái đào", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái thanh long", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái khế", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái chanh dây", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái mít", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái ổi", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái chà là", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái xoài", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái dừa", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái vải", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái nhãn", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái sầu riêng", Example = "This is an example" },
                        new Back() { Type = "noun", Meaning = "trái quýt", Example = "This is an example" }
                    };
                default:
                    return null;
            }
        }
    }
}