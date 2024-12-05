namespace core.Models;
using System.Collections;
//cambiar category struct en el nombre
public class Categories{ 

    private Category[] categories = new Category[]
    {
        new Category(1, "Perifericos"),
        new Category(2, "Hardware"),
        new Category(3, "Moda"),
        new Category(4, "Videojuegos"),
        new Category(5, "Entretenimiento"),
        new Category(6, "Decoracion")
    };

    public Category obtenerCategoria(int numCategory) 
    {
        if (numCategory <= 0)
        {
            throw new ArgumentException("El número de categoría debe ser un entero positivo.");
        }
        Category cat = new Category(); 
        foreach (var category in categories)
        {
            if (numCategory == category.id)
            {
                cat = category;
            }
        }
        return cat;
    }

    public struct Category
    {
    public int id { get; set; }
    public string Name { get; set; }
    
    public Category (int catID, string name){ 
        this.id = catID;
        this.Name = name;
    }    

    }

}