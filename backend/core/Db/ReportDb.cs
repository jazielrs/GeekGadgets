using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks; 
using core.Models;

namespace core.DataBase
{
    public class ReportDb
    {
        public static async Task<IEnumerable<Report>> ExtraerVentasDiariasAsync(DateTime date) 
        { 
            List<Report> salesList = new List<Report>();

            using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
            {
                await connection.OpenAsync();

                string selection = "SELECT s.purchase_number, s.purchase_date, s.total, s.payment_type, sl.quantity " +
                                   "FROM sales s " +
                                   "JOIN salesLine sl ON s.purchase_number = sl.purchase_id";

                using (var command = new MySqlCommand(selection, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            string purchaseNumber = reader.GetString("purchase_number");

                            if (!reader.IsDBNull(reader.GetOrdinal("purchase_date")))
                            {
                                DateTime purchaseDate = reader.GetDateTime("purchase_date");
                                decimal total = reader.GetDecimal("total");
                                int pcantidad = reader.GetInt32("quantity");
 
                                if (purchaseDate.Date == date.Date)
                                {
                                    Report report = new Report(purchaseNumber, purchaseDate, total, pcantidad);
                                    salesList.Add(report);
                                }
                            }
                            else
                            {
                                throw new ArgumentException("La fecha de compra es nula.");
                            }
                        }
                    }
                }
            }

            IEnumerable<Report> salesListDaily = salesList;

            return salesListDaily;
        }

        public static async Task<IEnumerable<Report>> ExtraerVentasSemanalAsync(DateTime selectedDate)
        {
            List<Report> salesList = new List<Report>();

            using (var connection = new MySqlConnection(Storage.Instance.ConnectionStringMyDb))
            {
                await connection.OpenAsync(); 

                string selection = "SELECT s.purchase_number, s.purchase_date, s.total, s.payment_type, sl.quantity " +
                                   "FROM sales s " +
                                   "JOIN salesLine sl ON s.purchase_number = sl.purchase_id";

                using (var command = new MySqlCommand(selection, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {                            
                            if (!reader.IsDBNull(reader.GetOrdinal("purchase_date")))
                            {
                                string purchaseNumber = reader.GetString("purchase_number");
                                DateTime purchaseDate = reader.GetDateTime("purchase_date");
                                decimal total = reader.GetDecimal("total");
                                int pcantidad = reader.GetInt32("quantity");
                            

                                DateTime startDate = purchaseDate.AddDays(-(int)purchaseDate.DayOfWeek);
                                DateTime endDate = startDate.AddDays(6);

                                if (selectedDate >= startDate && selectedDate <= endDate)
                                {
                                    Report report = new Report(purchaseNumber, purchaseDate, total, pcantidad);
                                    salesList.Add(report);
                                }
                                }else
                                {
                                    throw new ArgumentException("La fecha de compra es nula.");
                                }
                        
                            }
                        }
                    }
                }

            IEnumerable<Report> salesListWeekly = salesList;

            return salesListWeekly;
        }
    }
}