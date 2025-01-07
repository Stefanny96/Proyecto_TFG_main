using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations; 

namespace Proyecto_TFG.Models
{
    public class Empresa
    {

        [Key]  // Marca la propiedad como la clave primaria
        [Column("id_empresa")]
        public int IdEmpresa { get; set; }

        [Column("nombre_empresa")]
        public string NombreEmpresa { get; set; }

        [Column("cif")]
        public string CIF { get; set; }

        [Column("email_empresa")]
        public string EmailEmpresa { get; set; }
    }
}
