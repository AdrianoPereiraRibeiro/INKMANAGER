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

            // [CREATE] - Solicitar um novo agendamento (Com validação de conflito)
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

            // [READ] - Listar os agendamentos de um cliente específico
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

            // [READ] - Listar os agendamentos de um tatuador específico (Para a agenda dele)
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

            // [UPDATE STATUS] - Aceitar/Recusar Agendamento (Fluxo de Aprovação)
            [HttpPut("{id}/status")]
            public async Task<IActionResult> UpdateStatus(int id, [FromQuery] AppointmentStatus status)
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { message = "Agendamento não encontrado." });

                appointment.Status = status;
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Agendamento atualizado para: {status}", appointment });
            }

            // [UPDATE DATA] - Editar informações do agendamento (Caso queiram mudar a data ou notas)
            [HttpPut("{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] AppointmentUpdateDto dto)
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { message = "Agendamento não encontrado." });

                // Se mudou a data, revalida o conflito de horário
                if (appointment.DateTime != dto.DateTime)
                {
                    bool hasConflict = await _appointmentService.HasScheduleConflictAsync(appointment.ArtistId, dto.DateTime);
                    if (hasConflict) return BadRequest(new { message = "Nova data indisponível para este artista." });
                }

                appointment.DateTime = dto.DateTime;
                appointment.EstimatedPrice = dto.EstimatedPrice;
                appointment.Notes = dto.Notes;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Agendamento atualizado com sucesso!", appointment });
            }

            // [DELETE] - Cancelar/Apagar um agendamento definitivamente
            [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { message = "Agendamento não encontrado." });

                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Agendamento removido com sucesso do sistema." });
            }
        }

        public class AppointmentUpdateDto
        {
            public DateTime DateTime { get; set; }
            public decimal EstimatedPrice { get; set; }
            public string Notes { get; set; } = string.Empty;
        }
    }
