using System.Collections.Generic;

using System.Collections.Generic;

namespace core.Models
{
    public class ProductCache
    {
        private Dictionary<int, List<Product>> cache;

        public ProductCache()
        {
            cache = new Dictionary<int, List<Product>>();
        }

        public void AgregarProductos(int categoryId, List<Product> products)
        {
            if (products == null)
            {
                throw new ArgumentNullException(nameof(products), "La lista de productos no puede ser nula.");
            }

            if (categoryId < 1)
            {
                throw new ArgumentException("La categoria no fue sleccionada", nameof(categoryId));
            }
            if (!cache.ContainsKey(categoryId))
            {
                cache[categoryId] = products;
            }
        }

        public List<Product> ObtenerProductos(int categoryId)
        {
             if (categoryId < 1)
            {
                throw new ArgumentException("La categoria no fue sleccionada", nameof(categoryId));
            }
            if (cache.ContainsKey(categoryId))
            {
                return cache[categoryId];
            }
            else
            {
                return null;
            }
        }

        public void Clear()
        {
            cache.Clear();
        }
    }
}