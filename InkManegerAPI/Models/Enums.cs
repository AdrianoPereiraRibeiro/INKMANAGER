namespace InkManegerAPI.Models
{
    public enum UserRole
        {
            Client = 1,
            Artist = 2,
            Admin = 3
        }

        public enum AppointmentStatus
        {
            Requested = 1, // Solicitado pelo cliente
            Confirmed = 2, // Aceito pelo tatuador
            Canceled = 3   // Recusado ou cancelado
        }
    }
