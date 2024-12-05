using System.Collections;
using System.Runtime.ExceptionServices;
using core.Models;
using System.Collections.Generic;
using System.Linq;

namespace core.Business 
{
    public class Products
    {
        public Dictionary<int, List<Product>> filter { private set; get; }

        public Products()
        {
            filter = new Dictionary<int, List<Product>>();
        }


        public void FiltrarProductosBusqueda(int[] idCat, IEnumerable<Product> listaProductos, string idSearch)
        {
            if (idCat == null)
            {
                throw new ArgumentException("El array de categorías no puede ser nulo.");
            }
            if (listaProductos == null)
            {
                throw new ArgumentNullException(nameof(listaProductos), "La lista de productos no puede ser nula.");
            }
            if (idSearch == null)
            {
                throw new ArgumentNullException(nameof(listaProductos), "El texto a buscar se encuentra vacio");
            }

            if (idCat.Length == 1 && idCat[0] == 0)
            {
                if (!filter.ContainsKey(0))
                {
                    filter[0] = new List<Product>();
                }

                foreach (var product in listaProductos)
                {
                    if (string.IsNullOrEmpty(idSearch) || product.name.IndexOf(idSearch, StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        InsertarProductosBusquedaBinaria(filter[0], product);
                    }
                }
            }
            else
            {
                foreach (var category in idCat)
                {
                    if (!filter.ContainsKey(category))
                    {
                        filter[category] = new List<Product>();
                    }
                }

                foreach (var product in listaProductos)
                {
                    bool matchesSearchText = string.Equals(idSearch, "noText", StringComparison.OrdinalIgnoreCase) ||
                                             string.IsNullOrEmpty(idSearch);

                    bool matchesCategory = idCat.Length == 0 || idCat.Any(cat => cat == product.category.id);

                    if (matchesCategory && (matchesSearchText || product.name.IndexOf(idSearch, StringComparison.OrdinalIgnoreCase) >= 0))
                    {
                        foreach (var category in idCat)
                        {
                            if (product.category.id == category)
                            {
                                InsertarProductosBusquedaBinaria(filter[category], product);
                            }
                        }
                    }
                }
            }
        }


        private void InsertarProductosBusquedaBinaria(List<Product> productsInCategory, Product product)
        {
            if (productsInCategory == null)
            {
                throw new ArgumentNullException("La lista de productos es nula");
            }

            if (product == null)
            {
                throw new ArgumentNullException("El producto a insertar es nulo");
            }
            
            int left = 0;
            int right = productsInCategory.Count - 1;

            while (left <= right)
            {
                int mid = left + (right - left) / 2;
                if (productsInCategory[mid].category.id == product.category.id)
                {
                    productsInCategory.Insert(mid, product);
                    return;
                }
                else if (productsInCategory[mid].category.id < product.category.id)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            productsInCategory.Insert(left, product);
        }


        public List<Product> ObtenerProductosBusqueda(int[] idCat)
        {
            if (idCat == null || idCat.Length == 0)
            {
                throw new ArgumentException("El array de categorías no puede ser nulo o vacío.");
            }

            List<Product> filteredProducts = new List<Product>();
            foreach (var category in idCat)
            {
                if (filter.ContainsKey(category))
                {
                    filteredProducts.AddRange(filter[category]);
                }
            }

            filteredProducts = filteredProducts.OrderBy(p => p.name).ToList();
            return filteredProducts;
        }

        public List<Product> ObtenerProductosFiltrados(int idCat)
        {
            if (idCat <= 0)
            {
                throw new ArgumentException("Id de categoría debe ser mayor que cero.");
            }
            if (!filter.ContainsKey(idCat))
            {
                throw new KeyNotFoundException("No se encontró la categoría con el id especificado.");
            }
            List<Product> filteredProducts = filter[idCat].OrderBy(p => p.name).ToList();
            return filteredProducts;
        }

        public void FiltrarProductosCategoria(int idCat, IEnumerable<Product> listaProductos)
        {
            if (idCat < 1)
            {
                throw new ArgumentException("Id de categoría debe ser mayor que cero.");
            }
            if (listaProductos == null)
            {
                throw new ArgumentNullException(nameof(listaProductos), "La lista de productos no puede ser nula.");
            }
            List<Product> productsInCategory = new List<Product>();
            if (idCat == 7)
            {
                productsInCategory = listaProductos.ToList();
                filter[idCat] = productsInCategory;
            }
            else
            {
                productsInCategory = listaProductos.Where(p => p.category.id == idCat).ToList();
                filter[idCat] = productsInCategory;
            }
        }
    }
}