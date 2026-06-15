using InkManegerAPI.Data;
using InkManegerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InkManegerAPI.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class AuthController : ControllerBase
        {
            private readonly AppDbContext _context;

            public AuthController(AppDbContext context)
            {
                _context = context;
            }

            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
            {
                // Se o modelo enviado pelo React estiver inválido por falta de algum campo, avisa o front
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email.Trim()))
                {
                    return BadRequest(new { message = "Este e-mail já está cadastrado." });
                }

                var user = new User
                {
                    Name = registerDto.Name,
                    Email = registerDto.Email.Trim(),
                    PasswordHash = registerDto.Password, // Alimenta a propriedade requerida pelo banco
                    Role = registerDto.Role
                };

                try
                {
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    if (user.Role == UserRole.Artist)
                    {
                        var artistProfile = new TattooArtist
                        {
                            UserId = user.Id,
                            Speciality = "Defina sua especialidade",
                            Bio = "Fale um pouco sobre você",
                            PortfolioLink = ""
                        };
                        _context.TattooArtists.Add(artistProfile);
                        await _context.SaveChangesAsync();
                    }

                    return StatusCode(201, new
                    {
                        message = "Usuário registrado com sucesso!",
                        userId = user.Id,
                        token = "mvp-mock-token-" + user.Id,
                        role = user.Role.ToString()
                    });
                }
                catch (Exception ex)
                {
                    // Se der qualquer erro de validação ou banco, conseguiremos ver no console da API
                    return StatusCode(500, new { message = "Erro interno ao salvar no banco.", detalhes = ex.Message });
                }
            }

            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Busca comparando exatamente os campos limpos
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email.Trim() && u.PasswordHash == loginDto.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "E-mail ou senha inválidos." });
                }

                return Ok(new
                {
                    userId = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role.ToString(),
                    token = "mvp-mock-token-" + user.Id
                });
            }
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class UserRegisterDto
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public UserRole Role { get; set; }
        }
    }