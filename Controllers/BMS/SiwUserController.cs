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
    public class SiwUserController : Controller
    {
        public SiwUserController()
        {
        }
        #region Normal Action
        public ActionResult Admin()
        {
            return View();
        }
        #endregion

        #region CharacterDisplay
        public ActionResult CharacterDisplay()
        {
            return View();
        }
        #endregion
        #region SiwAirdrop
        public ActionResult SiwAirdrop()
        {
            return View();
        }
        #endregion
        #region MainGamePlay
        public ActionResult MainGamePlay()
        {
            return View();
        }
        #endregion
        #region LocketPage
        public ActionResult LocketPage()
        {
            return View();
        }
        #endregion
        #region InfinityStonePage
        public ActionResult InfinityStonePage()
        {
            return View();
        }
        #endregion
        #region AuctionVillage
        public ActionResult AuctionVillage()
        {
            return View();
        }
        #endregion
        #region MyBackpack
        public ActionResult MyBackpack()
        {
            return View();
        }
        #endregion 
    }
}
