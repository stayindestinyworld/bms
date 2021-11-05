using BMS.Services;
using BMS.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;

namespace BMS
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Register all service of your application
        /// </summary>
        /// <param name="services"></param>
        public static void RegisterAppService(this IServiceCollection services)
        {

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IWebHelper, WebHelper>();
            services.AddScoped<IAccountService, AccountService>();
        }
        /// <summary>
        /// Register all application config from config.json file
        /// </summary>
        /// <param name="services"></param>
        /// <param name="Configuration"></param>
        public static void RegisterConfigs(this IServiceCollection services, IConfiguration Configuration)
        {
            services.AddOptions();
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<BusinessAPISettings>(Configuration.GetSection("BusinessAPISettings"));


            AppSettings appSettings  = new AppSettings();
            Configuration.Bind("AppSettings", appSettings);
            services.AddSingleton(appSettings);


            BusinessAPISettings businessAPISettings = new BusinessAPISettings();
            Configuration.Bind("BusinessAPISettings", businessAPISettings);
            services.AddSingleton(businessAPISettings);


            IdentityServiceSettings identityServiceSettings = new IdentityServiceSettings();
            Configuration.Bind("IdentityServiceSettings", identityServiceSettings);
            services.AddSingleton(identityServiceSettings);

            SessionSettings sessionSettings = new SessionSettings();
            Configuration.Bind("SessionSettings", sessionSettings);
            services.AddSingleton(sessionSettings);

            FAKSettings fakSettings = new FAKSettings();
            Configuration.Bind("FAKSettings", fakSettings);
            services.AddSingleton(fakSettings);
        }
    }
}