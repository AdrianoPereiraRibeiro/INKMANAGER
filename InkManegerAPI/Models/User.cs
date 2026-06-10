using System.ComponentModel.DataAnnotations;


namespace InkManegerAPI.Models
{
        public class User
        {
            [Key]
            public int Id { get; set; }

            [Required(ErrorMessage = "O nome é obrigatório.")]
            [StringLength(100, ErrorMessage = "O nome não pode passar de 100 caracteres.")]
            public string Name { get; set; } = string.Empty;

            [Required(ErrorMessage = "O e-mail é obrigatório.")]
            [EmailAddress(ErrorMessage = "E-mail inválido.")]
            [StringLength(150)]
            public string Email { get; set; } = string.Empty;

            [Required(ErrorMessage = "A senha é obrigatória.")]
            [StringLength(255)]
            public string PasswordHash { get; set; } = string.Empty;

            [Required]
            public UserRole Role { get; set; }
        }
    }

