using BMS.Utils;
using System;
using System.Collections.Generic;
using System.Security.Policy;

namespace BMS.Session
{
    public class SessionHelper
    {
        #region Base Session Function
        /// <summary>
        /// Get session value by key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string Get(string key)
        {
            return AppHttpContext.Current.Session.Get(key);
        }
        /// <summary>
        /// Set session value by key
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void Set(string key, string value)
        {
            AppHttpContext.Current.Session.Set(key, value);
        }
        /// <summary>
        /// Remove session by key
        /// </summary>
        /// <param name="key"></param>
        public static void Remove(string key)
        {
            AppHttpContext.Current.Session.Remove(key);
        }

        /// <summary>
        /// Set session value by key
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void Set<T>(string key, T value)
        {
            string json = CommonUtils.ConvertObjectToJsonString(value);
            AppHttpContext.Current.Session.Set(key, json);
        }
        /// <summary>
        /// Get session value by key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static T Get<T>(string key)
        {
            string json = AppHttpContext.Current.Session.Get(key);
            if(!string.IsNullOrWhiteSpace(json)){
                return CommonUtils.ConvertJsonStringToObject<T>(json);
            }
            return default(T);
        }
        #endregion

        public static UserProfile UserProfile {
            set
            {
                if (value == null)
                {
                   Remove("BMSProfile");
                }
                else
                {
                    Set<UserProfile>("BMSProfile", value);
                }
            }
            get
            {
                var userProfile = Get<UserProfile>("BMSProfile");
                if (userProfile != null)
                {
                    if (string.IsNullOrWhiteSpace(userProfile.profileImageUrl))
                    {
                        userProfile.profileImageUrl = "/Images/poster.png";
                    }
                }

                return userProfile;
            }
        }
        public static WalletProfile WalletProfile
        {
            set
            {
                if (value == null)
                {
                    Remove("BMSProfile");
                }
                else
                {
                    Set<WalletProfile>("BMSProfile", value);
                }
            }
            get
            {
                var walletProfile = Get<WalletProfile>("BMSProfile");

                return walletProfile;
            }
        }

        public static APIAccessToken APIAccessToken
        {
            set
            {
                if (value == null)
                {
                    Remove("APIAccessToken");
                }
                else
                {
                    Set<APIAccessToken>("APIAccessToken", value);
                }
            }
            get
            {
                var accessToken = Get<APIAccessToken>("APIAccessToken");

                return accessToken;
            }
        }
    }
}