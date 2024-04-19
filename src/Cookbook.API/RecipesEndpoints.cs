using Microsoft.EntityFrameworkCore;

public static class RecipesEndpoints
{
    public static void RegisterRecipesEndpoints(this WebApplication app)
    {
        var recipes = app.MapGroup("/recipes");
        recipes.MapGet("/", GetAllRecipes);
        recipes.MapGet("/{id}", GetRecipe);
        recipes.MapPost("/", CreateRecipe);
        recipes.MapPut("/{id}", UpdateRecipe);
        recipes.MapDelete("/{id}", DeleteRecipe);
    }

    private static async Task<IResult> GetAllRecipes(CookbookDb db)
    {
        return TypedResults.Ok(
            await db.Recipes
                .Include(r => r.Ingredients)
                .AsNoTracking()
                .ToListAsync());
    }

    private static async Task<IResult> GetRecipe(int id, CookbookDb db)
    {
        var recipe = await db.Recipes
            .Include(r => r.Ingredients)
            .FirstOrDefaultAsync(r => r.Id == id);
        if (recipe is null)
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(recipe);
    }

    private static async Task<IResult> CreateRecipe(CreateRecipeRequest request, CookbookDb db)
    {
        var recipe = new Recipe
        {
            Name = request.Name,
            Ingredients = request.Ingredients,
            Instructions = request.Instructions
        };
        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/{recipe.Id}", recipe);
    }

    private static async Task<IResult> UpdateRecipe(int id, UpdateRecipeRequest request, CookbookDb db)
    {
        if (await db.Recipes.FindAsync(id) is Recipe recipe)
        {
            recipe.Name = request.Name;
            recipe.Ingredients = request.Ingredients;
            recipe.Instructions = request.Instructions;
            await db.SaveChangesAsync();
            return TypedResults.NoContent();
        }
        return TypedResults.NotFound();
    }

    private static async Task<IResult> DeleteRecipe(int id, CookbookDb db)
    {
        if (await db.Recipes.FindAsync(id) is Recipe recipe)
        {
            db.Recipes.Remove(recipe);
            await db.SaveChangesAsync();
            return TypedResults.NoContent();
        }
        return TypedResults.NotFound();
    }
}

public class Recipe
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public List<Ingredient> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
}

public class Ingredient
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public int Quantity { get; set; }
    public Unit Unit { get; set; }
    public string? OtherUnitDescription { get; set; }
}

public enum Unit
{
    Teaspoon,
    Tablespoon,
    Cup,
    Pint,
    Quart,
    Gallon,
    FluidOunce,
    Ounce,
    Pound
}

public class CookbookDb : DbContext
{
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();

    public CookbookDb(DbContextOptions<CookbookDb> options)
        : base(options) { }
}

public record CreateRecipeRequest(string Name, List<Ingredient> Ingredients, List<string> Instructions);
public record UpdateRecipeRequest(string Name, List<Ingredient> Ingredients, List<string> Instructions);