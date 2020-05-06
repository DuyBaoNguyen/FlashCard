using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlashCard.Data;
using FlashCard.Models;
using FlashCard.Util;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlashCard.Controllers
{
	public class SeedDataController : ControllerBase
	{
		private readonly ApplicationDbContext dbContext;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly RoleManager<IdentityRole> roleManager;

		public SeedDataController(ApplicationDbContext dbContext,
			UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
		{
			this.dbContext = dbContext;
			this.userManager = userManager;
			this.roleManager = roleManager;
		}

		[HttpPost("api/seeddata")]
		public async Task<IActionResult> SeedData()
		{
			// Seed user role
			string[] roles = new string[] { Roles.Administrator, Roles.User };

			foreach (var role in roles)
			{
				if (!await roleManager.RoleExistsAsync(role))
				{
					await roleManager.CreateAsync(new IdentityRole(role));
				}
			}

			// Seed users
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
			string[] categoryNames = { "General", "Family", "Career", "Personality", "Vehicle", "Furniture", "Animal", "Nature", "Fruit" };

			if (dbContext.Decks.Count() == 0)
			{
				// Seed decks
				var users = dbContext.Users.ToList();
				var rd = new Random();
				var decks = new List<Deck>();

				foreach (var user in users)
				{
					var userIsAdmin = user.Name == "Admin";

					for (int i = 1; i <= 5; i++)
					{
						string name = "General";
						if (i < 5)
						{
							name = categoryNames[rd.Next(i * 2 - 1, i * 2 + 1)];
						}

						var deck = new Deck()
						{
							Name = name,
							Description = "Some text here",
							CreatedDate = DateTime.Now,
							LastModifiedDate = DateTime.Now,
							Public = userIsAdmin,
							Approved = userIsAdmin,
							Owner = user,
							Author = user
						};
						dbContext.Decks.Add(deck);
						decks.Add(deck);
					}
				}

				await dbContext.SaveChangesAsync();

				// Seed Cards, Backs and CardAssigments
				foreach (var user in users)
				{
					var userDecks = decks.Where(d => d.OwnerId == user.Id);
					var userIsAdmin = user.Name == "Admin";

					foreach (var deck in userDecks)
					{
						var cards = getCards(deck.Name);
						var backs = getBacks(deck.Name);
						var now = DateTime.Now;

						for (int i = 0; i < cards.Length; i++)
						{
							var card = cards[i];
							card.CreatedDate = now;
							card.LastModifiedDate = now;
							card.Public = userIsAdmin;
							card.Approved = userIsAdmin;
							card.Owner = user;
							card.Author = user;
							card.CardAssignments = new List<CardAssignment>() { new CardAssignment() { Deck = deck } };
							card.Backs = new List<Back>();

							var back = backs[i];
							back.CreatedDate = now;
							back.LastModifiedDate = now;
							back.Public = userIsAdmin;
							back.Approved = userIsAdmin;
							back.Author = user;

							card.Backs.Add(back);
							dbContext.Cards.Add(card);
						}
					}
				}
				await dbContext.SaveChangesAsync();
			}

			return Ok();
		}

		private static Card[] getCards(string category)
		{
			switch (category)
			{
				case "Family":
					return new Card[]
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
				case "Career":
					return new Card[]
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
				case "Personality":
					return new Card[]
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
				case "Vehicle":
					return new Card[]
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
				case "Furniture":
					return new Card[]
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
				case "Animal":
					return new Card[]
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
				case "Nature":
					return new Card[]
					{
						new Card() { Front = "meadow" },
						new Card() { Front = "jungle" },
						new Card() { Front = "forest" },
						new Card() { Front = "rainforest" },
						new Card() { Front = "mountain" },
						new Card() { Front = "canyon" },
						new Card() { Front = "brink" },
						new Card() { Front = "hill" },
						new Card() { Front = "cliff" },
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
				case "Fruit":
					return new Card[]
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
				case "General":
					return new Card[]
					{
						new Card() { Front = "march" },
						new Card() { Front = "walk" },
						new Card() { Front = "run" },
						new Card() { Front = "crawl" },
						new Card() { Front = "tiptoe" },
						new Card() { Front = "drag" },
						new Card() { Front = "push" },
						new Card() { Front = "jump" },
						new Card() { Front = "leap" },
						new Card() { Front = "hop" },
						new Card() { Front = "skip" },
						new Card() { Front = "crouch" },
						new Card() { Front = "hit" },
						new Card() { Front = "stretch" },
						new Card() { Front = "lift" },
						new Card() { Front = "dive" },
						new Card() { Front = "lean" },
						new Card() { Front = "sit" },
						new Card() { Front = "squat" },
						new Card() { Front = "bend" },
						new Card() { Front = "pick up" },
						new Card() { Front = "hold" },
						new Card() { Front = "carry" },
						new Card() { Front = "slap" },
						new Card() { Front = "punch" },
						new Card() { Front = "kick" },
						new Card() { Front = "catch" },
						new Card() { Front = "throw" },
						new Card() { Front = "pull" },
						new Card() { Front = "hot" },
						new Card() { Front = "cold" },
						new Card() { Front = "hungry" },
						new Card() { Front = "frustrated" },
						new Card() { Front = "furious" },
						new Card() { Front = "angry" },
						new Card() { Front = "disgusted" },
						new Card() { Front = "surprised" },
						new Card() { Front = "sad" },
						new Card() { Front = "bored" },
						new Card() { Front = "scared" },
						new Card() { Front = "sleepy" },
						new Card() { Front = "exhausted" },
						new Card() { Front = "in love" },
						new Card() { Front = "happy" },
						new Card() { Front = "go" },
						new Card() { Front = "type" },
						new Card() { Front = "drink" },
						new Card() { Front = "eat" },
						new Card() { Front = "write" },
						new Card() { Front = "delete" },
						new Card() { Front = "remove" },
						new Card() { Front = "add" },
						new Card() { Front = "edit" },
						new Card() { Front = "read" },
					};
				default:
					return null;
			}
		}

		private static Back[] getBacks(string category)
		{
			switch (category)
			{
				case "Family":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "cha", Example = "They assumed that I was the father of the child" },
						new Back() { Type = "noun", Meaning = "mẹ", Example = "she returned to Bristol to nurse her aging mother" },
						new Back() { Type = "noun", Meaning = "con trai", Example = "The sons of Adam" },
						new Back() { Type = "noun", Meaning = "con gái", Example = "We are the sons and daughters of Adam" },
						new Back() { Type = "noun", Meaning = "cha mẹ", Example = "His adoptive parents" },
						new Back() { Type = "noun", Meaning = "đứa trẻ", Example = "She'd been playing tennis since she was a child" },
						new Back() { Type = "noun", Meaning = "những đứa trẻ", Example = "When children leave home, parents can feel somewhat redundant" },
						new Back() { Type = "noun", Meaning = "chồng", Example = "She and her husband are both retired" },
						new Back() { Type = "noun", Meaning = "vợ", Example = "A faculty wife" },
						new Back() { Type = "noun", Meaning = "anh, em trai", Example = "He recognized her from her strong resemblance to her brother" },
						new Back() { Type = "noun", Meaning = "chị, em gái", Example = "I had nine brothers and sisters" },
						new Back() { Type = "noun", Meaning = "chú, cậu", Example = "He visited his uncle" },
						new Back() { Type = "noun", Meaning = "cô, gì", Example = "She was brought up by her aunt and uncle" },
						new Back() { Type = "noun", Meaning = "cháu trai", Example = "He is survived by his brother, sisters, nephews, nieces and by other relations" },
						new Back() { Type = "noun", Meaning = "cháu gái", Example = "He is survived by his brother, sisters, nephews, nieces and by other relations" },
						new Back() { Type = "noun", Meaning = "bà", Example = "My grandmother is ill" },
						new Back() { Type = "noun", Meaning = "ông", Example = "my grandfather is ill" },
						new Back() { Type = "noun", Meaning = "ông bà", Example = "It must be a great blessing to have Chloe's grandparents living nearby" },
						new Back() { Type = "noun", Meaning = "cháu trai", Example = "He and Anne helped their daughter Emma bring up their grandson" },
						new Back() { Type = "noun", Meaning = "cháu gái", Example = "He and Anne helped their daughter Emma bring up their granddaughter" },
						new Back() { Type = "noun", Meaning = "cháu", Example = "He and Anne helped their daughter Emma bring up their grandchild" },
						new Back() { Type = "noun", Meaning = "anh chị em họ", Example = "She's a distant cousin" }
					};
				case "Career":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "bác sĩ", Example = "The script doctor rewrote the original" },
						new Back() { Type = "noun", Meaning = "nha sĩ", Example = "His mouth is still sore from his visit to the dentist's" },
						new Back() { Type = "noun", Meaning = "thu ngân", Example = "The cashier took the check and handed her a receipt" },
						new Back() { Type = "noun", Meaning = "thợ xây dựng", Example = "A boat builder" },
						new Back() { Type = "noun", Meaning = "phóng viên", Example = "Freelance reporter" },
						new Back() { Type = "noun", Meaning = "thợ may", Example = "Bream and the odd tailor have been along the beaches" },
						new Back() { Type = "noun", Meaning = "giáo viên", Example = "He's a science teacher" },
						new Back() { Type = "noun", Meaning = "đầu bếp", Example = "Susan was a school cook" },
						new Back() { Type = "noun", Meaning = "ảo thuật gia", Example = "He was the magician of the fan belt" },
						new Back() { Type = "noun", Meaning = "thợ làm bánh", Example = "Set a Belgian waffle baker on to heat" },
						new Back() { Type = "noun", Meaning = "ca sĩ", Example = "The concert in the evening included ballad singers , mandolin and banjo players" },
						new Back() { Type = "noun", Meaning = "họa sĩ", Example = "She's an artist with the scissors" },
						new Back() { Type = "noun", Meaning = "bồi bàn", Example = "What restaurants need are professional waiters" },
						new Back() { Type = "noun", Meaning = "thợ mộc", Example = "Ron left school at 14 to become a carpenter and joiner" },
						new Back() { Type = "noun", Meaning = "diễn viên", Example = "He's a good actor" },
						new Back() { Type = "noun", Meaning = "y tá", Example = "Her mother's old nurse" },
						new Back() { Type = "noun", Meaning = "thư kí", Example = "She is reportedly the lowest paid secretary in the department" },
						new Back() { Type = "noun", Meaning = "người làm vườn", Example = "She's a keen gardener" },
						new Back() { Type = "noun", Meaning = "bác sĩ thú y", Example = "We took him to the vet and the vet said, ‘Look, you've got to put him on a diet’" },
						new Back() { Type = "noun", Meaning = "doanh nhân", Example = "But that's important to me and that's not important to them as businessmen" },
						new Back() { Type = "noun", Meaning = "cảnh sát", Example = "If you want a policeman at the moment you have to phone Sorbaig Police Station" },
						new Back() { Type = "noun", Meaning = "thợ sơn nhà", Example = "A self-employed painter and decorator" },
						new Back() { Type = "noun", Meaning = "thợ cắt tóc", Example = "Who is your hairdresser?" },
						new Back() { Type = "noun", Meaning = "vũ công", Example = "She thought he would become a ballet dancer" },
						new Back() { Type = "noun", Meaning = "nông dân", Example = "In reality, it could not have turned out much worse for British farmers and growers" }
					};
				case "Personality":
					return new Back[]
					{
						new Back() { Type = "adjective", Meaning = "nhiều hoài bão", Example = "His mother was hard-working and ambitious for her four children" },
						new Back() { Type = "adjective", Meaning = "theo chủ nghĩa cá nhân", Example = "It's true, artists are very individualistic in that way" },
						new Back() { Type = "adjective", Meaning = "dễ xúc động", Example = "An emotional congregation packed into a Walton church for the last time" },
						new Back() { Type = "adjective", Meaning = "bất cẩn", Example = "Young, brash and careless they are guilty of making basic errors" },
						new Back() { Type = "adjective", Meaning = "dễ thương, đáng yêu", Example = "Being a likeable person you get on well with neighbors and friends" },
						new Back() { Type = "adjective", Meaning = "nhút nhát, rụt rè", Example = "Noise must be kept to a minimum, as tigers are shy" },
						new Back() { Type = "adjective", Meaning = "hay chuyện trò", Example = "She answers e-mails and writes a chatty , informative diary" },
						new Back() { Type = "adjective", Meaning = "tính khí thất thường", Example = "Even songs like The Joker sound moody and soulful" },
						new Back() { Type = "adjective", Meaning = "khoan dung", Example = "Apart from the yuzu, the tree is more tolerant of cold than any other tree citrus" },
						new Back() { Type = "adjective", Meaning = "vui vẻ", Example = "However he had a happy disposition and bore his disability with a cheerful smile" },
						new Back() { Type = "adjective", Meaning = "thân mật, thoải mái", Example = "Applications would be registered to send outgoing traffic" },
						new Back() { Type = "adjective", Meaning = "lãng mạn", Example = "This romantic sentiment takes place each year" },
						new Back() { Type = "adjective", Meaning = "ngây ngô", Example = "We heard childish talk coming from the classroom" },
						new Back() { Type = "adjective", Meaning = "được lòng người khác", Example = "He knew he was handsome and popular with the girls and no girls could resist him" },
						new Back() { Type = "adjective", Meaning = "gần gũi, hòa đồng", Example = "He was a sociable guy who loved company and working with people" },
						new Back() { Type = "adjective", Meaning = "thích cạnh tranh, ganh đua", Example = "It's very competitive and assertive" },
						new Back() { Type = "adjective", Meaning = "thiếu thận trọng, hấp tấp", Example = "A police investigation blamed the driver of the minibus for reckless driving" },
						new Back() { Type = "adjective", Meaning = "lịch sự", Example = "She's too polite to tell him to shut up and go away, so we put up with him" },
						new Back() { Type = "adjective", Meaning = "chu đáo", Example = "To be considerate of other drivers" },
						new Back() { Type = "adjective", Meaning = "đáng tin cậy", Example = "A reliable witness" },
						new Back() { Type = "adjective", Meaning = "hợp lí, suy nghĩ có logic", Example = "Logical thought" },
						new Back() { Type = "adjective", Meaning = "dễ gần", Example = "An outwardly easygoing but fiercely competitive youngster" },
						new Back() { Type = "adjective", Meaning = "dè dặt, kín đáo", Example = "They range from reserved and courtly to warm and expressive" },
						new Back() { Type = "adjective", Meaning = "khoan hồng, rộng lòng; rộng rãi, hào phóng", Example = "This last qualification allowed a liberal interpretation of the system" },
						new Back() { Type = "adjective", Meaning = "chăm chỉ", Example = "He was a nice, hard-working boy who would do anything you asked of him" },
						new Back() { Type = "adjective", Meaning = "độc lập", Example = "Taiwan is clearly an independent country with its own sovereignty" },
						new Back() { Type = "adjective", Meaning = "(người) luôn hướng đến những chuẩn mực hoàn hảo, nhưng đôi lúc thiếu thực tế", Example = "Idealistic young doctors who went to work for the rebels" },
						new Back() { Type = "adjective", Meaning = "ích kỉ", Example = "When I had the second, I realised it was a bit selfish" },
						new Back() { Type = "adjective", Meaning = "sáng tạo", Example = "How can we square this with our notions of a great creative artist?" },
						new Back() { Type = "adjective", Meaning = "không kiên nhẫn", Example = "I became very impatient with the game before I had even gotten far into it" },
						new Back() { Type = "adjective", Meaning = "khôn ngoan, có óc phán đoán", Example = "I cannot believe that it is sensible to spend so much" },
						new Back() { Type = "adjective", Meaning = "quả quyết", Example = "Today's game will be so tight that a single mishap could prove decisive" },
						new Back() { Type = "adjective", Meaning = "tốt bụng", Example = "She was always a kind and loving mother to the twins" },
						new Back() { Type = "adjective", Meaning = "nhạy cảm", Example = "Reflected signals from radar are sensitive to water surface roughness" },
						new Back() { Type = "adjective", Meaning = "kiêu ngạo, tự phụ", Example = "Not to sound vain , but I looked really hot" }
					};
				case "Vehicle":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "xe hơi", Example = "We're going by car" },
						new Back() { Type = "noun", Meaning = "xe tải", Example = "The bike hit the front trailer of the truck , damaging one of its rims" },
						new Back() { Type = "noun", Meaning = "xe buýt", Example = "The architecture includes plural bus masters, each connected to its own bus" },
						new Back() { Type = "noun", Meaning = "xe đạp", Example = "It is very difficult to pedal a bicycle in long skirts and petticoats" },
						new Back() { Type = "noun", Meaning = "xe tay ga", Example = "The water scooter is very popular among the youngsters" },
						new Back() { Type = "noun", Meaning = "xe máy", Example = "So he was sitting on his motorbike, on duty, when I approached him" },
						new Back() { Type = "noun", Meaning = "xe lửa", Example = "I'm trying to pick up the train of the argument" },
						new Back() { Type = "noun", Meaning = "tàu điện ngầm", Example = "A subway station" },
						new Back() { Type = "noun", Meaning = "máy bay phản lực", Example = "He opened his mouth wide and squirted a jet of water in" },
						new Back() { Type = "noun", Meaning = "ngựa", Example = "Racing began about three minutes after man domesticated the horse" },
						new Back() { Type = "noun", Meaning = "tàu, thuyền", Example = "The ship left England with a crew of 36" },
						new Back() { Type = "noun", Meaning = "tàu du lịch", Example = "A cruise ship" },
						new Back() { Type = "noun", Meaning = "tàu chở hàng", Example = "A cargo ship" },
						new Back() { Type = "noun", Meaning = "tàu cánh ngầm", Example = "And then they may not need us to send a submersible submarine down there" },
						new Back() { Type = "noun", Meaning = "lừa", Example = "I hate it when my words come out like I am a stupid donkey" },
						new Back() { Type = "noun", Meaning = "máy bay trực thăng", Example = "It was then decided to step up the hunt and deploy the helicopter and aircraft" },
						new Back() { Type = "noun", Meaning = "tên lửa", Example = "A rocket launcher" },
						new Back() { Type = "noun", Meaning = "lạc đà", Example = "The staff are well attired in camel tops and black aprons" },
						new Back() { Type = "noun", Meaning = "khinh khí cầu", Example = "A hot-air balloon" },
						new Back() { Type = "noun", Meaning = "thuyền buồm", Example = "All of these marinas have sailboats and powerboats for rent" },
						new Back() { Type = "noun", Meaning = "máy bay", Example = "An air plane" },
						new Back() { Type = "noun", Meaning = "máy bay xài động cơ cánh quạt", Example = "A propeller plane" }
					};
				case "Furniture":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "giường", Example = "Few can afford a bed in a hotel" },
						new Back() { Type = "noun", Meaning = "rương, hòm, tủ", Example = "I look across at the picture of Sanjay on the oak chest behind the couch" },
						new Back() { Type = "noun", Meaning = "rèm, màn", Example = "A bearded man drew back the curtain over the window" },
						new Back() { Type = "noun", Meaning = "ngăn kéo", Example = "He reached into a drawer in his desk and pulled out a green piece of cloth" },
						new Back() { Type = "noun", Meaning = "ghế đẩu", Example = "He was sitting on a high stool at the bar" },
						new Back() { Type = "noun", Meaning = "tủ sách", Example = "At the bookcase he opened the drawer and found it was filled with junk" },
						new Back() { Type = "noun", Meaning = "kệ, ngăn, giá", Example = "A shelf along one wall provides extra space for smaller plants" },
						new Back() { Type = "noun", Meaning = "bàn", Example = "Finally reaching an empty table by the window, she sat down hastily" },
						new Back() { Type = "noun", Meaning = "ghế", Example = "I sat in my comfy swivel chair , contemplating in the dark" },
						new Back() { Type = "noun", Meaning = "tấm thảm", Example = "Down on the field, the artificial-turf carpet shines in the spring sun" },
						new Back() { Type = "noun", Meaning = "bộ giá đỡ có một hoặc nhiều cửa ở phía mặt (hoặc xây chìm vào tường)", Example = "She set the cup back on the table then opened the cupboard under the sink" },
						new Back() { Type = "noun", Meaning = "tủ quần áo", Example = "Her wardrobe is extensive" },
						new Back() { Type = "noun", Meaning = "tủ ngăn kéo", Example = "Inside, he quickly opened the big wicker chest of drawers to find a garment" },
						new Back() { Type = "noun", Meaning = "đồ đạc (trong nhà)", Example = "It was a large room with pretty oak furniture: a desk, queen bed, and wardrobe" },
						new Back() { Type = "noun", Meaning = "bàn viết; bàn làm việc", Example = "He landed a job on the sports desk" },
						new Back() { Type = "noun", Meaning = "bệ rửa", Example = "Look around the sink, slow draining pipes indicate a blocked drain" },
						new Back() { Type = "noun", Meaning = "đèn bàn", Example = "Now they were in a small corridor, dimly lit by burning lamps" },
						new Back() { Type = "noun", Meaning = "giá sách", Example = "Picking a book from her bookshelf, she settled down into her bed and began to read" },
						new Back() { Type = "noun", Meaning = "ghế sofa", Example = "The sofas were white with green stripes running vertically downward" },
						new Back() { Type = "noun", Meaning = "ghế băng dài", Example = "Watch your team, switch starters and bench players to see what works" },
						new Back() { Type = "noun", Meaning = "ghế bành", Example = "The benefits of the action replay have long been acknowledged by armchair sports fans" },
						new Back() { Type = "noun", Meaning = "đèn chùm", Example = "It was decorated beautifully with crystal chandeliers and soft spotlights" },
						new Back() { Type = "noun", Meaning = "ghế bập bênh, ghế chao", Example = "Of course, I'd want a big front porch with rocking chairs and maybe a swing" },
						new Back() { Type = "noun", Meaning = "ô đựng tài liệu, hồ sơ", Example = "There was a single file of cars" }
					};
				case "Animal":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "con chó", Example = "Soon, he was asked to train a sniffer dog for the police department" },
						new Back() { Type = "noun", Meaning = "con mèo", Example = "The cat ran after the mouse and all the dishes came crashing down" },
						new Back() { Type = "noun", Meaning = "động vật", Example = "Humans are the only animals who weep" },
						new Back() { Type = "noun", Meaning = "con gấu", Example = "As a boy he cared more for the Yankees' star Mickey Mantle than for a toy bear" },
						new Back() { Type = "noun", Meaning = "con hắc tinh tinh", Example = "What is the most human-like behaviour you saw in chimpanzees?" },
						new Back() { Type = "noun", Meaning = "con voi", Example = "We will be travelling part of the way on elephants which is exciting" },
						new Back() { Type = "noun", Meaning = "con cáo", Example = "A wily old fox" },
						new Back() { Type = "noun", Meaning = "con hươu cao cổ", Example = "There are 1,000 animals, including tigers, giraffes , even rhinos" },
						new Back() { Type = "noun", Meaning = "con hà mã", Example = "The hippopotamus is perfectly at home in the water, mating and giving birth there" },
						new Back() { Type = "noun", Meaning = "con báo đốm", Example = "The big cats you find outside Africa include tiger, jaguar, leopard" },
						new Back() { Type = "noun", Meaning = "con sư tử", Example = "On top of it, the blue banner with golden lion as heraldry of Central Kingdom flew" },
						new Back() { Type = "noun", Meaning = "con nhím", Example = "Like elephants, hippos and bushpigs, porcupines are nocturnal crop raiders" },
						new Back() { Type = "noun", Meaning = "con gấu mèo", Example = "Birds of prey, crows, ravens, and raccoons try to steal their eggs and chicks" },
						new Back() { Type = "noun", Meaning = "con tê giác", Example = "But I remember she said there was a hippopotamus and a rhinoceros" },
						new Back() { Type = "noun", Meaning = "con sóc", Example = "Burrowing owls prefer to remodel an existing burrow, often a ground squirrel 's" },
						new Back() { Type = "noun", Meaning = "con cá sấu", Example = "This environmentally protected area is home to turtles, crabs, dolphins, and alligators" },
						new Back() { Type = "noun", Meaning = "con dơi", Example = "The placental mammals include such diverse forms as whales, bats" },
						new Back() { Type = "noun", Meaning = "con hươu", Example = "Today, his son was young and strong, so he would ask Jason to hunt deer or elk" },
						new Back() { Type = "noun", Meaning = "con chó sói", Example = "He's the archetypal wolf in Armani threads" },
						new Back() { Type = "noun", Meaning = "con hải ly", Example = "Sorry there's no proper post from me today as I've been a busy little beaver" },
						new Back() { Type = "noun", Meaning = "con sóc chuột", Example = "They prey chiefly on chipmunks and other rodents" }
					};
				case "Nature":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "đồng cỏ", Example = "Two hours passed, and they finally reached the meadow by the Cher River" },
						new Back() { Type = "noun", Meaning = "rừng nhiệt đới", Example = "He had been traveling the dense jungles for what seemed weeks, months even" },
						new Back() { Type = "noun", Meaning = "rừng", Example = "Much of Europe was covered with forest" },
						new Back() { Type = "noun", Meaning = "rừng mưa nhiệt đới", Example = "Rainforest plants" },
						new Back() { Type = "noun", Meaning = "núi", Example = "The ice and snow of a mountain peak" },
						new Back() { Type = "noun", Meaning = "hẻm núi", Example = "She could barely see the outline of a river winding lazily through the canyon" },
						new Back() { Type = "noun", Meaning = "bờ vực", Example = "It didn't feel like she was on the brink of a cliff about to fall off" },
						new Back() { Type = "noun", Meaning = "đồi", Example = "The house was built on a hill" },
						new Back() { Type = "noun", Meaning = "vách đá", Example = "He even moved closer to the set, like a lemming drawn to the edge of a cliff" },
						new Back() { Type = "noun", Meaning = "đá", Example = "The Irish scrum has been as solid as a rock" },
						new Back() { Type = "noun", Meaning = "thung lũng", Example = "They were in a deep valley completely surrounded by mountains" },
						new Back() { Type = "noun", Meaning = "cồn cát", Example = "A sand dune" },
						new Back() { Type = "noun", Meaning = "sa mạc", Example = "They had left the forested area and were back into the sand of the desert" },
						new Back() { Type = "noun", Meaning = "núi lửa", Example = "This area had not been affected by the main pyroclastic flows from the volcano" },
						new Back() { Type = "noun", Meaning = "đất liền", Example = "My family had worked the land for many years" },
						new Back() { Type = "noun", Meaning = "mặt đất", Example = "The ground is very wet" },
						new Back() { Type = "noun", Meaning = "đất trồng trọt", Example = "Blueberries need very acid soil" },
						new Back() { Type = "noun", Meaning = "đồng bằng", Example = "She folded the note and put it in a plain white envelope" },
						new Back() { Type = "noun", Meaning = "đại dương", Example = "The Holy Qur' an is an ocean of divine knowledge" },
						new Back() { Type = "noun", Meaning = "biển", Example = "Rocky bays lapped by vivid blue sea" },
						new Back() { Type = "noun", Meaning = "bãi biển", Example = "Sandy beach" },
						new Back() { Type = "noun", Meaning = "vùng đất sát biển", Example = "They explored the coast , seeing birds of all kinds" },
						new Back() { Type = "noun", Meaning = "bờ biển", Example = "I took the tiller and made for the shore" },
						new Back() { Type = "noun", Meaning = "đảo", Example = "The water which surrounds the island is a rich fishing ground for tuna and mackerel" },
						new Back() { Type = "noun", Meaning = "hồ", Example = "The following day, I got up early to fish the carp lake" }
					};
				case "Fruit":
					return new Back[]
					{
						new Back() { Type = "noun", Meaning = "trái táo", Example = "Tap on a freshly dug potato and it feels crisp, like an apple right off the tree" },
						new Back() { Type = "noun", Meaning = "trái táo xanh", Example = "It's a green apple" },
						new Back() { Type = "noun", Meaning = "trái nho tím", Example = "It's a black grape" },
						new Back() { Type = "noun", Meaning = "trái chuối", Example = "Towers started a fruit farm, growing bananas and avocados" },
						new Back() { Type = "noun", Meaning = "trái lê", Example = "At 4 p.m., the falcon was back, sitting in my pear tree" },
						new Back() { Type = "noun", Meaning = "trái lựu", Example = "The Afghans have lost their pomegranate orchards to poppy fields" },
						new Back() { Type = "noun", Meaning = "trái cam", Example = "In fact the grapefruit is simply a hybrid between a pomelo and an orange" },
						new Back() { Type = "noun", Meaning = "trái nho xanh", Example = "It's a white grape" },
						new Back() { Type = "noun", Meaning = "trái dâu tây", Example = "Net strawberries before the fruit starts to show colour, to keep off birds" },
						new Back() { Type = "noun", Meaning = "trái thơm", Example = "A slice of pineapple" },
						new Back() { Type = "noun", Meaning = "trái đào", Example = "As we can clearly see, one is a white peach, the other yellow" },
						new Back() { Type = "noun", Meaning = "trái thanh long", Example = "It's a dragon fruit" },
						new Back() { Type = "noun", Meaning = "trái khế", Example = "They make the best jams with the bananas, the papaya and the starfruit" },
						new Back() { Type = "noun", Meaning = "trái chanh dây", Example = "My favourite was the chilli jelly, the passion fruit and the lime" },
						new Back() { Type = "noun", Meaning = "trái mít", Example = "Fruit trees, like bananas, citrus, and jackfruit, are planted around the village" },
						new Back() { Type = "noun", Meaning = "trái ổi", Example = "Other good sources include tomatoes, red and pink grapefruit, and guava" },
						new Back() { Type = "noun", Meaning = "trái chà là", Example = "It's a date" },
						new Back() { Type = "noun", Meaning = "trái xoài", Example = "I have a mango tree that's been in the ground two years" },
						new Back() { Type = "noun", Meaning = "trái dừa", Example = "In a mixing bowl add the flour, sugar, coconut, honey and juice" },
						new Back() { Type = "noun", Meaning = "trái vải", Example = "It's rich with exotic spices and flavours of lychees and passion fruit" },
						new Back() { Type = "noun", Meaning = "trái nhãn", Example = "Others in the same genus are the longan, rambutan, and pulasan" },
						new Back() { Type = "noun", Meaning = "trái sầu riêng", Example = "If we're lucky, we can buy big and tasty durians" },
						new Back() { Type = "noun", Meaning = "trái quýt", Example = "Is liquid coppercide safe for my tangerine tree?" }
					};

				case "General":
					return new Back[]
					{
						new Back() { Type = "verb", Meaning = "diễu hành", Example = "They planned to march on Baton Rouge" },
						new Back() { Type = "verb", Meaning = "đi bộ", Example = "She turned and walked a few paces" },
						new Back() { Type = "verb", Meaning = "chạy", Example = "She quickly opened her door and ran down the steps" },
						new Back() { Type = "verb", Meaning = "bò, trườn", Example = "Glazes can crawl away from a crack in the piece" },
						new Back() { Type = "verb", Meaning = "nhón chân", Example = "he admits he has never been one to tiptoe around controversial issues" },
						new Back() { Type = "verb", Meaning = "kéo", Example = "He had no right to drag you into this sort of thing" },
						new Back() { Type = "verb", Meaning = "đẩy", Example = "Competition in the retail sector will push down prices" },
						new Back() { Type = "verb", Meaning = "nhảy", Example = "Phineas shoved a key in the passenger door and jumped inside" },
						new Back() { Type = "verb", Meaning = "nhảy cao lên hay về phía trước", Example = "I nodded, my heart leaping like an excited fish out of the water" },
						new Back() { Type = "verb", Meaning = "nhảy nhún một chân", Example = "A strong dark beer, heavily hopped" },
						new Back() { Type = "verb", Meaning = "nhảy", Example = "The woman skipped down the steps until she was beside the two" },
						new Back() { Type = "verb", Meaning = "khúm núm", Example = "We crouched down in the trench" },
						new Back() { Type = "verb", Meaning = "đánh", Example = "He hit his hand against the wall" },
						new Back() { Type = "verb", Meaning = "duỗi (tay, chân)", Example = "Many spandex-enhanced fabrics will stretch in both directions for maximum comfort" },
						new Back() { Type = "verb", Meaning = "nâng lên", Example = "The tray is pulled back under the car and lifted into its holding position" },
						new Back() { Type = "verb", Meaning = "lặn", Example = "I watched a few birds dive and glide" },
						new Back() { Type = "verb", Meaning = "tựa người", Example = "He was lean and supple, every bit as reptilian as birdlike" },
						new Back() { Type = "verb", Meaning = "ngồi", Example = "It is important for a dog to sit when instructed" },
						new Back() { Type = "verb", Meaning = "ngồi xổm", Example = "Turning around to face the child, he squatted down to her level" },
						new Back() { Type = "verb", Meaning = "uốn", Example = "A refusal to bend to mob rule" },
						new Back() { Type = "verb", Meaning = "nhặt lên", Example = "Pick up a bottle" },
						new Back() { Type = "verb", Meaning = "giữ", Example = "I was held in a cell with 20 other prisoners with no room to manoeuvre" },
						new Back() { Type = "verb", Meaning = "mang", Example = "They still carry those same fears" },
						new Back() { Type = "verb", Meaning = "tát", Example = "After I'd almost recovered, he dragged me out of bed and began slapping me" },
						new Back() { Type = "verb", Meaning = "đấm", Example = "The district police can punch one button to get to the appropriate emergency responder" },
						new Back() { Type = "verb", Meaning = "đá", Example = "They kicked down the door, dragged the women outside and went into the house" },
						new Back() { Type = "verb", Meaning = "bắt", Example = "The easiest time of the year to catch rabbit is winter" },
						new Back() { Type = "verb", Meaning = "ném", Example = "If you sew, create a new apron, fleece throw or keepsake pillow" },
						new Back() { Type = "verb", Meaning = "kéo", Example = "I'm starting to pull ahead in that last, though, so that's good" },
						new Back() { Type = "adjective", Meaning = "nóng", Example = "The whole creationism versus evolution debate is so hot here" },
						new Back() { Type = "adjective", Meaning = "lạnh", Example = "It will be very cold by night with temperatures not expected to exceed two degrees" },
						new Back() { Type = "adjective", Meaning = "đói", Example = "He can now recognise when he is hungry and cry for food" },
						new Back() { Type = "adjective", Meaning = "bực bội", Example = "They are driving a frustrated people to desperation" },
						new Back() { Type = "adjective", Meaning = "điên tiết, giận dữ", Example = "If anything, the public is furious at Blunkett for not being heavy enough" },
						new Back() { Type = "adjective", Meaning = "giận dữ", Example = "The angry sea" },
						new Back() { Type = "adjective", Meaning = "ghê tởm", Example = "Your ladyship should know about my beliefs and frankly your behaviour disgusts me" },
						new Back() { Type = "adjective", Meaning = "ngạc nhiên", Example = "There was a surprised silence" },
						new Back() { Type = "adjective", Meaning = "buồn bã", Example = "The sad depressing reality of it all is that it's far worse than it sounds" },
						new Back() { Type = "adjective", Meaning = "chán, buồn chán", Example = "Neil no longer looked bored or impatient; he look dumbfounded" },
						new Back() { Type = "adjective", Meaning = "sợ hãi", Example = "I can't remember when I first started getting scared of going to the dentist" },
						new Back() { Type = "adjective", Meaning = "buồn ngủ", Example = "So now I'm sitting here, feeling sleepy and lethargic" },
						new Back() { Type = "adjective", Meaning = "mệt mỏi", Example = "Eventually the exhausted , undernourished dog found the cage and waited" },
						new Back() { Type = "adjective", Meaning = "đang yêu", Example = "He is in love" },
						new Back() { Type = "adjective", Meaning = "hạnh phúc", Example = "What I got was a much less happy greeting and it didn't sound like female at all" },
						new Back() { Type = "verb", Meaning = "đi", Example = "I don't want to go" },
						new Back() { Type = "verb", Meaning = "gõ bàn phím", Example = "Are you able to type?" },
						new Back() { Type = "verb", Meaning = "uống", Example = "I stopped to sit and drink from the fountain I remembered from years before" },
						new Back() { Type = "verb", Meaning = "ăn", Example = "Eat your vegetables!" },
						new Back() { Type = "verb", Meaning = "viết", Example = "To write data to a disk" },
						new Back() { Type = "verb", Meaning = "xoá", Example = "I'm your dream man/woman ( delete as applicable)" },
						new Back() { Type = "verb", Meaning = "loại bỏ", Example = "Shaking the tree removes loose needles and any insects" },
						new Back() { Type = "verb", Meaning = "thêm vào", Example = "The suite will add a touch of class to your bedroom" },
						new Back() { Type = "verb", Meaning = "chỉnh sửa", Example = "And so it is quite disappointing that this volume was very poorly edited" },
						new Back() { Type = "verb", Meaning = "đọc", Example = "The brief note read like a cry for help" },
					};
				default:
					return null;
			}
		}
	}
}