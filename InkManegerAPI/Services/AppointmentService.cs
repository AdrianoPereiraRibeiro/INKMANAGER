using InkManegerAPI.Data;
using InkManegerAPI.Models;
using Microsoft.EntityFrameworkCore;
 
    namespace InkManagerAPI.Services
    {
        public class AppointmentService
        {
            private readonly AppDbContext _context;

            public AppointmentService(AppDbContext context)
            {
                _context = context;
            }

            /// <summary>
            /// Verifica se o tatuador já possui um agendamento CONFIRMADO em um intervalo de tempo próximo.
            /// Considera uma janela de segurança de 2 horas por sessão de tatuagem.
            /// </summary>
            public async Task<bool> HasScheduleConflictAsync(int artistId, DateTime requestedDateTime)
            {
                // Define que uma sessão dura em média 2 horas. 
                // Logo, bloqueia 2 horas antes e 2 horas depois do horário solicitado.
                DateTime startWindow = requestedDateTime.AddHours(-2);
                DateTime endWindow = requestedDateTime.AddHours(2);

                bool hasConflict = await _context.Appointments
                    .AnyAsync(a => a.ArtistId == artistId
                                && a.Status == AppointmentStatus.Confirmed
                                && a.DateTime > startWindow
                                && a.DateTime < endWindow);

                return hasConflict;
            }
        }
    }

