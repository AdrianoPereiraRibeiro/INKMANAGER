namespace InkManegerAPI.Controllers
{
    using InkManagerAPI.Data;
    using InkManagerAPI.Models;
    using InkManegerAPI.Data;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

        [ApiController]
        [Route("api/[controller]")]
        public class AuthController : ControllerBase
        {
            private readonly AppDbContext _context;

            public AuthController(AppDbContext context)
            {
                _context = context;
            }

            /// <summary>
            /// Realiza o cadastro de um novo usuário (Cliente ou Tatuador).
            /// </summary>
            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] User user)
            {
                if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                {
                    return BadRequest(new { message = "Este e-mail já está cadastrado." });
                }

                // Nota: Em produção, use criptografia (BCrypt). Para o MVP acadêmico, salvaremos direto.
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Se for um Tatuador, cria automaticamente o perfil profissional vinculado
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

                return StatusCode(201, new { message = "Usuário registrado com sucesso!", userId = user.Id, role = user.Role.ToString() });
            }

            /// <summary>
            /// Autentica o usuário e retorna o perfil/role para redirecionamento no React.
            /// </summary>
            [HttpPost("login")]
            public async Task<IActionResult> Login([Obsolete][FromBody] LoginDto loginDto)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.PasswordHash == loginDto.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "E-mail ou senha inválidos." });
                }

                return Ok(new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role.ToString()
                });
            }
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }

