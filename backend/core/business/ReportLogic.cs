
using core.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace core.Business{
public sealed class ReportLogic
{
    public ReportLogic() { }

   public static IEnumerable<object> TransformarDatos(IEnumerable<Report> sales) 
   {
    if (sales == null)
    {
        throw new ArgumentNullException(nameof(sales), "The sales list cannot be null.");
    }

    List<object> responseData = new List<object>();

    foreach (var report in sales)
    {
        if (report.purchaseNumber != null && report.purchase_date != null && report.total != null)
        {
            var data = new
            {
                purchaseNumber = report.purchaseNumber,
                purchaseDate = report.purchase_date,
                total = report.total,
                dayOfWeek = (int)report.purchase_date.DayOfWeek
            };

            responseData.Add(data);
        }
        else
        {
            throw new ArgumentException("Invalid report data: One or more required fields are null.");
        }
    }

    IEnumerable<object> responseList = responseData;

    return responseList;
    }
   
    }
}