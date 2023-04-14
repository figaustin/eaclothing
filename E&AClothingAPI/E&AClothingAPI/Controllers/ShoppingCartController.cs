using E_AClothingAPI.Data;
using E_AClothingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_AClothingAPI.Controllers
{
    [Route("api/shoppingcart")]
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShoppingCartController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IEnumerable<ShoppingCart>> Get()
        {
            return await _context.ShoppingCarts.ToListAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var shoppingCart = await _context.ShoppingCarts.FindAsync(id);
            return shoppingCart == null ? NotFound() : Ok(shoppingCart);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(ShoppingCart shoppingCart)
        {
            await _context.ShoppingCarts.AddAsync(shoppingCart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = shoppingCart.ShoppingCartId }, shoppingCart);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, ShoppingCart shoppingCart)
        {
            if (id != shoppingCart.ShoppingCartId) return BadRequest();

            _context.Entry(shoppingCart).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var shoppingCartToDelete = await _context.ShoppingCarts.FindAsync(id);

            if (shoppingCartToDelete == null) return NotFound();

            _context.ShoppingCarts.Remove(shoppingCartToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

