
using InkManagerAPI.Services;
using InkManegerAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace InkManegerAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ==========================================
            // 1. CONFIGURAÇÃO DOS SERVIÇOS (DI)
            // ==========================================

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            // Configuração do Swagger com suporte a comentários XML
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "InkManager API",
                    Version = "v1",
                    Description = "API de gerenciamento de estúdios de tatuagem e agendamentos."
                });

                // Habilita a leitura dos comentários em formato XML que colocamos nos Controllers
                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
                if (File.Exists(xmlPath))
                {
                    options.IncludeXmlComments(xmlPath);
                }
            });

            // Configuração da Conexão com o Banco de Dados SQL Server
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Registro do Serviço de Agendamento (Lógica de Conflito de Horários)
            builder.Services.AddScoped<AppointmentService>();

            // Configuração de CORS: Permite que o Frontend (React/Vite) acesse os endpoints da API
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()   // Em produção, mude para a URL do front (ex: http://localhost:5173)
                          .AllowAnyMethod()   // Permite GET, POST, PUT, DELETE, etc.
                          .AllowAnyHeader();  // Permite qualquer cabeçalho HTTP
                });
            });

            // ==========================================
            // 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES (MIDDLEWARES)
            // ==========================================

            var app = builder.Build();

            // Ativa o Swagger em ambiente de Desenvolvimento
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "InkManager API v1");
                });
            }

            app.UseHttpsRedirection();

            // Ativa a política de CORS antes da autorização e do mapeamento dos controladores
            app.UseCors("AllowFrontend");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
