using InkManagerAPI.Data;
using InkManagerAPI.Models;
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

            /// <summary>
            /// Retorna a lista de todos os tatuadores cadastrados com seus dados de perfil.
            /// </summary>
            [HttpGet]
            public async Task<IActionResult> GetAllArtists()
            {
                var artists = await _context.TattooArtists
                    .Include(a => a.User) // Junta com a tabela User para pegar o Nome e Email
                    .Select(a => new {
                        ArtistId = a.Id,
                        Name = a.User!.Name,
                        Speciality = a.Speciality,
                        Bio = a.Bio,
                        PortfolioLink = a.PortfolioLink
                    })
                    .ToListAsync();

                return Ok(artists);
            }
        }
    }

