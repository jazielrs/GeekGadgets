using Microsoft.AspNetCore.Mvc;
using core.Business;
using core.DataBase;
using core.Models;
using Microsoft.AspNetCore.Authorization;


namespace geekstore_api.Controllers
{
    [Route("api/")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private StoreLogic store = new StoreLogic();

        [HttpPost("cart")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateCart([FromBody] Cart cart)
        {
            if (cart == null)
            {
                throw new ArgumentNullException("El carrito no se no existe", nameof(cart));
            }
            if(cart.Address == null){
                throw new ArgumentNullException("La direccion no se encuentra definida para la compra", nameof(cart));
            }
            var sale = await store.PurchaseAsync(cart);
            var numeroCompra = sale.PurchaseNumber;
            var response = new { numeroCompra };
            return Ok(response);
        }
    }
}