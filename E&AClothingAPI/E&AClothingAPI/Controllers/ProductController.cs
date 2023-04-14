using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using E_AClothingAPI.Data;
using E_AClothingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Product = E_AClothingAPI.Models.Product;

namespace E_AClothingAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly BlobServiceClient _blobServiceClient;
        

        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment, BlobServiceClient blobServiceClient) { 
            _context = context; 
            _webHostEnvironment = webHostEnvironment;
            _blobServiceClient = blobServiceClient;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> Get()
        {
            string contentPath = _webHostEnvironment.ContentRootPath;
            System.Diagnostics.Debug.WriteLine("THIS IS THE FILE PATH " + contentPath);
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {

            var product = await _context.Products.FindAsync(id);
            return product == null ? NotFound() : Ok(product);
        }


        [HttpPost("create")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromForm] Product product)
        {

            product.AfterSalePrice = product.Price;
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            

            try
            {
                var files = Request.Form.Files;
                foreach (IFormFile source in files)
                {
                    string Filename = source.FileName;

                    string Filepath = GetFilePath(product.ProductId.ToString());

                    if (!System.IO.Directory.Exists(Filepath))
                    {
                        System.IO.Directory.CreateDirectory(Filepath);
                    }

                    string imagepath = Filepath + Path.DirectorySeparatorChar + "image.png";

                    if (!System.IO.File.Exists(imagepath))
                    {
                        System.IO.File.Delete(imagepath);
                    }

                    using (FileStream stream = System.IO.File.Create(imagepath))
                    {
                        await source.CopyToAsync(stream);
                        var containerClient = _blobServiceClient.GetBlobContainerClient("products");
                        var blobClient = containerClient.GetBlobClient(product.ProductId.ToString());
                        stream.Position = 0;
                        var blobUploadOptions = new BlobUploadOptions(){ HttpHeaders = new BlobHttpHeaders(){ ContentType = "image/jpeg"} };

                        await blobClient.UploadAsync(stream, blobUploadOptions);
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("ERROR!!!!! " + ex.Message + ex.StackTrace);
                return BadRequest(ex.Message);
            }

            product.ImageUrl = GetImageByProductId(product.ProductId.ToString());
            await _context.SaveChangesAsync();

            AddProductToStripe(product);

            return CreatedAtAction(nameof(GetById), new { id = product.ProductId }, product);
        }


        [HttpPut("update/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromForm] Product product)
        {
            if (id != product.ProductId) return BadRequest();

            if (Request.Form.Files.Count > 0)
            {
                try
                {
                    var files = Request.Form.Files;
                    foreach (IFormFile source in files)
                    {
                        string Filename = source.FileName;

                        string Filepath = GetFilePath(product.ProductId.ToString());

                        if (!System.IO.Directory.Exists(Filepath))
                        {
                            System.IO.Directory.CreateDirectory(Filepath);
                        }

                        string imagepath = Filepath + Path.DirectorySeparatorChar + "image.png";

                        if (!System.IO.File.Exists(imagepath))
                        {
                            System.IO.File.Delete(imagepath);
                        }

                        using (FileStream stream = System.IO.File.Create(imagepath))
                        {
                            await source.CopyToAsync(stream);

                        }
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("ERROR!!!!! " + ex.Message);
                    return BadRequest(ex.Message);
                }
            }

            if (product.SalePercentage > 0)
            {
                decimal saleDecimal = (decimal)product.SalePercentage / (decimal)100.00;
                decimal subtractAmount = product.Price * saleDecimal;
                decimal afterPrice = product.Price - subtractAmount;
                System.Diagnostics.Debug.WriteLine("THIS IS THE AFTER PRICE: " + saleDecimal);
                product.AfterSalePrice = afterPrice;
            }
            else
            {
                product.AfterSalePrice = product.Price;
            }

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var productToDelete = await _context.Products.FindAsync(id);

            if (productToDelete == null) return NotFound();

            _context.Products.Remove(productToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("list/{gender}")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<Product>> GetProductsNoCategory(Product.Gender gender)
        {
            var products = _context.Products.Where(x => x.gender == gender);

            return await products.ToListAsync();
        }

        [HttpGet("list/{gender}/{category}")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<Product>> GetProductsWithCategory(Product.Gender gender, Product.Category category)
        {
            var products = _context.Products.Where(x => x.gender == gender)
                .Where(x => x.category == category);

            return await products.ToListAsync();
        }

        [HttpGet("list/sales")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<Product>> GetProductsOnSale()
        {
            var productsOnSale = _context.Products.Where(x => x.SalePercentage > 0);


            return await productsOnSale.ToListAsync();
        }

        [NonAction]
        private string GetFilePath(string productId)
        {
            return _webHostEnvironment.WebRootPath + Path.DirectorySeparatorChar + "Uploads" + Path.DirectorySeparatorChar + "Products" + Path.DirectorySeparatorChar + productId;
        }

        [NonAction]
        private string GetImageByProductId(string productId)
        {
            string ImageUrl = "";
            string HostUrl = "https://localhost:7185/";
            string Filepath = GetFilePath(productId);
            string Imagepath = Filepath + Path.DirectorySeparatorChar + "image.png";

            if (System.IO.File.Exists(Imagepath))
            {
                ImageUrl = HostUrl + "uploads/products/" + productId + "/image.png";
            }

            return ImageUrl;
        }

        [NonAction]
        private async void AddProductToStripe(Product product)
        {

            var optionsProduct = new ProductCreateOptions
            {
                Name = product.Name,
                Description = product.Description,
            };

            var serviceProduct = new ProductService();
            Stripe.Product prod = serviceProduct.Create(optionsProduct);

            var optionsPrice = new PriceCreateOptions
            {
                UnitAmount = (long?)(product.AfterSalePrice * 100),
                Currency = "usd",
                Product = prod.Id,
                BillingScheme = "per_unit",
            };

            var servicePrice = new PriceService();
            Price price = servicePrice.Create(optionsPrice);
        }
    }
}

