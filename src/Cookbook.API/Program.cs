using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<CookbookDb>(opt => opt.UseSqlite("Data Source=cookbook.db;Cache=Shared"));
builder.Services.ConfigureHttpJsonOptions(opt =>
{
    opt.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "CookbookAPI";
    config.Title = "CookbookAPI v1";
    config.Version = "v1";
});
builder.Services.AddCors(opt => 
{
    opt.AddPolicy(
        "originPolicy", 
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "CookbookAPI";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });

    var scope = app.Services.CreateScope();
    using var seedDb = scope.ServiceProvider.GetRequiredService<CookbookDb>();
    
    if (!seedDb.Recipes.Any())
    {
        seedDb.Recipes.AddRange([
            new Recipe
            {
                Id = 1,
                Name = "Red Beans & Rice",
                Ingredients = new List<Ingredient> {
                    new Ingredient { Name = "Kidney Beans", Quantity = 2, Unit = Unit.Cup },
                    new Ingredient { Name = "Andouille Sausage", Quantity = 1, Unit = Unit.Pound },
                    new Ingredient { Name = "Cajun Seasoning", Quantity = 1, Unit = Unit.Tablespoon },
                    new Ingredient { Name = "Bay Leaves", Quantity = 2, Unit = Unit.Other, OtherUnitDescription = "Leaves" },
                    new Ingredient { Name = "Rice (choose your favorite)", Quantity = 3, Unit = Unit.Cup },
                    new Ingredient { Name = "Minced Garlic", Quantity = 4, Unit = Unit.Other, OtherUnitDescription = "Cloves" },
                    new Ingredient { Name = "Hot Sauce (your favorite)", Quantity = 1, Unit = Unit.Tablespoon },
                    new Ingredient { Name = "Beef Bouillion Cubes", Quantity = 3, Unit = Unit.Other, OtherUnitDescription = "Cubes" },
                    new Ingredient { Name = "Diced Yellow Onion", Quantity = 1, Unit = Unit.Other, OtherUnitDescription = "Large" },
                    new Ingredient { Name = "Diced Celery", Quantity = 2, Unit = Unit.Other, OtherUnitDescription = "Stalks" },
                    new Ingredient { Name = "Diced Green Bell Pepper", Quantity = 1, Unit = Unit.Other }
                },
                Instructions = new List<string> {
                    "Heat pot on medium-high heat. Add oil.",
                    "Add green bell pepper, onion, and celery to pot. Sautee for about 15 minutes.",
                    "Add garlic, cajun seasoning, and beef buyoin cubes. Break cubes up if needed. Stir and Sautee for another 3 minutes.",
                    "Add water, beans, sausage, and hot sauce. Stir.",
                    "Bring pot to a boil. Boil 10-15 minutes. Uncovered",
                    "Lower heat to a simmer. Cover pot. Check and stir about every 30 minutes.",
                    "Serve and enjoy :)"
                }
            }
        ]);
        seedDb.SaveChanges();
    }
}
app.RegisterAuthenticationEndpoints();
app.RegisterRecipesEndpoints();
app.UseCors("originPolicy");
app.Run();
