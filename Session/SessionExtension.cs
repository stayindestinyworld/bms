using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Newtonsoft.Json;

namespace BMS.Session
{
    public static class SessionExtensions
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            string obj = JsonConvert.SerializeObject(value);
            session.SetString(key, obj);
        }
        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            if (value == null) return default(T);
            try
            {
               return JsonConvert.DeserializeObject<T>(value);
            }
            catch {
                return default(T);
            }
        }
        public static string Get(this ISession session, string key)
        {
            return session.GetString(key);
        }
        public static void Set(this ISession session, string key, string value)
        {
            session.SetString(key, value);
        }
    }
}
