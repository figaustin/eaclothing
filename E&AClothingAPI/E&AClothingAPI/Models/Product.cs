using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace E_AClothingAPI.Models
{
    public class Product
    {
        public enum Category
        {
            HAT,
            JACKET,
            TOP,
            BOTTOMS,
            SHOES,
            ACCESSORY
        }

        public enum Gender
        {
            NEUTRAL,
            MEN,
            WOMEN
        }

        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [EnumDataType(typeof(Category))]
        public Category category { get; set; }

        [EnumDataType(typeof(Gender))]
        public Gender gender { get; set; }

        public decimal Price { get; set; }

        [ValidateNever]
        public string? ImageUrl { get; set; }

        [ValidateNever]
        public IList<ProductInCart> ProductsInCarts { get; set; }

        [ValidateNever]
        public int SalePercentage { get; set; }

        [ValidateNever]
        public decimal AfterSalePrice { get; set; }

        public Product()
        {
            SalePercentage = 0;
        }
    }
}
