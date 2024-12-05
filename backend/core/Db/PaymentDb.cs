using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySqlConnector;
using core.Models;

namespace core.DataBase
{
    public sealed class PaymentDb
    {
        public async Task<IEnumerable<PaymentMethodAlt>> GetMetodosPago()
        {
            List<PaymentMethodAlt> paymentMethodOptions = new List<PaymentMethodAlt>();
            try
            {
                using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT id, payment_type, estado
                        FROM paymentMethod";

                    using (var command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                int id = (int)reader["id"];
                                string paymentType = reader["payment_type"].ToString();
                                int estado = (int)reader["estado"];

                                PaymentMethodAlt metodoP = new PaymentMethodAlt(id, paymentType, estado);
                                paymentMethodOptions.Add(metodoP);
                            }
                        }
                    }

                    await connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Error al extraer los métodos de pago de la base de datos: " + ex.Message);
            }
            return paymentMethodOptions;
        }

        public async Task ModificarEstado(string payment_type, int estado)
        {
            if (string.IsNullOrEmpty(payment_type))
            {
                throw new ArgumentException("El tipo de pago no puede ser nulo o vacío", nameof(payment_type));
            }
            try
            {
                using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
                {
                    await connection.OpenAsync();

                    string updateQuery = @"
                        UPDATE paymentMethod
                        SET estado = @estado
                        WHERE payment_type = @payment_type";

                    using (var command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@estado", estado);
                        command.Parameters.AddWithValue("@payment_type", payment_type);
                        await command.ExecuteNonQueryAsync();
                    }

                    await connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"Error al modificar el estado del método de pago '{payment_type}': {ex.Message}");
            }
        }
    }
}
