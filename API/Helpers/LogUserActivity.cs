using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

            var memberId = resultContext.HttpContext.User.GetMemberId();

            var dbContext = resultContext.HttpContext.RequestServices
                .GetService<AppDbContext>();

            await dbContext.Members
                .Where(x=> x.Id == memberId)
                .ExecuteUpdateAsync(x => x.SetProperty(m => m.LastActive, DateTime.UtcNow));
        }
    }
}
