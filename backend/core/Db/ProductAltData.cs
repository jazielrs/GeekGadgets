using System;
using System.Data.Common;
using System.IO.Compression;
using MySqlConnector;
using core.Models;
using System.Security.Cryptography;
namespace core.DataBase;

public sealed class ProductAltData 
{
    public async Task InsertarProductoAsync(Product product, ProductAltLogic.nuevoProuductoD nuevoProuducto) //usa el delegate 
    {
        if (product == null)
        {
            throw new ArgumentException("El producto a agregar se encuentra vacio");
        }
        if(nuevoProuducto == null){
            throw new ArgumentNullException("La funcion delegate no se ha enviado por parametro");
        }
        using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
        {
            await connection.OpenAsync();

            using (var transaction = await connection.BeginTransactionAsync())
            {
                try
                {
                    string insertQuery = @"
                INSERT INTO products (name, description, price, imageURL, pcant, idCat) 
                VALUES (@name, @description, @price, @imageURL, @pcant, @idCat)";

                    using (var command = new MySqlCommand(insertQuery, connection, transaction))
                    {
                        command.Parameters.AddWithValue("@name", product.name);
                        command.Parameters.AddWithValue("@description", product.description);
                        command.Parameters.AddWithValue("@price", product.price);
                        command.Parameters.AddWithValue("@imageURL", product.imageUrl);
                        command.Parameters.AddWithValue("@pcant", product.pcant);
                        command.Parameters.AddWithValue("@idCat", product.category.id);
                        await command.ExecuteNonQueryAsync();
                    }

                    await transaction.CommitAsync();
                    nuevoProuducto(product); 
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                }
            }

            await connection.CloseAsync();
        }
    }
}