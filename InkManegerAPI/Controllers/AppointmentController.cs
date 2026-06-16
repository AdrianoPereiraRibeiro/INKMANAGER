using InkManagerAPI.Services;
using InkManegerAPI.Data;
using InkManegerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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

            // [CREATE] - Solicitar um novo agendamento (BLINDADO CONTRA FUSO E SEM ERROS DE COMPILAÇÃO)
            [HttpPost]
            public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
            {
                // O .DateTime do DateTimeOffset pega o valor exato digitado (Ex: 19:00), 
                // ignorando qualquer fuso horário local que o servidor tente embutir automaticamente.
                DateTime targetDateTime = DateTime.SpecifyKind(dto.DateTime.DateTime, DateTimeKind.Unspecified);

                bool hasConflict = await _appointmentService.HasScheduleConflictAsync(dto.ArtistId, targetDateTime);

                if (hasConflict)
                {
                    return BadRequest(new { message = "O tatuador já possui uma sessão confirmada neste período." });
                }

                // Mapeia o DTO seguro para as propriedades válidas da sua classe Appointment
                var appointment = new Appointment
                {
                    ArtistId = dto.ArtistId,
                    ClientId = dto.ClientId,
                    DateTime = targetDateTime,

                    // Concatena as informações do formulário que não possuem coluna própria na sua tabela
                    Notes = $"Estilo: {dto.Style} | Local: {dto.BodyPart} | Tamanho: {dto.SizeCm}cm. Notas: {dto.Notes}",

                    Status = AppointmentStatus.Requested
                };

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

            // [UPDATE DATA] - Editar informações do agendamento (BLINDADO CONTRA FUSO)
            [HttpPut("{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] AppointmentUpdateDto dto)
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { message = "Agendamento não encontrado." });

                // Captura o horário exato enviado no DTO DateTimeOffset e remove fuso
                DateTime targetDateTime = DateTime.SpecifyKind(dto.DateTime.DateTime, DateTimeKind.Unspecified);

                // Se mudou a data, revalida o conflito de horário
                if (appointment.DateTime != targetDateTime)
                {
                    bool hasConflict = await _appointmentService.HasScheduleConflictAsync(appointment.ArtistId, targetDateTime);
                    if (hasConflict) return BadRequest(new { message = "Nova data indisponível para este artista." });
                }

                appointment.DateTime = targetDateTime;
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

        // DTO para receber a criação mantendo o tipo DateTimeOffset para travar o fuso
        public class AppointmentCreateDto
        {
            public int ArtistId { get; set; }
            public int ClientId { get; set; }
            public DateTimeOffset DateTime { get; set; }
            public string Style { get; set; } = string.Empty;
            public string BodyPart { get; set; } = string.Empty;
            public int SizeCm { get; set; }
            public string Notes { get; set; } = string.Empty;
        }

        // DTO para receber a atualização mantendo o tipo DateTimeOffset para travar o fuso
        public class AppointmentUpdateDto
        {
            public DateTimeOffset DateTime { get; set; }
            public decimal EstimatedPrice { get; set; }
            public string Notes { get; set; } = string.Empty;
        }
    }