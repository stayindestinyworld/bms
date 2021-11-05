using BMS.Models;
using BMS.Session;
using BMS.Utils;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BMS.Services
{
    public class AccountService : IAccountService
    {
        private HttpContext httpContext;
        private Uri BaseEndpoint { get; set; }
        private readonly IHttpClientFactory _httpClientFactory;
        public AccountService(IHttpContextAccessor diContextAccessor,
            IHttpClientFactory httpClientFactory)
        {
            httpContext = diContextAccessor.HttpContext;
            _httpClientFactory = httpClientFactory;
        }

        public bool IsSignedIn(ClaimsPrincipal principal)
        {
            return principal?.Identities != null &&
                   principal.Identities.Any(i => i.AuthenticationType == TokenValidationParameters.DefaultAuthenticationType);
        }


        public string GetUserName(ClaimsPrincipal principal)
        {
            string name = principal.FindFirstValue(ClaimTypes.Name);

            if (String.IsNullOrEmpty(name))
                name = principal.FindFirstValue("name");

            // TODO load persisted user data via subject id, if needed

            return name;
        }
        //http://auth.bell.vn/connect/userinfo
        /// <summary>
        /// Get user login from authen server
        /// </summary>
        /// <returns></returns>
        public async Task<UserLogInAccount> GetLogInAccount()
        {
            string accessToken = await httpContext.GetTokenAsync("access_token");
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(IdentityServiceSettings.Current.Authority);
                var request = new HttpRequestMessage(HttpMethod.Get, "/connect/userinfo");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                HttpResponseMessage response = await httpClient.SendAsync(request);
                if (response.StatusCode != HttpStatusCode.OK)
                {
                    return null;
                }
                string result = await response.Content.ReadAsStringAsync();
                return await response.Content.ReadAsAsync<UserLogInAccount>();
            }
        }
        /// <summary>
        /// Get full userprofile with permissions
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<UserProfile> GetUserFullProfile(string userId)
        {
            string accessToken = await httpContext.GetTokenAsync("access_token");

            using (var httpClient = new HttpClient())
            {

                httpClient.BaseAddress = new Uri(BusinessAPISettings.Current.BusinessAPI_BaseUrl);
                httpClient.DefaultRequestHeaders.Accept.Clear();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var request = new HttpRequestMessage(HttpMethod.Get, "/api/UserProfile/GetFullProfileByUserId?id=" + userId+"&app=web");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                HttpResponseMessage response = await httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    string json = await response.Content.ReadAsStringAsync();
                    var mv = CommonUtils.ConvertJsonStringToObject<UserProfileViewModel>(json);
                    if (mv.result == "Success" && mv.userProfile != null)
                    {
                        return mv.userProfile;
                    }
                }
            }
            return null;
        }

        /// <summary>
        /// Get full userprofile with permissions
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<UserProfile> GetUserFullProfile(string phoneCode, string phoneNumber)
        {
            //phoneCode 84, phoneNumber 907891134
            // string accessToken = await httpContext.GetTokenAsync("access_token");
            var accessToken = await GetAccessToken();
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(BusinessAPISettings.Current.BusinessAPI_BaseUrl);
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.access_token);
                httpClient.DefaultRequestHeaders.Accept.Clear();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var request = new HttpRequestMessage(HttpMethod.Get, "/api/UserProfile/GetFullProfileByPhoneNumber?phoneCode=" + phoneCode + "&phoneNumber=" + phoneNumber);
                HttpResponseMessage response = await httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    string json = await response.Content.ReadAsStringAsync();
                    var mv = CommonUtils.ConvertJsonStringToObject<UserProfileViewModel>(json);
                    if (mv.result == "Success" && mv.userProfile != null)
                    {
                        return mv.userProfile;
                    }
                }
            }
            return null;
        }
        /// <summary>
        /// Update user activity history
        /// </summary>
        /// <param name="activityHistory"></param>
        /// <returns>false</returns>
        public async Task<bool> UpdateHistory(ActivityHistoryDTO activityHistory)
        {
            //string accessToken = await httpContext.GetTokenAsync("access_token");
            var accessToken = await GetAccessToken();
            try
            {
                using (var httpClient = new HttpClient())
                {

                    httpClient.BaseAddress = new Uri(BusinessAPISettings.Current.BusinessAPI_BaseUrl);
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.access_token);
                    httpClient.DefaultRequestHeaders.Accept.Clear();
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    await httpClient.PostAsJsonAsync("/api/ActivityHistory/Save", activityHistory);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<APIAccessToken> GetAccessToken()
        {
            var apiAccessToken = SessionHelper.APIAccessToken;
            if (apiAccessToken == null)
            {
                var client = new HttpClient();
                //var disco = await client.GetDiscoveryDocumentAsync(IdentityServiceSettings.Current.Authority);
                string tokenEndPoint = IdentityServiceSettings.Current.Authority + "/connect/token";
                // request access token
                var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
                {
                    Address = tokenEndPoint,
                    ClientId = AppSettings.Current.AppClientID,
                    ClientSecret = AppSettings.Current.AppClientSecret,
                    Scope = AppSettings.Current.AppClientScope,
                    ClientCredentialStyle = ClientCredentialStyle.AuthorizationHeader
                });

                if (tokenResponse.IsError)
                {
                    return null;
                }
                var token = tokenResponse.Json.ToObject<APIAccessToken>();
                if (AppSettings.Current.IsLocal)
                {
                    token.startTime = DateTime.Now;
                }
                else
                {
                    token.startTime = CommonUtils.ConvertUTCToLocal(DateTime.Now);
                }
                token.startTimeS = token.startTime.Value.ToString("dd/MM/yyyy HH:mm:ss");
                apiAccessToken = token;
                SessionHelper.APIAccessToken = apiAccessToken;
            }
            else
            {//check token epired and get new token
                var duration = DateTime.Now - apiAccessToken.startTime;
                if (duration.HasValue && duration.Value.TotalSeconds >= apiAccessToken.expires_in)
                {
                    var client = new HttpClient();
                    //var disco = await client.GetDiscoveryDocumentAsync(IdentityServiceSettings.Current.Authority);
                    string tokenEndPoint = IdentityServiceSettings.Current.Authority + "/connect/token";
                    // request access token
                    var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
                    {
                        Address = tokenEndPoint,
                        ClientId = AppSettings.Current.AppClientID,
                        ClientSecret = AppSettings.Current.AppClientSecret,
                        Scope = AppSettings.Current.AppClientScope
                    });

                    if (tokenResponse.IsError)
                    {
                        return null;
                    }
                    var token = tokenResponse.Json.ToObject<APIAccessToken>();
                    if (AppSettings.Current.IsLocal)
                    {
                        token.startTime = DateTime.Now;
                    }
                    else
                    {
                        token.startTime = CommonUtils.ConvertUTCToLocal(DateTime.Now);
                    }
                    token.startTimeS = token.startTime.Value.ToString("dd/MM/yyyy HH:mm:ss");
                    apiAccessToken = token;
                    SessionHelper.APIAccessToken = apiAccessToken;
                }
            }
            return apiAccessToken;
        }

        public async Task<APIAccessToken> GetRefreshToken()
        {
            SessionHelper.APIAccessToken = null;

            var client = new HttpClient();
            //var disco = await client.GetDiscoveryDocumentAsync(IdentityServiceSettings.Current.Authority);
            string tokenEndPoint = IdentityServiceSettings.Current.Authority + "/connect/token";
            // request access token
            var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = tokenEndPoint,
                ClientId = AppSettings.Current.AppClientID,
                ClientSecret = AppSettings.Current.AppClientSecret,
                Scope = AppSettings.Current.AppClientScope,
                ClientCredentialStyle = ClientCredentialStyle.AuthorizationHeader
            });

            if (tokenResponse.IsError)
            {
                return null;
            }
            var token = tokenResponse.Json.ToObject<APIAccessToken>();
            if (AppSettings.Current.IsLocal)
            {
                token.startTime = DateTime.Now;
            }
            else
            {
                token.startTime = CommonUtils.ConvertUTCToLocal(DateTime.Now);
            }
            token.startTimeS = token.startTime.Value.ToString("dd/MM/yyyy HH:mm:ss");
            SessionHelper.APIAccessToken = token;
            return token;
        }

    }
}
