using MySqlConnector;

namespace core.Models
{

    public class Report 
    {
        public string purchaseNumber {get; set;}
        public DateTime purchase_date {get; set;}
        public decimal total {get; set;}
        public int pcantidad {get; set;}

        public Report(string purchaseNumber, DateTime purchase_date, decimal total, int cantidad){
           this.purchaseNumber = purchaseNumber;
           this.purchase_date = purchase_date;
           this.total = total;
           this.pcantidad = cantidad;
        } 
       
    }
  
}

