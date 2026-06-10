using InkManegerAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace InkManegerAPI.Data
{
        public class AppDbContext : DbContext
        {
            // O construtor passa as configurações de conexão (vinda do appsettings.json) para o Entity Framework
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
            {
            }

            // Mapeamento das tabelas que serão criadas no SQL Server
            public DbSet<User> Users { get; set; }
            public DbSet<TattooArtist> TattooArtists { get; set; }
            public DbSet<Appointment> Appointments { get; set; }

            // Configurações avançadas de relacionamento e chaves estrangeiras (Fluent API)
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                // 1. Configuração da relação entre Perfil do Artista e Usuário
                modelBuilder.Entity<TattooArtist>()
                    .HasOne(a => a.User)
                    .WithMany()
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade); // Se o usuário for deletado, o perfil profissional dele também é

                // 2. Configuração dos Agendamentos (Appointments) - Relação com o Cliente
                modelBuilder.Entity<Appointment>()
                    .HasOne(a => a.Client)
                    .WithMany()
                    .HasForeignKey(a => a.ClientId)
                    .OnDelete(DeleteBehavior.Restrict); // Impede erro de ciclo de deleção no SQL Server

                // 3. Configuração dos Agendamentos (Appointments) - Relação com o Tatuador
                modelBuilder.Entity<Appointment>()
                    .HasOne(a => a.Artist)
                    .WithMany()
                    .HasForeignKey(a => a.ArtistId)
                    .OnDelete(DeleteBehavior.Restrict); // Impede erro de ciclo de deleção no SQL Server
            }
        }
    }

