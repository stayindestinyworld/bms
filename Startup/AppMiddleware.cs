using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BMS.Const;
using BMS.Services;
using BMS.Session;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BMS
{
    public class LanguageRouteConstraint : IRouteConstraint
    {
        public bool Match(HttpContext httpContext, IRouter route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {

            if (!values.ContainsKey("lang"))
                return false;

            var culture = values["lang"].ToString();
            return culture == "vi" || culture == "en";
        }
    }
    public class RouteCultureProvider : IRequestCultureProvider
    {
        private CultureInfo defaultCulture;
        private CultureInfo defaultUICulture;

        public RouteCultureProvider(RequestCulture requestCulture)
        {
            this.defaultCulture = requestCulture.Culture;
            this.defaultUICulture = requestCulture.UICulture;
        }

        public Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
        {
            //Parsing language from url path, which looks like "/en/home/index"
            PathString url = httpContext.Request.Path;

            // Test any culture in route
            if (url.ToString().Length <= 1)
            {
                // Set default Culture and default UICulture
                return Task.FromResult<ProviderCultureResult>(new ProviderCultureResult(this.defaultCulture.TwoLetterISOLanguageName, this.defaultUICulture.TwoLetterISOLanguageName));
            }

            var parts = httpContext.Request.Path.Value.Split('/');
            var culture = parts[1];

            // Test if the culture is properly formatted
            if (!Regex.IsMatch(culture, @"^[a-z]{2}(-[A-Z]{2})*$"))
            {
                // Set default Culture and default UICulture
                return Task.FromResult<ProviderCultureResult>(new ProviderCultureResult(this.defaultCulture.TwoLetterISOLanguageName, this.defaultUICulture.TwoLetterISOLanguageName));
            }

            // Set Culture and UICulture from route culture parameter
            return Task.FromResult<ProviderCultureResult>(new ProviderCultureResult(culture, culture));
        }
    }

   
    public class CultureViewExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            return viewLocations.Select(s => s.Replace("%1", CultureInfo.CurrentUICulture.Name));
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
            context.Values.Add("Language", CultureInfo.CurrentUICulture.Name);
        }
    }



    #region Get Profile Data Middleware
    public class ProfileMiddleware
    {
        private readonly RequestDelegate next;

        public ProfileMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            #region check language from url 
            var language = "vi";
            var returnUrl = string.IsNullOrEmpty(httpContext.Request.Path) ? "~/" : $"~{httpContext.Request.Path.Value}";
            string[] arrUrl = returnUrl.Split('/');
            if (arrUrl.Length>1&& arrUrl[1].ToLower()=="en")
            {
                language = "en";
            }
           
            FeatureMenu.language = language;
            //#region Update Response Language Cookies base on param language
            httpContext.Response.Cookies.Append(
                  CookieRequestCultureProvider.DefaultCookieName,
                  CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(language)),
                  new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );
            //#endregion
            #endregion
            if (AppHttpContext.Current.User != null && AppHttpContext.Current.User.Identity != null && AppHttpContext.Current.User.Identity.IsAuthenticated)
            {
                var userProfile = SessionHelper.UserProfile;

                #region Validate user profile 
                var services = AppHttpContext.Current.RequestServices;
                var _accountService = (IAccountService)services.GetService(typeof(IAccountService));
                if (userProfile == null)
                {
                    //var phoneCodeClaim = AppHttpContext.Current.User.Claims.FirstOrDefault(u => u.Type == "PhoneCode");
                    //var phoneCodeNumberClaim = AppHttpContext.Current.User.Claims.FirstOrDefault(u => u.Type == "PhoneNumber");
                    string userID = AppHttpContext.Current.User.Identities.First().Claims.First(u => u.Type == "sub").Value;
                    if (!string.IsNullOrWhiteSpace(userID))
                    {
                        var userProfile1 = _accountService.GetUserFullProfile(userID).Result;
                        if (userProfile1 != null)
                        {
                            //update default user profile
                            if (string.IsNullOrWhiteSpace(userProfile1.profileImageUrl))
                            {
                                userProfile1.profileImageUrl = "/Images/poster.png";
                            }
                            if (userProfile1.featurePermissions == null) { userProfile1.featurePermissions = new List<FeaturePermission>(); }
                            SessionHelper.UserProfile = userProfile1;
                            //render menu base on user profile feature permission
                            FeatureMenu.applyPermission(userProfile1);
                        }
                        else
                        {
                            userProfile1 = new UserProfile();
                            SessionHelper.UserProfile = userProfile1;
                            FeatureMenu.applyPermission(userProfile1);
                        }
                    }
                }
                else
                {
                    //render menu base on user profile feature permission
                    if (userProfile.featurePermissions == null) userProfile.featurePermissions = new List<FeaturePermission>();
                    FeatureMenu.applyPermission(userProfile);
                }
                #endregion
                #region Refresh API Token
                await _accountService.GetAccessToken();
                #endregion
            }
            else {
                #region Get Client API Access Token
                var services = AppHttpContext.Current.RequestServices;
                var _accountService = (IAccountService)services.GetService(typeof(IAccountService));
                await _accountService.GetAccessToken();
                #endregion
            }

            await next(httpContext);
             // proceed to next...
           
        }
    }
    public static class ProfilesMiddlewareExtensions
    {
        public static IApplicationBuilder UseProfileMiddleware(this IApplicationBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }


            return app.UseMiddleware<ProfileMiddleware>();
        }
    }

    #endregion

    //Basic authen base on session
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock
            )
            : base(options, logger, encoder, clock)
        {

        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {

            ////User user = null;
            //try
            //{
            //    var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            //    var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            //    var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':');
            //    var username = credentials[0];
            //    var password = credentials[1];
            //    user = await _userService.Authenticate(username, password);
            //}
            //catch
            //{
            //    return AuthenticateResult.Fail("Invalid Authorization Header");
            //}
            var userProfile = SessionHelper.UserProfile;
            if (userProfile == null)
            {
                return AuthenticateResult.Fail("Invalid Authenticate");
            }
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, userProfile.userProfileID.ToString()),
                new Claim(ClaimTypes.Name, userProfile.fullName),
                new Claim("PhoneCode", userProfile.phoneCode),
                new Claim("PhoneNumber", userProfile.phoneNumber),
            };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        protected override Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            string returnUrl = Context.Request.Path;
            Context.Response.Redirect("/account/smslogin?returnUrl=" + returnUrl); // redirect to your login page
            return Task.CompletedTask;
        }
    }


    #region Request Response 
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public RequestResponseLoggingMiddleware(RequestDelegate next,
                                                ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory
                      .CreateLogger<RequestResponseLoggingMiddleware>();
        }
    }
    public static class RequestResponseLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestResponseLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestResponseLoggingMiddleware>();
        }
    }
    #endregion
}