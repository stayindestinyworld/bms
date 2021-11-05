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
    public class SupportController : Controller
    {

        #region Setup configuration settings to register vexere.com to applink
        /// <summary>
        /// Setup configuration settings to register vexere.com to applink
        /// </summary>
        /// <returns></returns>
        public JsonResult SetupAppLink()
        {

            AppLinkConfig webconfig = new AppLinkConfig();
            webconfig.relation = new List<string> { "delegate_permission/common.handle_all_urls" };
            AppLinkTarget target1 = new AppLinkTarget();
            target1.@namespace = AppSettings.Current.AndroidApp_WebNamespace;
            target1.site = AppSettings.Current.AndroidApp_Website;
            webconfig.target = target1;

            AppLinkConfig mobileconfig = new AppLinkConfig();
            mobileconfig.relation = new List<string> { "delegate_permission/common.handle_all_urls" };
            AppLinkTarget target = new AppLinkTarget();
            target.@namespace = AppSettings.Current.AndroidApp_Namespace;
            target.package_name = AppSettings.Current.AndroidApp_PackageName;
            target.sha256_cert_fingerprints = AppSettings.Current.AndroidApp_Sha256CertFingerprints.Split(',').ToList();
            mobileconfig.target = target;
            return Json(new List<AppLinkConfig> { webconfig, mobileconfig });
        }

        public class AppLinkConfig
        {
            //[{
            //  "relation": ["delegate_permission/common.handle_all_urls"],
            //  "target": {
            //    "namespace": "web",
            //    "site": "https://www.google.com"
            //  }
            //},{
            //  "relation": ["delegate_permission/common.handle_all_urls"],
            //  "target": {
            //    "namespace": "android_app",
            //    "package_name": "org.digitalassetlinks.sampleapp",
            //    "sha256_cert_fingerprints": ["10:39:38:EE:45:37:E5:9E:8E:E7:92:F6:54:50:4F:B8:34:6F:C6:B3:46:D0:BB:C4:41:5F:C3:39:FC:FC:8E:C1"]
            //    }
            //}]


            public List<string> relation { get; set; }
            public AppLinkTarget target { get; set; }
        }
        public class AppLinkTarget
        {
            public string site { get; set; }
            public string @namespace { get; set; }
            public string package_name { get; set; }
            public List<string> sha256_cert_fingerprints { get; set; }
        }

        #endregion
        #region Setup configuration settings to register vexere.com to applink
        /// <summary>
        /// Setup configuration settings to register vexere.com to applink
        /// </summary>
        /// <returns></returns>
        public JsonResult SetupUniversalLink()
        {
            //{
            //  "applinks": {
            //    "apps": [],
            //    "details": [
            //      {
            //        "appID": "HKJGHKJG.com.facebook.ios",
            //        "paths": [ "NOT /e/*", "*", "/", “/archives/201?/* ]
            //      },
            //      {
            //         "appID": "JKHKJJHK.com.twitter.ios",
            //         "paths": [ "NOT /e/*", "*", "/", “/archives/200?/* ]
            //      }
            //    ]
            //  }
            //}
            UniversalLinkConfig config = new UniversalLinkConfig();
            config.applinks = new AppUniversalConfig
            {
                apps = new List<string> { AppSettings.Current.IOSApp_AppName },
                details = new List<IOSAppConfig> { new IOSAppConfig {
                         appID = AppSettings.Current.IOSApp_AppID,
                         paths = AppSettings.Current.IOSApp_AppPaths.Split(',').ToList()
                    }
                }
            };
            return Json(config);
        }

        public class UniversalLinkConfig
        {
            public AppUniversalConfig applinks { get; set; }
        }
        public class AppUniversalConfig
        {
            public List<string> apps { get; set; }
            public List<IOSAppConfig> details { get; set; }
        }
        public class IOSAppConfig
        {
            public string appID { get; set; }
            public List<string> paths { get; set; }
        }
        #endregion
    }


}
