namespace core.Models;

public abstract class PaymentMethods{
    public enum Type {CASH=0,SINPE=1}
    public Type PaymentType { get; set; }
    public PaymentMethods(PaymentMethods.Type paymentType)
    {
        PaymentType= paymentType;

    }

    private static Sinpe pagoSinpe=new Sinpe();
    private static Cash pagoCash=new Cash();

    public static PaymentMethods Find(Type type)
    {
        switch (type)
        {
            case Type.CASH:
                return pagoCash;
            case Type.SINPE:
                return pagoSinpe;
            default:
               throw new NotImplementedException("Payment method not configurated");
        }
    }

    public static PaymentMethods SetPaymentType(Type type)
    {
        return Find(type);
    }
}

public sealed class Sinpe:PaymentMethods{
    public Sinpe(): base(PaymentMethods.Type.SINPE)
    {

    }
}

public sealed class Cash:PaymentMethods{
    public Cash(): base(PaymentMethods.Type.CASH)
    {

    }
}