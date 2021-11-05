using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using BMS.Models;
namespace BMS.Controllers
{
    public class SiwEmailSubscribeController : Controller
    {
        public SiwEmailSubscribeController()
        {
        }
        #region Normal Action
        public ActionResult Admin()
        {
            return View();
        }
        #endregion
    }
}
