using E_AClothingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace E_AClothingAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ProductInCart>().HasKey(psc => new { psc.ShoppingCartId, psc.ProductId });
        }

        public DbSet<E_AClothingAPI.Models.Product> Products { get; set; }
        public DbSet<E_AClothingAPI.Models.ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<E_AClothingAPI.Models.ProductInCart> ProductsInCarts { get; set; }

        public DbSet<E_AClothingAPI.Models.Order> Orders { get; set; }
    }
}
