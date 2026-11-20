using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class AdminPasswordFilter(IConfiguration configuration) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var configuredPassword = configuration["AdminPassword"];
        var suppliedPassword = context.HttpContext.Request.Headers["X-Admin-Password"].ToString();

        if (string.IsNullOrEmpty(configuredPassword) ||
            !CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(suppliedPassword),
                Encoding.UTF8.GetBytes(configuredPassword)))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        await next();
    }
}
