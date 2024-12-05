using System.Data.Common;

namespace core.Models;
public class Product : ICloneable
{
    public int id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public decimal price { get; set; }
    public string imageUrl { get; set; }
    public int pcant { get; set; }
    public Categories.Category category { get; set; }

    public object Clone()
    {
        return new Product
        {
            id = this.id,
            name = this.name,
            description = this.description,
            price = this.price,
            imageUrl = this.imageUrl,
            pcant = this.pcant,
            category = this.category,
        };
    }


}