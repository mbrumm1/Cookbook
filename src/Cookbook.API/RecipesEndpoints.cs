using System.Text.Json;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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

        app.MapGet("/units", GetUnits);
    }

    private static async Task<IResult> GetAllRecipes(CookbookDb db)
    {
        return TypedResults.Ok(
            await db.Recipes
                //.Include(r => r.Ingredients)
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
        var validator = new CreateRecipeRequestValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid) 
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

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
        var validator = new UpdateRecipeRequestValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid) 
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

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

    private static IResult GetUnits()
    {
        return TypedResults.Ok(Enum.GetNames<Unit>().OrderBy(u => u));
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
    Pound,
    Other
}

public class CookbookDb : DbContext
{
    public DbSet<Recipe> Recipes { get; set;}

    public CookbookDb(DbContextOptions<CookbookDb> options)
        : base(options) { }

    override protected void OnModelCreating(ModelBuilder builder) 
    {
        builder.Entity<Recipe>()
            .OwnsMany(r => r.Ingredients, builder => { builder.ToJson(); });

        builder.Entity<Recipe>()
            .Property(r => r.Instructions)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null!)!,
                new ValueComparer<ICollection<string>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => (ICollection<string>)c.ToList()
                )
            );
    }
}

public class IngredientValidator : AbstractValidator<Ingredient>
{
    public IngredientValidator()
    {
        RuleFor(ingredient => ingredient.Name).NotEmpty().MaximumLength(250);
        RuleFor(ingredient => ingredient.Quantity).GreaterThan(0).LessThanOrEqualTo(99);
        RuleFor(ingredient => ingredient.OtherUnitDescription)
            .NotEmpty()
            .When(ingredient => ingredient.Unit == Unit.Other);
    }
}

public record CreateRecipeRequest(string Name, List<Ingredient> Ingredients, List<string> Instructions);

public class CreateRecipeRequestValidator : AbstractValidator<CreateRecipeRequest>
{
    public CreateRecipeRequestValidator()
    {
        RuleFor(request => request.Name)
            .NotEmpty()
            .MaximumLength(500);
        RuleForEach(request => request.Ingredients)
            .SetValidator(new IngredientValidator());
        RuleFor(request => request.Instructions)
            .Must(instructions => instructions.All(
                instruction => !string.IsNullOrEmpty(instruction) &&
                instruction.Length <= 1000));
    }
}

public record UpdateRecipeRequest(string Name, List<Ingredient> Ingredients, List<string> Instructions);

public class UpdateRecipeRequestValidator : AbstractValidator<UpdateRecipeRequest>
{
    public UpdateRecipeRequestValidator()
    {
        RuleFor(request => request.Name)
            .NotEmpty()
            .MaximumLength(500);
        RuleForEach(request => request.Ingredients)
            .SetValidator(new IngredientValidator());
        RuleFor(request => request.Instructions)
            .Must(instructions => instructions.All(
                instruction => !string.IsNullOrEmpty(instruction) &&
                instruction.Length <= 1000));
    }
}