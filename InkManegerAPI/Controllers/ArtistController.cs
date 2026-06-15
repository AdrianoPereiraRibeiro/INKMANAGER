using InkManegerAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InkManegerAPI.Controllers
{

        [ApiController]
        [Route("api/[controller]")]
        public class TattooArtistController : ControllerBase
        {
            private readonly AppDbContext _context;

            public TattooArtistController(AppDbContext context)
            {
                _context = context;
            }

            // [READ ALL] - Listar todos os tatuadores (Para o catálogo do cliente)
            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                var artists = await _context.TattooArtists
                    .Include(a => a.User)
                    .Select(a => new
                    {
                        Id = a.Id,
                        UserId = a.UserId,
                        Name = a.User!.Name,
                        Email = a.User.Email,
                        Speciality = a.Speciality,
                        Bio = a.Bio,
                        PortfolioLink = a.PortfolioLink
                    })
                    .ToListAsync();

                return Ok(artists);
            }

            // [READ BY ID] - Obter dados de um tatuador específico (Para a tela de perfil dele)
            [HttpGet("{id}")]
            public async Task<IActionResult> GetById(int id)
            {
                var artist = await _context.TattooArtists
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (artist == null) return NotFound(new { message = "Tatuador não encontrado." });

                return Ok(new
                {
                    Id = artist.Id,
                    UserId = artist.UserId,
                    Name = artist.User!.Name,
                    Speciality = artist.Speciality,
                    Bio = artist.Bio,
                    PortfolioLink = artist.PortfolioLink
                });
            }

            // [UPDATE] - Atualizar o perfil do Tatuador (Tela: Configurações/Editar Perfil)
            [HttpPut("{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] TattooArtistUpdateDto dto)
            {
                var artist = await _context.TattooArtists.FindAsync(id);
                if (artist == null) return NotFound(new { message = "Tatuador não encontrado." });

                artist.Speciality = dto.Speciality;
                artist.Bio = dto.Bio;
                artist.PortfolioLink = dto.PortfolioLink;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Perfil atualizado com sucesso!", artist });
            }

            // [DELETE] - Remover perfil de tatuador
            [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var artist = await _context.TattooArtists.FindAsync(id);
                if (artist == null) return NotFound(new { message = "Tatuador não encontrado." });

                _context.TattooArtists.Remove(artist);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Perfil de tatuador removido com sucesso." });
            }
        }

        public class TattooArtistUpdateDto
        {
            public string Speciality { get; set; } = string.Empty;
            public string Bio { get; set; } = string.Empty;
            public string PortfolioLink { get; set; } = string.Empty;
        }
    }
