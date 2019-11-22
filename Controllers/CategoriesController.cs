using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.ApiModels;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class CategoriesController : ControllerBase
    {
        private ApplicationDbContext dbContext;

        public CategoriesController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        
        [HttpGet]
        public IEnumerable<CategoryApiModel> GetAll()
        {
            var categories = dbContext.Categories.AsNoTracking();
            var categoryModels = new List<CategoryApiModel>();

            foreach (var category in categories)
            {
                categoryModels.Add(new CategoryApiModel(category));
            }

            return categoryModels;
        }
    }
}