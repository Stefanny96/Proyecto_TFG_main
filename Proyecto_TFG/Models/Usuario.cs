using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations; 

namespace Proyecto_TFG.Models
{
    public class Usuario
    {
        [Key]  // Marca la propiedad como la clave primaria
        [Column("id_usuario")] //mapeo
        public int IdUsuario { get; set; }

       [Column("nombre")] 
        public string Nombre { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("contraseña")]
        public string Contrasena { get; set; }

        [Column("id_empresa")] //
        public int IdEmpresa { get; set; }
    }
}
