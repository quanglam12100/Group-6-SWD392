using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IOrderRepository Orders { get; }
        IProductVariantRepository ProductVariants { get; }
        IToppingRepository Toppings { get; }

        
        Task<int> CommitAsync();

        ITableRepository Tables { get; }

    }
}
