using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Quark.Data;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;
using Quark.Dtos.Response.User;
using Quark.Exceptions;
using Quark.Models;
using Quark.Services.ConnectionMapper;
using Quark.Services.Create;
using Quark.Services.Delete;
using Quark.Services.EmailSender;
using Quark.Services.Mapping.Request;
using Quark.Services.Mapping.Request.TeamMappers;
using Quark.Services.Mapping.Response;
using Quark.Services.Mapping.Response.TeamMappers;
using Quark.Services.Mapping.Response.UserMappers;
using Quark.Services.ModelServices.TeamService;
using Quark.Services.ModelServices.TokenService;
using Quark.Services.ModelServices.UserService;
using Quark.Services.Read;
using Quark.Services.Update;
using Quark.Utilities;
using Resend;

var builder = WebApplication.CreateBuilder(args);
var isDevelopment = builder.Environment.IsDevelopment();

if (File.Exists("./secrets.json"))
    builder.Configuration.AddJsonFile("./secrets.json");

var env = builder.Environment;
var keysPath = Path.Combine(env.ContentRootPath, "keys");
Directory.CreateDirectory(keysPath);

builder
    .Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(keysPath))
    .SetApplicationName("Quark");

var configuration = builder.Configuration;
builder.Services.AddSingleton(configuration);

builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(options =>
{
    var apiKey = configuration["Resend:ApiKey"];
    if (string.IsNullOrWhiteSpace(apiKey))
        throw new MissingConfigException("Resend API key is null or empty");

    options.ApiToken = apiKey;
});
builder.Services.AddTransient<IResend, ResendClient>();

builder.Services.AddOpenApi();
if (isDevelopment)
{
    builder.Services.AddSwaggerGen(options =>
    {
        options.SupportNonNullableReferenceTypes();
        options.SwaggerDoc("v1", new() { Title = "API", Version = "v1" });
    });
}

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.SerializerOptions.RespectNullableAnnotations = true;
});

builder.Logging.ClearProviders().AddConsole();
builder.Services.AddExceptionHandler<ExceptionHandler>();

var connectionString = configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
    throw new MissingConfigException("Connection string is null or empty");

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(connectionString);

    if (isDevelopment)
        options.EnableSensitiveDataLogging();
});

#region Identity / Auth
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(
        AuthPolicies.CookieOnly,
        policy =>
        {
            policy.AddAuthenticationSchemes(IdentityConstants.ApplicationScheme);
            policy.RequireAuthenticatedUser();
        }
    );

    options.AddPolicy(
        AuthPolicies.JwtOnly,
        policy =>
        {
            policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
            policy.RequireAuthenticatedUser();
        }
    );

    options.AddPolicy(
        AuthPolicies.CookieOrJwt,
        policy =>
        {
            policy.AddAuthenticationSchemes(
                IdentityConstants.ApplicationScheme,
                JwtBearerDefaults.AuthenticationScheme
            );
            policy.RequireAuthenticatedUser();
        }
    );

    options.DefaultPolicy = options.GetPolicy(AuthPolicies.CookieOnly)!;
});

builder
    .Services.AddIdentity<User, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 8;
        options.User.RequireUniqueEmail = true;
        options.User.AllowedUserNameCharacters =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._";
        options.Lockout.MaxFailedAccessAttempts = 10;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
        options.SignIn.RequireConfirmedAccount = false;
        options.Tokens.EmailConfirmationTokenProvider = "ShortEmail";
    })
    .AddEntityFrameworkStores<DataContext>()
    .AddApiEndpoints()
    .AddDefaultTokenProviders()
    .AddTokenProvider<EmailTokenProvider<User>>("ShortEmail");

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(1);
    options.SlidingExpiration = true;

    if (isDevelopment)
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None;
    }
    else
    {
        var domain = configuration["Domain"];
        if (string.IsNullOrWhiteSpace(domain))
            throw new MissingConfigException("Domain is null or empty");

        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.Domain = domain;
    }

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder
    .Services.AddAuthentication()
    .AddJwtBearer(
        JwtBearerDefaults.AuthenticationScheme,
        options =>
        {
            var key = configuration["Jwt:Key"];
            var issuer = configuration["Jwt:Issuer"];
            var audience = configuration["Jwt:Audience"];

            if (
                string.IsNullOrWhiteSpace(key)
                || string.IsNullOrWhiteSpace(issuer)
                || string.IsNullOrWhiteSpace(audience)
            )
                throw new MissingConfigException("Missing JWT configuration");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                ClockSkew = TimeSpan.FromSeconds(30),
            };
        }
    );

builder.Services.AddTransient<IEmailSender<User>, EmailSender>();
#endregion

#region Rate limiting
builder.Services.AddRateLimiter(x =>
{
    x.AddTokenBucketLimiter(
        policyName: RateLimitingPolicies.Global,
        options =>
        {
            options.TokenLimit = 10;
            options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            options.QueueLimit = 15;
            options.ReplenishmentPeriod = TimeSpan.FromSeconds(1);
            options.TokensPerPeriod = 2;
            options.AutoReplenishment = true;
        }
    );

    x.AddTokenBucketLimiter(
        policyName: RateLimitingPolicies.EmailConfirmation,
        options =>
        {
            options.TokenLimit = 1;
            options.QueueLimit = 0;
            options.ReplenishmentPeriod = TimeSpan.FromSeconds(60);
            options.TokensPerPeriod = 1;
            options.AutoReplenishment = true;
        }
    );
});
#endregion

#region CORS
var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>();
if (allowedOrigins is null || allowedOrigins.Length == 0)
    throw new MissingConfigException("AllowedOrigins is null or empty");

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "WebsitePolicy",
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(allowedOrigins)
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});
#endregion

#region Model Services

#region Users
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IReadSingleService<User>, ReadService<User>>();
builder.Services.AddScoped<IExecuteUpdateService<User>, UpdateService<User>>();
builder.Services.AddScoped<IResponseMapper<User, UserResponseDto>, UserResponseMapper>();
#endregion

#region Tokens
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ICreateSingleService<RefreshToken>, CreateService<RefreshToken>>();
builder.Services.AddScoped<IReadSingleService<RefreshToken>, ReadService<RefreshToken>>();
builder.Services.AddScoped<IDeleteService<RefreshToken>, DeleteService<RefreshToken>>();
#endregion

#region Teams
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ICreateSingleService<Team>, CreateService<Team>>();
builder.Services.AddScoped<IRequestMapper<CreateTeamRequestDto, Team>, CreateTeamRequestMapper>();
builder.Services.AddScoped<IResponseMapper<Team, TeamResponseDto>, TeamResponseMapper>();
#endregion

#region Team Members
builder.Services.AddScoped<ICreateSingleService<TeamMember>, CreateService<TeamMember>>();
builder.Services.AddScoped<IDeleteService<TeamMember>, DeleteService<TeamMember>>();
#endregion

#endregion

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.RespectNullableAnnotations = true;
    });
;

#region SignalR
builder.Services.AddSignalR();
builder.Services.AddSingleton<ConnectionMapper>();
#endregion

var app = builder.Build();

if (isDevelopment)
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseExceptionHandler("/error");
app.UseRateLimiter();
app.UseCors("WebsitePolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers().RequireRateLimiting(RateLimitingPolicies.Global);

app.MapMethods("/", ["HEAD"], () => Results.Ok());

#region Test endpoints
if (isDevelopment)
{
    app.MapGet("test-connection", () => new { status = "OK" })
        .RequireRateLimiting(RateLimitingPolicies.Global);

    app.MapGet("test-auth", () => new { status = "OK" })
        .RequireRateLimiting(RateLimitingPolicies.Global)
        .RequireAuthorization();
}
#endregion

await app.RunAsync();
