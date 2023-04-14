using E_AClothingAPI.Data;
using E_AClothingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace E_AClothingAPI.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _webHostEnvironment;

        const string endpointSecret = "whsec_a39f4a1965fb00e120da8885bd262d5f899b394579c356b73134ce2c9a7e118c";

        public OrderController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("payment/create")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreatePaymentIntent()
        {
            var cartId = Request.Cookies["cartId"];

            var cart = await _context.ShoppingCarts.FindAsync(Int32.Parse(cartId));
            if (cart == null) { return NotFound(); }

            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
            {
                Amount = (long?)cart.Total * 100,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            });

            cart.StripePaymentId = paymentIntent.Id;
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreatePaymentIntent), new { clientSecret = paymentIntent.ClientSecret }, paymentIntent);
        }

        [HttpPost("payment/success")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> PaymentSuccess()
        {

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret);

                // Handle the event
                if (stripeEvent.Type == Events.PaymentIntentSucceeded)
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                    var cart = _context.ShoppingCarts.Where(x => x.StripePaymentId == paymentIntent.Id).FirstOrDefault();

                    Order newOrder = new()
                    {
                        Address = paymentIntent.Shipping.Address.Line1,
                        City = paymentIntent.Shipping.Address.City,
                        Region = paymentIntent.Shipping.Address.State,
                        Country = paymentIntent.Shipping.Address.Country,
                        PostalCode = paymentIntent.Shipping.Address.PostalCode,
                        Phone = paymentIntent.Shipping.Phone,
                        IsPaid = true,
                        ShoppingCartId = cart.ShoppingCartId,
                        PaidCart = cart,
                    };


                    await _context.Orders.AddAsync(newOrder);
                    await _context.SaveChangesAsync();

                    return Ok(paymentIntent);
                }
                // ... handle other event types
                else
                {
                    Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
                }

                return Ok();
            }
            catch (StripeException e)
            {
                return BadRequest();
            }


        }

        [HttpPost("payment/complete")]
        public async Task<IActionResult> PaymentComplete()
        {
            var cartId = Request.Cookies["cartId"];

            if (cartId == null) { return NotFound(); }

            CookieOptions cookieOptions = new CookieOptions()
            {
                Expires = DateTime.Now.AddDays(-1),
                HttpOnly = false,
                SameSite = SameSiteMode.Lax,
            };

            HttpContext.Response.Cookies.Append("cartId", "", cookieOptions);

            return Ok();
        }
    }
}
