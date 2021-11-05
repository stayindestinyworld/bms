using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
namespace BMS.Utils
{
    public class UrlHelperUtils
    {

        public static string StripVietnameseSigns(string str, bool isNotForVN = false)
        {
            if (str == null)
                return "";

           
                string strFormD = str.Normalize(NormalizationForm.FormD);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < strFormD.Length; i++)
                {
                    System.Globalization.UnicodeCategory uc =
                    System.Globalization.CharUnicodeInfo.GetUnicodeCategory(strFormD[i]);
                    if (uc != System.Globalization.UnicodeCategory.NonSpacingMark)
                    {
                        sb.Append(strFormD[i]);
                    }
                }
                sb = sb.Replace('Đ', 'D');
                sb = sb.Replace('đ', 'd');
                return (sb.ToString().Normalize(NormalizationForm.FormD));
            

        }
        public static string GenerateSlug(string phrase, string glue)
        {
            var str = StripVietnameseSigns(phrase).ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"[-]", " ");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = Regex.Replace(str, @"\s", glue); // hyphens   

            return str;
        }

        public static string BuildHouseUrl(string houseType, string houseName, string houseAddress, int houseId, string language = "vi")
        {
            string result = null;
          
            string houseTypeSlug = GenerateSlug(houseType, "-").Trim('-').Trim();
            string houseNameSlug = GenerateSlug(houseName, "-").Trim('-').Trim();
            string houseAddressSlug = GenerateSlug(houseAddress, "-").Trim('-').Trim();
            if (language.ToLower() == "vi-vn")
            {
                result = string.Format("/vi/{0}-{1}-{2}-{3}.html",
                                           houseTypeSlug, houseNameSlug, houseAddressSlug, houseId);
                result = AppSettings.Current.AppDomainUrl + result;

            }
            else if (language.ToLower() == "en-us")
            {
                result = string.Format("/en/{0}-{1}-{2}-{3}.html.html",
                                            houseTypeSlug, houseNameSlug, houseAddressSlug, houseId);
                result = AppSettings.Current.AppDomainUrl + result;
            }
          
            return result;
        }

        /// <summary>
        /// Convert the current url to other language
        /// </summary>
        /// <param name="convertLang"></param>
        /// <param name="curerntUrl"></param>
        /// <returns></returns>
        public static string ConvertUrl(string convertLang, string curerntUrl)
        {
            try
            {
                //Convert English url to VietNam Url
                if (convertLang.ToLower() == "vi")
                {
                    curerntUrl = curerntUrl.ToLower().Replace("/en/", "/vi/");
                    List<string> listUrl = curerntUrl.Split('/').ToList();
                    if (curerntUrl == "/en")
                    {
                        curerntUrl = "/";
                    }


                    string cultureItem = listUrl[1];
                    if (listUrl.Count <= 2)
                    {
                        return curerntUrl;
                    }

                    string slugItem = listUrl[2];

                    //Static Pages
                    if (curerntUrl.Contains("introduction.html"))
                    {
                        curerntUrl = curerntUrl.Replace("introduction", "gioi-thieu");
                    }
                    if (curerntUrl.Contains("contact-us.html"))
                    {
                        curerntUrl = curerntUrl.Replace("contact-us", "lien-he");
                    }
                    if (curerntUrl.Contains("guide-on-making-payment.html"))
                    {
                        curerntUrl = curerntUrl.Replace("guide-on-making-payment", "huong-dan-thanh-toan-tren-website");
                    }
                    if (curerntUrl.Contains("mechanism-for-solving-dispute.html"))
                    {
                        curerntUrl = curerntUrl.Replace("mechanism-for-solving-dispute", "co-che-giai-quyet-tranh-chap-phat-sinh-trong-qua-trinh-giao-dich-tren-website");
                    }
                    if (curerntUrl.Contains("booking-policy.html"))
                    {
                        curerntUrl = curerntUrl.Replace("booking-policy", "quy-che-dat-ve");
                    }
                    if (curerntUrl.Contains("policy.html"))
                    {
                        curerntUrl = curerntUrl.Replace("policy", "quy-che");
                    }
                    if (curerntUrl.Contains("faqs.html"))
                    {
                        curerntUrl = curerntUrl.Replace("faqs", "nhung-cau-hoi-thuong-gap");
                    }

                    if (curerntUrl.Contains("vexere-bus-management-system"))
                    {
                        curerntUrl = curerntUrl.Replace("vexere-bus-management-system", "phan-mem-quan-ly-ban-ve-xe-khach-vbms");
                    }

                }
                else if (convertLang.ToLower() == "en")//Convert VietName Url to English Url
                {
                    curerntUrl = curerntUrl.ToLower().Replace("/vi", "/en");
                    List<string> listUrl = curerntUrl.Split('/').ToList();
                    if (!curerntUrl.Contains("vi") && listUrl[1] == "")
                    {
                        curerntUrl = curerntUrl + "en";
                    }

                    string cultureItem = listUrl[1];

                    if (listUrl.Count <= 2)
                    {
                        return curerntUrl;
                    }

                    string slugItem = listUrl[2];

                    //Static Pages
                    if (curerntUrl.Contains("gioi-thieu.html"))
                    {
                        curerntUrl = curerntUrl.Replace("gioi-thieu", "introduction");
                    }
                    if (curerntUrl.Contains("lien-he.html"))
                    {
                        curerntUrl = curerntUrl.Replace("lien-he", "contact-us");
                    }
                    if (curerntUrl.Contains("huong-dan-thanh-toan-tren-website.html"))
                    {
                        curerntUrl = curerntUrl.Replace("huong-dan-thanh-toan-tren-website", "guide-on-making-payment");
                    }
                    if (curerntUrl.Contains("co-che-giai-quyet-tranh-chap-phat-sinh-trong-qua-trinh-giao-dich-tren-website.html"))
                    {
                        curerntUrl = curerntUrl.Replace("co-che-giai-quyet-tranh-chap-phat-sinh-trong-qua-trinh-giao-dich-tren-website", "mechanism-for-solving-dispute");
                    }
                    if (curerntUrl.Contains("quy-che.html"))
                    {
                        curerntUrl = curerntUrl.Replace("quy-che", "policy");
                    }
                    if (curerntUrl.Contains("nhung-cau-hoi-thuong-gap.html"))
                    {
                        curerntUrl = curerntUrl.Replace("nhung-cau-hoi-thuong-gap", "faqs");
                    }


                }
                return curerntUrl;
            }
            catch (Exception)
            {
                return curerntUrl;
            }
        }
       

    }

}
