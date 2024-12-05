using Microsoft.AspNetCore.Mvc;
using core.Business;
using core.DataBase;
using core.Models;
using Microsoft.AspNetCore.Authorization;


namespace geekstore_api.Controllers
{
    [Route("api/")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        StoreDb store = new StoreDb();
        Products prod = new Products();
        [HttpGet("product")]
        [Authorize(Roles = "Admin")]
        public Store GetStore()
        {
            return Store.Instance;
        }


        [HttpPost("product")]
        [Authorize(Roles = "Admin")]
        public IActionResult SaveProducts([FromBody] ProductAlt product)
        {
            var id = store.ExtraerIDMax();
            product.id = id;
            ProductAltLogic productLogic = new ProductAltLogic();
            productLogic.AddProduct(product);
            return Ok(new { productId = product.id, message = "Product saved successfully." });
        }
    }

}
