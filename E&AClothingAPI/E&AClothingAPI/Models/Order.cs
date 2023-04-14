using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace E_AClothingAPI.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }

        [ValidateNever]
        public Boolean IsPaid { get; set; }

        [ValidateNever]
        public int ShoppingCartId { get; set; }
        [ValidateNever]
        public ShoppingCart PaidCart { get; set; }
    }
}
