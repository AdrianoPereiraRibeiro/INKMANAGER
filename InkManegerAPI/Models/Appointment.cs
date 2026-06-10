namespace InkManegerAPI.Models { 
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

  public class Appointment
    {
        [Key]
        public int Id { get; set; }

        // Quem está agendando (Cliente)
        [Required]
        public int ClientId { get; set; }

        [ForeignKey("ClientId")]
        public User? Client { get; set; }

        // Com quem está agendando (Tatuador)
        [Required]
        public int ArtistId { get; set; }

        [ForeignKey("ArtistId")]
        public TattooArtist? Artist { get; set; }

        [Required(ErrorMessage = "A data e horário são obrigatórios.")]
        public DateTime DateTime { get; set; }

        [Required]
        public AppointmentStatus Status { get; set; }

        // Armazena valores monetários de forma correta no SQL Server
        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedPrice { get; set; }

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty; // Ex: "Tatuagem de leão no braço esquerdo, aprox. 15cm"
    }
}

