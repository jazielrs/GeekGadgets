using Microsoft.AspNetCore.Mvc;
using core.Business;
using core.DataBase;
using core.Models;
using Microsoft.AspNetCore.Authorization;

namespace core.Controllers
{
    [ApiController]
    [Route("api/")]
    public class PagoController : ControllerBase 
    {
        PaymentLogic payment = new PaymentLogic();

        [HttpGet("pago")] 
        [AllowAnonymous] 
        public async Task<IActionResult> GetPago()
        {
            try
            {
                IEnumerable<PaymentMethodAlt> methods = await payment.GetPaymentMethods();
                return Ok(methods);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("pago")] 
        [Authorize(Roles = "Admin")] 
        public void ModificarPago(string payment_type, int estado)
        {
            try
            {
               payment.ModifyPaymentMethods(payment_type, estado);
            }
            catch (Exception)
            {
               throw new ArgumentException("No se pudo ejecutar la modificacion del metodo");
            }
        }

    }
}
