using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySqlConnector;
using core.Models;

namespace core.DataBase
{
    public sealed class CampainDb
    {
        public async Task GuardarMensajeAsync(Campain campain)
        {
            if (campain == null)
            {
                throw new ArgumentException("La campaña a agregar está vacía");
            }

            using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
            {
                await connection.OpenAsync();

                using (var transaction = await connection.BeginTransactionAsync())
                {
                    try
                    {
                        string insertQuery = @"
                            INSERT INTO campain (sender, message_content, status) 
                            VALUES (@sender, @message_content, @status)";

                        using (var command = new MySqlCommand(insertQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@sender", campain.Sender);
                            command.Parameters.AddWithValue("@message_content", campain.MessageContent);
                            command.Parameters.AddWithValue("@status", campain.Status);
                            await command.ExecuteNonQueryAsync();
                        }

                        await transaction.CommitAsync();
                    }
                    catch (Exception)
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }

                await connection.CloseAsync();
            }
        }

        public async Task<IEnumerable<Campain>> GetMessages()
        {
            List<Campain> messages = new List<Campain>();
            try
            {
                using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT id, sender, message_content, status
                        FROM campain";

                    using (var command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                int id = (int)reader["id"];
                                string sender = reader["sender"].ToString();
                                string messageContent = reader["message_content"].ToString();
                                int status = (int)reader["status"];

                                Campain campain = new Campain(sender, messageContent, status);
                                messages.Add(campain);
                            }
                        }
                    }

                    await connection.CloseAsync();
                }
            }
            catch (Exception)
            {
                throw new ArgumentException("Error al extraer las campañas de la db");
            }
            return messages;
        }

        public async Task BorradoLogico(string message)
        {
            if(message == null){
                throw new ArgumentException("Mensaje no valido");
            }
            try
            {
                using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
                {
                    await connection.OpenAsync();

                    string updateQuery = @"
                        UPDATE campain
                        SET status = 0
                        WHERE message_content = @message";

                    using (var command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@message", message);
                        await command.ExecuteNonQueryAsync();
                    }

                    await connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
               throw new ArgumentException($"Error al realizar el borrado lógico de la campaña con ID {message}: {ex.Message}");
            }
        }
    }
}