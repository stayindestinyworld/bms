using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BMS.Session;
using IdentityModel.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Localization.Routing;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Rotativa.AspNetCore;
using StackExchange.Redis;

namespace BMS
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.RegisterAppService();
            services.RegisterConfigs(Configuration);
            //add single httpaccser
            services.AddHttpContextAccessor();
            //apply httpclient to call api from backend
            services.AddHttpClient();
            services.AddHealthChecks();
            if (!BMS.AppSettings.Current.IsLocal)
            {
                //Add data protect to apply loading ballancing
                //apply dataprotect when user submit from server and 
                services.AddDataProtection()
                    .SetApplicationName("SIWBMS")
                    .SetDefaultKeyLifetime(TimeSpan.FromDays(14))
                    .UseCryptographicAlgorithms(
                        new AuthenticatedEncryptorConfiguration()
                        {
                            EncryptionAlgorithm = EncryptionAlgorithm.AES_256_CBC,
                            ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
                        }
                    )
                    .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(Configuration["SessionSettings:Redis"]), "SIW-DataProtection-Keys");

                //Add distributed cache service backed by Redis cache
                services.AddStackExchangeRedisCache(o =>
                {
                    o.Configuration = Configuration["SessionSettings:Redis"];
                });
            }

            //use to forward header by load ballancing from NINgx proxy
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                options.RequireHeaderSymmetry = false;
                // Only loopback proxies are allowed by default.
                // Clear that restriction because forwarders are enabled by explicit 
                // configuration.
                options.ForwardLimit = null;
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
            });

            services.AddSession(o =>
            {
                o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                o.Cookie.Name = "SIW_" + BMS.AppSettings.Current.Environment + "_Session";
                o.Cookie.IsEssential = true;
                o.Cookie.HttpOnly = true;
                o.Cookie.SameSite = SameSiteMode.Lax;
                o.IdleTimeout = TimeSpan.FromDays(1);
            });


          


            services.AddAntiforgery(options =>
            {
                options.Cookie.Name = "_af";
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.None;
                options.HeaderName = "X-XSRF-TOKEN";
            });
            services.AddMvc()
                    .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                    .AddDataAnnotationsLocalization();

            services.Configure<RequestLocalizationOptions>(options =>
            {
                            var supportedCultures = new List<CultureInfo>
                            {
                                new CultureInfo("vi"),
                                new CultureInfo("en"),
                            };

                            options.DefaultRequestCulture = new RequestCulture(culture: "vi", uiCulture: "vi");
                            options.SupportedCultures = supportedCultures;
                            options.SupportedUICultures = supportedCultures;

                            options.RequestCultureProviders = new[]{ new RouteDataRequestCultureProvider{RouteDataStringKey="vi",UIRouteDataStringKey="vi"

                }};

            });

            services.Configure<RouteOptions>(options =>
            {
                options.ConstraintMap.Add("lang", typeof(LanguageRouteConstraint));
            });
            services.AddLocalization(o =>
            {
                o.ResourcesPath = "Resources";
            });

            services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                  .RequireAuthenticatedUser()
                  .Build();
            });
            #region Don't delete this will be use for SSO 
            //For example only! Don't store your shared keys as strings in code.
            //Use environment variables or the .NET Secret Manager instead.
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            var sharedKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("123456"));

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "cookies";
                options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie("cookies", options =>
            {
                options.Cookie.Name = "SIW_" + BMS.AppSettings.Current.Environment + "AUTH_Cookie";
                options.AccessDeniedPath = "/account/needaccount";
            })
            .AddAutomaticTokenManagement()
            .AddOpenIdConnect("oidc", options =>
            {
                options.Authority = Configuration["IdentityServiceSettings:Authority"];
                options.ClientId = Configuration["AppSettings:AppClientID"];
                options.ClientSecret = Configuration["AppSettings:AppClientSecret"];
                options.ResponseType = "code id_token";
                options.RequireHttpsMetadata = false;
                options.SaveTokens = true;
                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("offline_access");
                options.Scope.Add(Configuration["AppSettings:AppClientScope"]);
                options.ClaimActions.MapAllExcept("iss", "nbf", "exp", "aud", "nonce", "iat", "c_hash");

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    IssuerSigningKey = sharedKey,
                    RequireSignedTokens = true,
                };
                options.Events = new OpenIdConnectEvents
                {
                    OnRemoteFailure = (context) =>
                    {
                        context.Response.Redirect("/");
                        context.HandleResponse();

                        return Task.CompletedTask;
                    }
                };
            })
            ;
            if (BMS.AppSettings.Current.IsDebug)
            {
                IdentityModelEventSource.ShowPII = true;
            }
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime lifetime, IDistributedCache cache)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHealthChecks("/healthz");

            //apply header forward for loading ballancing
            var options = new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            };
            options.RequireHeaderSymmetry = false;
            options.ForwardLimit = null;
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
            app.UseForwardedHeaders(options);

            //apply server caching lifetime
            lifetime.ApplicationStarted.Register(() =>
            {
                var currentTimeUTC = DateTime.UtcNow.ToString();
                byte[] encodedCurrentTimeUTC = Encoding.UTF8.GetBytes(currentTimeUTC);
                var options1 = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromDays(1));
                cache.Set("cachedTimeUTC", encodedCurrentTimeUTC, options1);
            });
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy(new CookiePolicyOptions()
            {
                CheckConsentNeeded = u => false,
                HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.None,
                MinimumSameSitePolicy = SameSiteMode.Lax
            });
            #region Culture Configure
            var supportedCultures = new List<CultureInfo>
                    {
                        new CultureInfo("vi"),
                        new CultureInfo("en")
                    };
            var requestLocalizationOptions = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture(supportedCultures.First()),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            };
            app.UseRequestLocalization(requestLocalizationOptions);
            #endregion

            app.UseRouting();



            AppHttpContext.Services = app.ApplicationServices;
            app.UseSession();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseProfileMiddleware();
            app.UseEndpoints(endpoints =>
            {
                //endpoints.MapControllerRoute(
                //    name: "default",
                //    pattern: "{controller=Home}/{action=Index}/{id?}");
                RouteConfig.RegisterRoutes(endpoints);
                endpoints.MapDefaultControllerRoute().RequireAuthorization();
            });
            RotativaConfiguration.Setup(env.WebRootPath);

        }
    }
}
