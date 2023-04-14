using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace E_AClothingAPI.Models
{
    public class ShoppingCart
    {
        public int ShoppingCartId { get; set; }

        [ValidateNever]
        public decimal Total { get; set; }

        [ValidateNever]
        public string? StripePaymentId { get; set; }

        [ValidateNever]
        public IList<ProductInCart> ProductsInCarts { get; set; }

        public Order Order { get; set; }

        public ShoppingCart() { }
    }
}
