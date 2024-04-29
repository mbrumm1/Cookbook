using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public static class AuthenticationEndpoints
{
    public static void RegisterAuthenticationEndpoints(this WebApplication app)
    {
        var authentication = app.MapGroup("/authentication");
        authentication.MapPost("/", Authenticate);
    }

    private static async Task<IResult> Authenticate(Credentials credentials, IConfiguration config)
    {
        ArgumentNullException.ThrowIfNull(config, nameof(config));
        var user = ValidateUserCredentials(credentials.Username, credentials.Password);
        if (user is null)
        {
            return TypedResults.Unauthorized();
        }
        string secret = config["Authentication:SecretForKey"] ?? string.Empty;
        Console.WriteLine(secret);
        var key = new SymmetricSecurityKey(Convert.FromBase64String(config["Authentication:SecretForKey"] ?? string.Empty));
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new Claim("username", user.Username)
        };
        var token = new JwtSecurityToken(
            config["Authentication:Issuer"],
            config["Authentication:Audience"],
            claims,
            DateTime.UtcNow,
            DateTime.UtcNow.AddHours(1),
            signingCredentials
        );
        return TypedResults.Ok(new JwtSecurityTokenHandler().WriteToken(token));
    }

    private static User ValidateUserCredentials(string? username, string? password)
    {
        return new User(username ?? "michael");
    }

    public record Credentials(string? Username, string? Password);
    public record User(string Username);
}