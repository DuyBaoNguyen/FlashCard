using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using FlashCard.Contracts;
using FlashCard.Repositories;
using Microsoft.Extensions.FileProviders;
using System.IO;
using FlashCard.Services;
using Microsoft.OpenApi.Models;

namespace FlashCard
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			var builder = new SqlConnectionStringBuilder(Configuration.GetConnectionString("DefaultConnection"));
			builder.Password = Configuration["DbPassword"];

			services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.ConnectionString));

			services.AddDefaultIdentity<ApplicationUser>()
				.AddRoles<ApplicationRole>()
				.AddEntityFrameworkStores<ApplicationDbContext>();

			services.AddIdentityServer()
				.AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

			services.AddAuthentication()
				.AddIdentityServerJwt()
				.AddGoogle(options =>
				{
					options.ClientId = Configuration["Authentication:Google:ClientId"];
					options.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
				})
				.AddFacebook(options =>
				{
					options.AppId = Configuration["Authentication:Facebook:AppId"];
					options.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
				});

			services.AddControllersWithViews();
			services.AddRazorPages();
			services.AddControllers()
				.ConfigureApiBehaviorOptions(options =>
				{
					options.SuppressMapClientErrors = true;
					options.InvalidModelStateResponseFactory = context =>
					{
						return new BadRequestObjectResult(context.ModelState);
					};
				});

			services.AddHttpContextAccessor();
			services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();
			services.AddScoped<IImageService, ImageService>();

			// In production, the React files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});

			services.AddSwaggerGen(c => 
			{
				c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseSwagger();
			app.UseSwaggerUI(c => 
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
			});

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseStaticFiles(new StaticFileOptions
			{
				FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "assets")),
				RequestPath = "/storage",
				OnPrepareResponse = ctx =>
				{
					ctx.Context.Response.Headers.Add("Cache-Control", "public,max-age=2592000");
				}
			});
			app.UseSpaStaticFiles();

			app.UseRouting();

			app.UseAuthentication();
			app.UseIdentityServer();
			app.UseAuthorization();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
				endpoints.MapRazorPages();
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseReactDevelopmentServer(npmScript: "start");
				}
			});
		}
	}
}
