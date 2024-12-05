using System.Collections;
using System.Diagnostics;
using System.Security.AccessControl;
using core;
using core.DataBase;
using core.Models;

public class PaymentLogic
{
    PaymentDb db = new PaymentDb();
    public async Task<IEnumerable<PaymentMethodAlt>> GetPaymentMethods()
    {
        try
        {
            IEnumerable<PaymentMethodAlt> metodosPago = await db.GetMetodosPago();
            return metodosPago;
        }
        catch (Exception ex)
        {
            throw new ArgumentException("Error al obtener los mensajes", ex);
        }
    }

    public async void ModifyPaymentMethods(string payment_type, int estado)
    {
        if(payment_type == null){
            throw new ArgumentException("Mensaje no valido");
        }
        if(estado != 0 && estado != 1){
            throw new ArgumentException("Estado no valido");
        }
        try
        {
            await db.ModificarEstado(payment_type, estado);
        }
        catch (Exception ex)
        {
            throw new ArgumentException("Error al obtener los mensajes", ex);
        }
    }
}