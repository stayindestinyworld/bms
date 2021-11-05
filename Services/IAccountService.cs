using BMS.Models;
using BMS.Session;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BMS.Services
{
    public interface IAccountService
    {
        bool IsSignedIn(ClaimsPrincipal principal);
        string GetUserName(ClaimsPrincipal principal);
        Task<UserProfile> GetUserFullProfile(string userId);
        Task<UserProfile> GetUserFullProfile(string phoneCode, string phoneNumber);
        Task<UserLogInAccount> GetLogInAccount();
        Task<bool> UpdateHistory(ActivityHistoryDTO activityHistory);
        Task<APIAccessToken> GetAccessToken();
        Task<APIAccessToken> GetRefreshToken();
    }
}
