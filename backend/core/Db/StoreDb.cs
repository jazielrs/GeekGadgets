using System;
using System.Data.Common;
using System.IO.Compression;
using MySqlConnector;
using core.Models;
using System.Security.Cryptography;
using System.Diagnostics;
namespace core.DataBase;

public sealed class StoreDb
{
    public static async void CrearDatosSync()
    {
        string connectionString = "Server=localhost;Uid=root;Pwd=123456;"; 

        using (var connectionWithoutDb = new MySqlConnection(connectionString))
        {
            try
            {
                connectionWithoutDb.Open();

                string createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS store;";
                using (var createDbCommand = new MySqlCommand(createDatabaseQuery, connectionWithoutDb))
                {
                    createDbCommand.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo crear la base de datos", ex);
            }
        }

        using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
        {
            try
            {
                connection.Open();

                string useDatabaseQuery = "USE store;";
                using (var useDbCommand = new MySqlCommand(useDatabaseQuery, connection))
                {
                    useDbCommand.ExecuteNonQuery();
                }

                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        StoreDb storeDb = new StoreDb();
                        string createTableQuery = @"
                        DROP TABLE IF EXISTS salesLine;
                        DROP TABLE IF EXISTS sales; 
                        DROP TABLE IF EXISTS products;
                        DROP TABLE IF EXISTS paymentMethod;
                        CREATE TABLE IF NOT EXISTS products (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100),
                            description VARCHAR(255),
                            price DECIMAL(10, 2),
                            imageURL VARCHAR(255),
                            pcant INT,
                            idCat INT 
                        );
                        CREATE TABLE IF NOT EXISTS paymentMethod (
                            id INT PRIMARY KEY,
                            payment_type VARCHAR(50),
                            estado INT
                        );
                        CREATE TABLE IF NOT EXISTS sales (
                            purchase_number VARCHAR(30) NOT NULL PRIMARY KEY,
                            purchase_date DATETIME NOT NULL,
                            total DECIMAL(10, 2) NOT NULL,
                            payment_type INT,
                            FOREIGN KEY (payment_type) REFERENCES paymentMethod(id)
                        );
                        CREATE TABLE IF NOT EXISTS salesLine(
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            purchase_id VARCHAR(30) NOT NULL,
                            product_id INT,
                            quantity INT,
                            price DECIMAL(10, 2),
                            FOREIGN KEY (purchase_id) REFERENCES sales(purchase_number),
                            FOREIGN KEY (product_id) REFERENCES products(id)
                        );
                        CREATE TABLE IF NOT EXISTS campain (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            sender VARCHAR(100),
                            message_content TEXT,
                            status INT,
                            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );";

                        using (var command = new MySqlCommand(createTableQuery, connection, transaction))
                        {
                            command.ExecuteNonQuery();
                        }

                        storeDb.agregarProductos();
                        storeDb.agregarMetodosPago();
                        storeDb.InsertarVentasPasadas();

                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                       throw new Exception("No se pudieron crear las tablas", ex);
                    }
                }
            }
            catch (Exception ex)
            {
               throw new Exception("No se pudo establecer la conexion a db", ex);
            }
        }
    }

    internal void agregarProductos()
    {
        Categories cat = new Categories();

        var products = new List<Product>
    {
    new Product { id = 1, name = "Gamer tools", description = "Perifericos disponibles de diferentes diseños", price = 30, imageUrl = "https://png.pngtree.com/png-vector/20220725/ourmid/pngtree-gaming-equipment-computer-peripheral-device-png-image_6064567.png", pcant = 0, category = cat.obtenerCategoria(1)},
    new Product { id = 2, name = "Portatil", description = "Portatiles para todo tipo de usuario y necesidad", price = 625, imageUrl = "https://sitechcr.com/wp-content/uploads/2016/06/A15_i781T3GSW10s4.jpg", pcant = 0, category = cat.obtenerCategoria(2)},
    new Product { id = 3, name = "Figuras MHA", description = "Decora tu lugar preferido a tu propio estilo", price = 44, imageUrl = "https://m.media-amazon.com/images/I/61lHgRfaG2L._AC_UF894,1000_QL80_.jpg", pcant = 0, category = cat.obtenerCategoria(6)},
    new Product { id = 4, name = "Hoodie Viñeta", description = "Busca tu diseño personalizado y característico", price = 55, imageUrl = "https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/651172/1.jpg?7281", pcant = 0, category = cat.obtenerCategoria(3)},
    new Product { id = 5, name = "Shonen Jump", description = "Mantente al día con las publicaciones", price = 40, imageUrl = "https://pbs.twimg.com/media/FslBjwGWIAElbQv.jpg:large", pcant = 0, category = cat.obtenerCategoria(5)},
    new Product { id = 6, name = "FFVII", description = "Compra los últimos lanzamientos", price = 49, imageUrl = "https://sm.ign.com/ign_ap/cover/f/final-fant/final-fantasy-vii-remake-part-2_gq8f.jpg", category = cat.obtenerCategoria(4)},
    new Product { id = 7, name = "Kimetsu DVD", description = "Consigue los ultimos lanzamientos", price = 28, imageUrl = "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9111c4a7-8d9d-47c6-adbe-424a9b2dc5f4.jpg", pcant = 0, category = cat.obtenerCategoria(5)},
    new Product { id = 8, name = "Vinyl Record", description = "Encuentra una gran variedad de generos", price = 23, imageUrl = "https://static.dezeen.com/uploads/2022/09/bioplastic-record-pressing_dezeen_2364_col_1.jpg", pcant = 0, category = cat.obtenerCategoria(5)},
    new Product { id = 9, name = "SSD Drives", description = "Actualiza tu PC de la mejor manera", price = 38, imageUrl = "https://c1.neweggimages.com/productimage/nb640/20-250-088-V03.jpg", pcant = 0, category = cat.obtenerCategoria(1)},
    new Product { id = 10, name = "Merch", description = "Mercaderia de tu evento preferido", price = 28, imageUrl = "https://members.asicentral.com/media/32573/tshirtathome-616.jpg", pcant = 0, category = cat.obtenerCategoria(3)},
    new Product { id = 11, name = "Software", description = "Instala las mejores herramientas actuales", price = 40, imageUrl = "https://m.media-amazon.com/images/I/81CucSxYsJL._AC_UF1000,1000_QL80_.jpg", pcant = 0, category = cat.obtenerCategoria(2) },
    new Product { id = 12, name = "Bento Box", description = "Consigue tu caja bento preferida", price = 13, imageUrl = "https://m.media-amazon.com/images/I/51O0hWbj2gL._AC_UF894,1000_QL80_.jpg", pcant = 0, category = cat.obtenerCategoria(6) }
    };

        using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
        {
            connection.Open();

            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    foreach (var product in products)
                    {
                        string insertQuery = @"
                        INSERT INTO products (name, description, price, imageURL, pcant, idCat) 
                        VALUES (@name, @description, @price, @imageURL, @pcant, @idCat)";

                        using (var command = new MySqlCommand(insertQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@name", product.name);
                            command.Parameters.AddWithValue("@description", product.description);
                            command.Parameters.AddWithValue("@price", product.price);
                            command.Parameters.AddWithValue("@imageUrL", product.imageUrl);
                            command.Parameters.AddWithValue("@pcant", product.pcant);
                            command.Parameters.AddWithValue("@idCat", product.category.id);

                            command.ExecuteNonQuery();
                        }
                    }
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                }
            }

            connection.Close();
        }
    }

    public static List<Product> ExtraerProductosDB()
    {
        List<Product> productList = new List<Product>();
        Categories cat = new Categories();

        using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
        {
            connection.Open();

            string selection = "SELECT id, name, description, price, imageUrl, pcant, idCat FROM products";

            using (var command = new MySqlCommand(selection, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        productList.Add(new Product
                        {
                            id = reader.GetInt32(reader.GetOrdinal("id")),
                            name = reader.GetString(reader.GetOrdinal("name")),
                            description = reader.GetString(reader.GetOrdinal("description")),
                            price = reader.GetDecimal(reader.GetOrdinal("price")),
                            imageUrl = reader.GetString(reader.GetOrdinal("imageUrl")),
                            pcant = reader.GetInt32(reader.GetOrdinal("pcant")),
                            category = cat.obtenerCategoria(reader.GetInt32(reader.GetOrdinal("idCat"))),
                        });
                    }
                }
            }
            connection.Close();
        }
        return productList;
    }

    internal void agregarMetodosPago()
    {
        using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
        {
            connection.Open();

            using (var insertCommand = connection.CreateCommand())
            {
                insertCommand.CommandText = @"
                INSERT INTO paymentMethod (id, payment_type, estado)
                VALUES (@id, @payment_type, @estado);";

                insertCommand.Parameters.AddWithValue("@id", 0);
                insertCommand.Parameters.AddWithValue("@payment_type", "Efectivo");
                insertCommand.Parameters.AddWithValue("@estado", 1);
                insertCommand.ExecuteNonQuery();

                insertCommand.Parameters.Clear();
                insertCommand.Parameters.AddWithValue("@id", 1);
                insertCommand.Parameters.AddWithValue("@payment_type", "Sinpe Movil");
                insertCommand.Parameters.AddWithValue("@estado", 1);
                insertCommand.ExecuteNonQuery();
            }
        }
    }

    public int ExtraerIDMax()
    {
        IEnumerable<Product> pList = ExtraerProductosDB();

        if (pList != null && pList.Any())
        {
            int maxId = pList.Max(p => p.id);
            return maxId + 1;
        }
        return 1;
    }

    internal void InsertarVentasPasadas()
    {
        using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
        {
            connection.Open();

            using (var insertCommand = connection.CreateCommand())
            {
                Categories cat = new Categories();
                CartDb cart = new CartDb();

                //creo la primer venta

                Product product1 = new Product
                {
                    id = 1,
                    name = "Gamer tools",
                    description = "Perifericos disponibles de diferentes diseños",
                    price = 30,
                    imageUrl = "https://png.pngtree.com/png-vector/20220725/ourmid/pngtree-gaming-equipment-computer-peripheral-device-png-image_6064567.png",
                    pcant = 0,
                    category = cat.obtenerCategoria(1),
                };

                List<Product> products = new List<Product> { product1 };

                string purchaseNumber = Sale.generarNumeroCompra();

                Sale sale = new Sale(
                    products,
                    "Heredia, San Rafael",
                    31.49m,
                    PaymentMethods.Type.CASH,
                    purchaseNumber
                );

                insertCommand.CommandText = @"
                INSERT INTO sales (purchase_date, total, payment_type, purchase_number)
                VALUES (@purchase_date, @total, @payment_type, @purchase_number);";

                insertCommand.Parameters.AddWithValue("@purchase_number", sale.PurchaseNumber);
                insertCommand.Parameters.AddWithValue("@purchase_date", new DateTime(2024, 6, 3)); //cambio fecha 
                insertCommand.Parameters.AddWithValue("@total", sale.Amount);
                insertCommand.Parameters.AddWithValue("@payment_type", (int)sale.PaymentMethod);
                insertCommand.ExecuteNonQuery();

                insertCommand.Parameters.Clear();

                //inserta linea de venta1
                insertCommand.CommandText = @"
                INSERT INTO salesLine (purchase_id,  product_id, quantity, price)
                VALUES (@purchase_id, @product_id, @quantity, @price);";

                foreach (var product in sale.Products)
                {
                    insertCommand.Parameters.AddWithValue("@purchase_id", sale.PurchaseNumber);
                    insertCommand.Parameters.AddWithValue("@product_id", product.id);
                    insertCommand.Parameters.AddWithValue("@quantity", product.pcant);
                    insertCommand.Parameters.AddWithValue("@price", product.price);
                    insertCommand.ExecuteNonQuery();
                }

                //creo la segunda venta

                Product product2 = new Product
                {
                    id = 2,
                    name = "Portatil",
                    description = "Portatiles para todo tipo de usuario y necesidad",
                    price = 625,
                    imageUrl = "https://sitechcr.com/wp-content/uploads/2016/06/A15_i781T3GSW10s4.jpg",
                    pcant = 0,
                    category = cat.obtenerCategoria(2),
                };

                products = new List<Product> { product2 };

                purchaseNumber = Sale.generarNumeroCompra();

                sale = new Sale(
                    products,
                    "Cartago, Paraiso",
                    705.19m,
                    PaymentMethods.Type.SINPE,
                    purchaseNumber
                );

                insertCommand.Parameters.Clear(); //limpio parametros para reutilizar

                insertCommand.CommandText = @"
                INSERT INTO sales (purchase_date, total, payment_type, purchase_number)
                VALUES (@purchase_date, @total, @payment_type, @purchase_number);";

                insertCommand.Parameters.AddWithValue("@purchase_number", sale.PurchaseNumber);
                insertCommand.Parameters.AddWithValue("@purchase_date", new DateTime(2024, 6, 4));
                insertCommand.Parameters.AddWithValue("@total", sale.Amount);
                insertCommand.Parameters.AddWithValue("@payment_type", (int)sale.PaymentMethod);
                insertCommand.ExecuteNonQuery();

                //inserta linea venta 2

                insertCommand.Parameters.Clear(); //limpio parametros para reutilizar

                insertCommand.CommandText = @"
                INSERT INTO salesLine (purchase_id,  product_id, quantity, price)
                VALUES (@purchase_id, @product_id, @quantity, @price);";

                foreach (var product in sale.Products)
                {
                    insertCommand.Parameters.AddWithValue("@purchase_id", sale.PurchaseNumber);
                    insertCommand.Parameters.AddWithValue("@product_id", product.id);
                    insertCommand.Parameters.AddWithValue("@quantity", product.pcant);
                    insertCommand.Parameters.AddWithValue("@price", product.price);
                    insertCommand.ExecuteNonQuery();
                }//final de la segunda venta

                Product product3 = new Product
                {
                    id = 2,
                    name = "Portatil",
                    description = "Portatiles para todo tipo de usuario y necesidad",
                    price = 625,
                    imageUrl = "https://sitechcr.com/wp-content/uploads/2016/06/A15_i781T3GSW10s4.jpg",
                    pcant = 0,
                    category = cat.obtenerCategoria(2),
                };

                products = new List<Product> { product3 };

                purchaseNumber = Sale.generarNumeroCompra();

                sale = new Sale(
                    products,
                    "Cartago, Paraiso",
                    705.19m,
                    PaymentMethods.Type.SINPE,
                    purchaseNumber
                );

                insertCommand.Parameters.Clear(); //limpio parametros para reutilizar

                insertCommand.CommandText = @"
                INSERT INTO sales (purchase_date, total, payment_type, purchase_number)
                VALUES (@purchase_date, @total, @payment_type, @purchase_number);";

                insertCommand.Parameters.AddWithValue("@purchase_number", sale.PurchaseNumber);
                insertCommand.Parameters.AddWithValue("@purchase_date", new DateTime(2024, 6, 4));
                insertCommand.Parameters.AddWithValue("@total", sale.Amount);
                insertCommand.Parameters.AddWithValue("@payment_type", (int)sale.PaymentMethod);
                insertCommand.ExecuteNonQuery();

                //inserta linea venta 3

                insertCommand.Parameters.Clear(); //limpio parametros para reutilizar

                insertCommand.CommandText = @"
                INSERT INTO salesLine (purchase_id,  product_id, quantity, price)
                VALUES (@purchase_id, @product_id, @quantity, @price);";

                foreach (var product in sale.Products)
                {
                    insertCommand.Parameters.AddWithValue("@purchase_id", sale.PurchaseNumber);
                    insertCommand.Parameters.AddWithValue("@product_id", product.id);
                    insertCommand.Parameters.AddWithValue("@quantity", product.pcant);
                    insertCommand.Parameters.AddWithValue("@price", product.price);
                    insertCommand.ExecuteNonQuery();
                }//final de la tercera venta
            }
        }
    }
}







