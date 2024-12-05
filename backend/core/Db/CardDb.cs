using MySqlConnector;
using System;
using System.Threading.Tasks;
using core.Models;

namespace core.DataBase
{
    public class CartDb
    {
        public async Task saveAsync(Sale saleTask)
        {
            using (MySqlConnection connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
            {
                await connection.OpenAsync().ConfigureAwait(false);

                using (MySqlCommand command = connection.CreateCommand())
                {
                    using (var transaction = await connection.BeginTransactionAsync().ConfigureAwait(false))
                    {
                        try
                        {
                            command.Transaction = transaction;
                            await InsertSaleAsync(command, saleTask).ConfigureAwait(false);
                            await InsertSaleLinesAsync(command, saleTask).ConfigureAwait(false);
                            await transaction.CommitAsync().ConfigureAwait(false);
                        }
                        catch (Exception)
                        {
                            await transaction.RollbackAsync().ConfigureAwait(false);
                        }
                    }
                }
            }
        }

        public async Task InsertSaleAsync(MySqlCommand command, Sale sale) 
        {
            command.CommandText = @"
                INSERT INTO sales (purchase_date, total, payment_type, purchase_number)
                VALUES (@purchase_date, @total, @payment_type, @purchase_number);";
            
            command.Parameters.AddWithValue("@purchase_number", sale.PurchaseNumber);
            command.Parameters.AddWithValue("@purchase_date", DateTime.Now);
            command.Parameters.AddWithValue("@total", sale.Amount);
            command.Parameters.AddWithValue("@payment_type", (int)sale.PaymentMethod);

            await command.ExecuteNonQueryAsync().ConfigureAwait(false);
            command.Parameters.Clear(); 
        }

        internal async Task InsertSaleLinesAsync(MySqlCommand command, Sale sale) 
        {
            foreach (var product in sale.Products)
            {
                command.CommandText = @"
                    INSERT INTO salesLine (purchase_id,  product_id, quantity, price)
                    VALUES (@purchase_id, @product_id, @quantity, @price);"; 

                command.Parameters.AddWithValue("@purchase_id", sale.PurchaseNumber);
                command.Parameters.AddWithValue("@product_id", product.id);
                command.Parameters.AddWithValue("@quantity", product.pcant); 
                command.Parameters.AddWithValue("@price", product.price);

                await command.ExecuteNonQueryAsync().ConfigureAwait(false);
                command.Parameters.Clear(); 
            }
        }
    }
}