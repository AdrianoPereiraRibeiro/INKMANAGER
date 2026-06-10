using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace InkManegerAPI.Models
{

        public class TattooArtist
        {
            [Key]
            public int Id { get; set; }

            // Vinculação com a tabela de Usuários
            [Required]
            public int UserId { get; set; }

            [ForeignKey("UserId")]
            public User? User { get; set; }

            [StringLength(100)]
            public string Speciality { get; set; } = string.Empty; // Ex: Realismo, Blackwork, Old School

            [StringLength(500)]
            public string Bio { get; set; } = string.Empty; // Biografia / Descrição do artista

            public string PortfolioLink { get; set; } = string.Empty; // Link para Instagram ou portfólio externo
        }
    }

