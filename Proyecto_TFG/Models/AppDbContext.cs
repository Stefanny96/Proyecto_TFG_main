//El AppDbContext es la clase que se va utilizar para interactuar con la base de datos en Entity Framework.
//Entity Framework : facilita la interacción con la base de datos al permitir trabajar directamente con clases
//y objetos de C# en lugar de SQL puro.).
//Actuara como el contexto de la base de datos, que es un puente entre mi aplicación y la base de datos real,
//permitiendome realizar operaciones de lectura, escritura, actualización y eliminación de datos

using Microsoft.EntityFrameworkCore;

namespace Proyecto_TFG.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Empresa> Empresas { get; set; }
    }
}
