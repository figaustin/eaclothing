using E_AClothingAPI.Data;
using E_AClothingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_AClothingAPI.Controllers
{
    [Route("api/usercart")]
    [ApiController]
    public class ProductInCartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductInCartController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _webHostEnvironment = webHostEnvironment;
        }


        [HttpGet]
        [Route("all")]
        public async Task<IEnumerable<ProductInCart>> Get()
        {
            return await _context.ProductsInCarts.ToListAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ProductInCart), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var productInCart = await _context.ProductsInCarts.FindAsync(id);

            return productInCart == null ? NotFound() : Ok(productInCart);
        }

        [HttpPost]
        [Route("add/{productId}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> AddToCart(int productId, [FromForm] int quantity, [FromForm] ProductInCart.Size size)
        {
            var cookie = Request.Cookies["cartId"];

            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

            CookieOptions cookieOptions = new CookieOptions()
            {
                Expires = DateTime.Now.AddDays(1),
                HttpOnly = false,
                SameSite = SameSiteMode.Lax,
            };

            if (cookie == null)
            {
                var newCart = await _context.AddAsync(new ShoppingCart());

                await _context.SaveChangesAsync();

                var cartId = newCart.Entity.ShoppingCartId;

                ProductInCart productInCart = new()
                {
                    ShoppingCartId = cartId,
                    ShoppingCart = newCart.Entity,
                    ProductId = productId,
                    Product = product,
                    Quantity = quantity,
                    size = size,

                };

                await _context.ProductsInCarts.AddAsync(productInCart);
                await _context.SaveChangesAsync();

                HttpContext.Response.Cookies.Append("cartId", cartId.ToString(), cookieOptions);

                await UpdateCartTotal(cartId);
                return CreatedAtAction(nameof(GetById), new { shoppingCartId = productInCart.ShoppingCartId, productId }, productInCart);
            }
            else
            {
                var shoppingCart = await _context.ShoppingCarts.FindAsync(Int32.Parse(cookie));
                ProductInCart productIncart = new()
                {
                    ShoppingCartId = Int32.Parse(cookie),
                    ShoppingCart = shoppingCart,
                    ProductId = productId,
                    Product = product,
                    Quantity = quantity,
                    size = size,
                };
                await _context.ProductsInCarts.AddAsync(productIncart);

                await _context.SaveChangesAsync();

                await UpdateCartTotal(Int32.Parse(cookie));

                return CreatedAtAction(nameof(GetById), new { shoppingCartId = productIncart.ShoppingCartId, productId }, productIncart);
            }
        }

        [HttpPut("edit/{productId}")]
        [ProducesResponseType(typeof(ProductInCart), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditItemInCart(int productId, ProductInCart productInCart)
        {
            var cartId = Request.Cookies["cartId"];

            if (cartId == null) return BadRequest();

            if (productId != productInCart.ProductId) return BadRequest();

            _context.Entry(productInCart).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await UpdateCartTotal(Int32.Parse(cartId));

            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(ProductInCart), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Route("view")]
        public async Task<IEnumerable<ShoppingCart>> ViewCart()
        {
            var cartId = Request.Cookies["cartId"];

            if (cartId == null)
            {
                return Enumerable.Empty<ShoppingCart>();
            }

            var shoppingCart = await _context.ShoppingCarts
                .FirstOrDefaultAsync(m => m.ShoppingCartId == Int32.Parse(cartId));
            if (shoppingCart == null)
            {
                return Enumerable.Empty<ShoppingCart>();
            }

            var dbContext = await _context.ShoppingCarts.Include(x => x.ProductsInCarts).ThenInclude(x => x.Product).Where(x => x.ShoppingCartId == Int32.Parse(cartId)).ToListAsync();


            return dbContext;
        }

        [HttpDelete]
        [Route("remove/{productId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {

            var cartId = Request.Cookies["cartId"];

            var cart = await _context.ShoppingCarts.FindAsync(Int32.Parse(cartId));

            var productToDelete = _context.ProductsInCarts.Include(x => x.Product).Where(x => x.ShoppingCartId == Int32.Parse(cartId)).Where(x => x.ProductId == productId);

            if (productToDelete == null) return NotFound();

            var delete = _context.ProductsInCarts.Remove(productToDelete.First());

            await _context.SaveChangesAsync();

            await UpdateCartTotal(Int32.Parse(cartId));

            return NoContent();
        }

        [NonAction]
        public async Task<IActionResult> UpdateCartTotal(int cartId)
        {
            var cart = await _context.ShoppingCarts.FindAsync(cartId);

            var productsInCart = _context.ProductsInCarts.Include(x => x.Product).Where(x => x.ShoppingCartId == cartId);

            if (cart == null) return NoContent();

            decimal newTotal = 0;

            foreach (var p in productsInCart)
            {
                decimal temp = p.Product.AfterSalePrice * p.Quantity;
                newTotal += temp;
            }

            cart.Total = newTotal;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
