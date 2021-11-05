using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BMS.Models;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using BMS.Session;
using BMS.Services;
using Rotativa.AspNetCore;

namespace BMS.Controllers
{
    public class HomeController : Controller
    {
   
        public HomeController()
        {
        }
        //public IActionResult Admin()
        //{
        //    return View();
        //}
        [AllowAnonymous]
        public IActionResult Index()
        {
            
            return View();
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        //[AllowAnonymous]
        //[HttpPost]
        //public IActionResult SetLanguage(string culture, string returnUrl)
        //{
        //    Response.Cookies.Append(
        //        CookieRequestCultureProvider.DefaultCookieName,
        //        CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
        //        new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
        //    );
        //    List<string> listUrl = returnUrl.Split('/').ToList();
        //    if (listUrl.Count > 1) {
        //        if (listUrl[1].ToLower() == "en" || listUrl[1].ToLower() == "vi")
        //        {
        //            listUrl[1] = culture;
        //        }
        //        else {
        //            listUrl.Insert(1, culture);
        //        }
        //    }
        //    returnUrl = string.Join('/', listUrl);
        //    return LocalRedirect(returnUrl);
        //}

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Permission()
        {
            return View();
        }

        //[AllowAnonymous]
        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult NeedLogin()
        //{
        //    return View();
        //}

       
    }


}
