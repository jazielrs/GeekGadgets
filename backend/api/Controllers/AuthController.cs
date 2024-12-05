using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace geekstore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private static readonly List<TestUser> TestUsers = new List<TestUser>
        {
            new TestUser { UserName = "jaziel", UserPassword = "12345", UserRoles = new [] { "Admin", "User" } },
        };

        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class TestUser
        {
            public string UserName { get; set; }
            public string UserPassword { get; set; }
            public IEnumerable<string> UserRoles { get; set; }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "El usuario no se encuentra definido");
            }

            var testUser = TestUsers.FirstOrDefault(u => u.UserName == user.UserName && u.UserPassword == user.Password);

            if (testUser != null)
            {
                var claims = testUser.UserRoles.Select(role => new Claim(ClaimTypes.Role, role)).ToList();
                claims.Add(new Claim(ClaimTypes.Name, testUser.UserName));

                var secretKey = "TheSecretKeyNeedsToBePrettyLongSoWeNeedToAddSomeCharsHere"; 
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var signinCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "https://localhost:5001",
                    audience: "https://localhost:5001",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(10),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                return Ok(new AuthenticatedResponse { Token = tokenString });
            }

            return Unauthorized();
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class AuthenticatedResponse
    {
        public string Token { get; set; }
    }
}