using System;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Rewrite;

namespace BMS
{
    public static class UrlRewriteMiddlewareExtensions
    {
        /// <summary>
        /// Redirect from match url (operator url) to new url (operator url)
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseUrlRewriteMiddleware(this IApplicationBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }
            RewriteOptions options = new RewriteOptions();
            options.AddRedirect(@"^en-us/(.*)$", "en-US/$1", 301);
            options.AddRedirect(@"^vi-vn/(.*)$", "vi-VN/$1",301);
            app.UseRewriter(options);

            return app;
        }
    }
}