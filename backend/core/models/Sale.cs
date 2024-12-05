using System.Text;

namespace core.Models;
public sealed class Sale
{
    public IEnumerable<Product> Products { get; }
    public string Address { get; }
    public decimal Amount { get; }
    public PaymentMethods.Type PaymentMethod { get; }
    public string PurchaseNumber { get; }

    public Sale(IEnumerable<Product> products, string address, decimal Amount, PaymentMethods.Type paymentMethod, string purchaseNumber)
    {
        this.Products = products;
        this.Address = address;
        this.Amount = Amount;
        this.PaymentMethod = paymentMethod;
        this.PurchaseNumber = purchaseNumber;
    }

    internal static string generarNumeroCompra()
    {
        Random random = new Random();
        const string chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        string purchaseNumber = "";
        for (int i = 0; i < 3; i++)
        {
            purchaseNumber += chars[random.Next(chars.Length)];
        }
        purchaseNumber += random.Next(000, 990);
        return purchaseNumber;
        
    }

}