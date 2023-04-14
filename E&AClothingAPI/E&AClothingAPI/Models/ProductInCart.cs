using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace E_AClothingAPI.Models
{
    public class ProductInCart
    {
        public enum Size
        {
            S,
            M,
            L,
            XL,
            XXL,
        }

        [ValidateNever]
        public int ShoppingCartId { get; set; }

        [ValidateNever]
        public ShoppingCart ShoppingCart { get; set; }

        [ValidateNever]
        public int ProductId { get; set; }

        [ValidateNever]
        public Product Product { get; set; }

        [Required]
        public Size size { get; set; }

        [Range(1, 5, ErrorMessage = "Quantity must be between 1 and 5")]
        public int Quantity { get; set; }
    }
}
