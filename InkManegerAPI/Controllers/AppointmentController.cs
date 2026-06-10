using InkManagerAPI.Services;
using InkManegerAPI.Data;
using InkManegerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InkManegerAPI.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class AppointmentController : ControllerBase
        {
            private readonly AppDbContext _context;
            private readonly AppointmentService _appointmentService;

            public AppointmentController(AppDbContext context, AppointmentService appointmentService)
            {
                _context = context;
                _appointmentService = appointmentService;
            }

            /// <summary>
            /// Solicita um novo agendamento (Valida conflito de horários).
            /// </summary>
            [HttpPost]
            public async Task<IActionResult> Create([FromBody] Appointment appointment)
            {
                bool hasConflict = await _appointmentService.HasScheduleConflictAsync(appointment.ArtistId, appointment.DateTime);

                if (hasConflict)
                {
                    return BadRequest(new { message = "O tatuador já possui uma sessão confirmada neste período." });
                }

                appointment.Status = AppointmentStatus.Requested;
                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return StatusCode(201, appointment);
            }

            /// <summary>
            /// Retorna a agenda de um cliente específico (Tela: Meus Agendamentos).
            /// </summary>
            [HttpGet("client/{clientId}")]
            public async Task<IActionResult> GetByClient(int clientId)
            {
                var appointments = await _context.Appointments
                    .Where(a => a.ClientId == clientId)
                    .Include(a => a.Artist)
                    .ThenInclude(art => art!.User)
                    .OrderBy(a => a.DateTime)
                    .ToListAsync();

                return Ok(appointments);
            }

            /// <summary>
            /// Retorna todos os agendamentos de um tatuador (Tela: Gerenciador de Agenda do Tatuador).
            /// </summary>
            [HttpGet("artist/{artistId}")]
            public async Task<IActionResult> GetByArtist(int artistId)
            {
                var appointments = await _context.Appointments
                    .Where(a => a.ArtistId == artistId)
                    .Include(a => a.Client)
                    .OrderBy(a => a.DateTime)
                    .ToListAsync();

                return Ok(appointments);
            }

            /// <summary>
            /// Altera o status de um agendamento (Aprovar ou Recusar).
            /// </summary>
            /// <param name="id">ID do agendamento.</param>
            /// <param name="status">Novo status (Confirmed ou Canceled).</param>
            [HttpPut("{id}/status")]
            public async Task<IActionResult> UpdateStatus(int id, [FromQuery] AppointmentStatus status)
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { message = "Agendamento não encontrado." });

                appointment.Status = status;
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Agendamento atualizado para: {status}" });
            }
        }
    }

