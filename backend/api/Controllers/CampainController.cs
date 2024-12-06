using Microsoft.AspNetCore.Mvc;
using core.Business;
using core.DataBase;
using core.Models;
using Microsoft.AspNetCore.Authorization;

namespace core.Controllers
{
    [ApiController]
    [Route("api/")]
    public class CampainController : ControllerBase
    {
        CampainBusiness camp = new CampainBusiness();

        [HttpPost("campannas")] 
        [Authorize(Roles = "Admin")] 
        public IActionResult SaveCampain([FromBody] Campain campain)
        {
            if (campain == null)
            {
                throw new ArgumentNullException("La campaña esta vacia", nameof(campain));
            }
            camp.SaveCampain(campain);
            return Ok("Campain saved successfully.");
        }

        [HttpGet("campannas")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetCampains()
        {
            try
            {
                IEnumerable<Campain> messages = await camp.GetMessageList();
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("campannas")] 
        [Authorize(Roles = "Admin")] 
        public void DeleteCampains(string message)
        {
            try
            {
                camp.eraseCampain(message);
            }
            catch (Exception)
            {
               throw new ArgumentException("No se pudo ejecutar el borrado");
            }
        }

    }
}