using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Proyecto_TFG.Models;

namespace Proyecto_TFG.Pages
{
    public class IndexModel : PageModel
    {
        //Variable de campo. Poner "_" antes de la variable es una convenci�n com�n en C# para indicar que se trata de un campo privado de la clase.
        private readonly AppDbContext _dbContext; //Almacena el contexto de la base de datos

        //El atributo [BindProperty] en Razor Pages se utiliza para enlazar autom�ticamente los valores enviados desde un formulario HTML
        // Propiedades para almacenar los datos del formulario
        [BindProperty]
        public string Usuario { get; set; }

        [BindProperty]
        public string Contrasena { get; set; }

        public string ErrorMessage { get; set; }

        //CONSTRUCTOR.  ASP.NET Core autom�ticamente crea y pasa una instancia del AppDbContext al constructor de IndexModel.
        public IndexModel(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //OnPost(): Al enviar el formulario, se busca al usuario en la base de datos y se verifica si las credenciales son correctas.
        public IActionResult OnPost()
        {
            var usuario = _dbContext.Usuarios.FirstOrDefault(u => u.Nombre == Usuario && u.Contrasena == Contrasena);//.FirstOrDefault():Este metodo devuelve el primer elemento de una coleccion que cumple con una condici�n espec�fica
            if (usuario != null)
            {
                // Si las credenciales son correctas, redirige a otra p�gina
                return RedirectToPage("/Formulario");
            }
            else
            {
                // Si las credenciales son incorrectas, muestra el mensaje de error
                ErrorMessage = "Credenciales incorrectas. Intenta nuevamente.";
                return Page();
            }
        }

        public void OnGet()
        {

        }
    }
}