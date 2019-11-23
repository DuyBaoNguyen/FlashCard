using System.Collections.Generic;
using System.Net.Mime;
using FlashCard.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashCard.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class VocabularyTypesController : ControllerBase
    {
        private ApplicationDbContext dbContext;

        public VocabularyTypesController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IEnumerable<string> GetAll()
        {
            return new string[] { "noun", "verb", "adjective", "adverb", "preposition" };
        }
    }
}