using InkManagerAPI.Data;
using InkManagerAPI.Models;
using InkManegerAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InkManegerAPI.Controllers
{

        [ApiController]
        [Route("api/[controller]")]
        public class DashboardController : ControllerBase
        {
            private readonly AppDbContext _context;

            public DashboardController(AppDbContext context)
            {
                _context = context;
            }

            /// <summary>
            /// Retorna os dados consolidados de faturamento mensal para renderização de gráficos.
            /// </summary>
            [HttpGet("artist/{artistId}/revenue")]
            public async Task<IActionResult> GetMonthlyRevenue(int artistId)
            {
                var appointments = await _context.Appointments
                    .Where(a => a.ArtistId == artistId && a.Status == AppointmentStatus.Confirmed)
                    .ToListAsync();

                // Agrupa por mês de forma simples na memória para o gráfico do frontend
                var chartData = appointments
                    .GroupBy(a => a.DateTime.ToString("MMMM/yyyy"))
                    .Select(g => new
                    {
                        Mes = g.Key,
                        Faturamento = g.Sum(a => a.EstimatedPrice),
                        Quantidade = g.Count()
                    });

                return Ok(chartData);
            }
        }
    }

