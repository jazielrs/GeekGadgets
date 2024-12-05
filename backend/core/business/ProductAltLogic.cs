using System.Security.AccessControl;
using core;
using core.DataBase;
using core.Models;

public class ProductAltLogic
{
    private ProductAltData productData;
    public delegate void nuevoProuductoD(Product product);

    public ProductAltLogic()
    {
        productData = new ProductAltData();
    }

    nuevoProuductoD nuevoProducto = (product) =>
    {
        Store.Instance.AgregarProducto(product);
    };

    public async void AddProduct(ProductAlt product)
    {
        if(product == null){
            throw new ArgumentNullException("No se ha ingresado un producto para agregar");
        }
        Categories cat = new Categories();
        Product newProduct = new Product
        {
            id = product.id,
            name = product.name,
            description = product.description,
            price = product.price,
            imageUrl = product.imageUrl,
            pcant = product.pcant,
            category = cat.obtenerCategoria(product.categoryID) 
        };
        await productData.InsertarProductoAsync(newProduct, nuevoProducto);
    }
}