namespace core.Models;

public class PaymentMethodAlt
{
    public int id { get; private set; }
    public string payment_type { get; private set; }
    public int estado { get; private set; }

    public PaymentMethodAlt(int id, string payment_type, int estado){
        this.id = id;
        this.payment_type = payment_type;
        this.estado = estado;
    }

}