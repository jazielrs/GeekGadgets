using System.Linq;
using core.DataBase;
namespace core.Models
{
    public sealed class Store
    {
        private readonly ProductCache productCache = new ProductCache();
        public List<Product> Products { get; private set; }
        public int TaxPercentage { get; private set; }

        private Store(List<Product> products, int taxPercentage)
        {
            if (products == null)
            {
                throw new ArgumentNullException(nameof(products), "Lista de productos no puede ser nula");
            }
            if (taxPercentage < 0 || taxPercentage > 100)
            {
                throw new ArgumentOutOfRangeException(nameof(taxPercentage), "El porcentaje de impuestos de be estar entre 0 y 100");
            }
            this.Products = products;
            this.TaxPercentage = taxPercentage;
        }

        public static readonly Store Instance;

        static Store()
        {
            var products = StoreDb.ExtraerProductosDB();
            Instance = new Store(products, 13);
        }

        public List<Product> generarCacheCategoria(int cat)
        {
            if(cat <= 0){
                throw new ArgumentException("La categoria buscada no se encuentra disponible");
            }
            List<Product> cacheList = productCache.ObtenerProductos(cat);
            Products = cacheList;
            return cacheList;
        }

        public void SetProducts(List<Product> newProducts)
        {
            if (newProducts == null)
            {
                throw new ArgumentNullException(nameof(newProducts), "La lista de productos no puede ser nula");
            }
            Instance.Products = newProducts;
        }

        public void AgregarProducto(Product product){
            if(product == null){
                throw new ArgumentNullException("No se ha obtenido un producto correcto");
            }
            Products.Add(product);
        }
    }
}