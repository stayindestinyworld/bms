using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using BMS.Const;

namespace BMS.Session
{
    /// <summary>
    /// Contain all common information of a user session not separate by key
    /// </summary>
    public class UserProfile
    {
        public int userProfileID { get; set; }
        public string userId { get; set; }
        public string fullName { get; set; }
        public string address { get; set; }
        public DateTime? dateOfBirth { get; set; }
        public string dateOfBirthS { get; set; }
        public string identityNumber { get; set; }
        public string profileImageUrl { get; set; }
        public string phoneCode { get; set; }
        public string phoneNumber { get; set; }
        public string gender { get; set; }
        public string email { get; set; }
        public int? yearOfBirth { get; set; }
        public bool enabled { get; set; }
        public string description { get; set; }
        public int? companyID { get; set; }
        public int? systemCompanyID { get; set; }
        public int? ownerUserProfileID { get; set; }
        public string status { get; set; }
        public DateTime? activeDate { get; set; }
        public string activeDateS { get; set; }
        public bool? active { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string createdDateS { get; set; }
        public string modifiedBy { get; set; }
        public DateTime? modifiedDate { get; set; }
        public string modifiedDateS { get; set; }
        //end table database field
        public string editMode { get; set; }
        public string guid { get; set; }
        public string companyName { get; set; }
        public string systemCompanyName { get; set; }
        public string code { get; set; }

        public List<FeaturePermission> featurePermissions { get; set; }
        public List<UserProfileAppRegister> userProfileAppRegisters { get; set; }
        public List<WorkflowStep> workflowSteps { get; set; }
        public bool hasBUS { get; set; }
        public bool hasORG { get; set; }
        public bool hasDATA { get; set; }
        public bool hasREP { get; set; }
        public bool hasBSM { get; set; }
        public bool hasOWNER { get; set; }
        public bool hasTENANT { get; set; }

        public bool isHouseOwner {get;set;}

        public bool isTenant { get; set; }

        public UserProfile()
        {
            fullName = "Guest";
            featurePermissions = new List<FeaturePermission>();
            profileImageUrl = "/Images/poster.png";
        }


        public void VerifyPermission()
        {
            hasBUS = featurePermissions.Count(u => u.featureGroupName == FeatureGroupName.BUS) > 0;
            hasORG = featurePermissions.Count(u => u.featureGroupName == FeatureGroupName.ORG) > 0;
            hasDATA = featurePermissions.Count(u => u.featureGroupName == FeatureGroupName.DATA) > 0;
            hasREP = featurePermissions.Count(u => u.featureGroupName == FeatureGroupName.REP) > 0;
            hasOWNER = featurePermissions.Count(u => u.featureGroupName == FeatureGroupName.OWNER) > 0;
            hasTENANT = featurePermissions.Count(u => u.featureGroupName == FeatureGroupName.TENANT) > 0;
        }
        /// <summary>
        /// check permission by feature code or name
        /// </summary>
        /// <param name="featureCodeOrName"></param>
        /// <returns></returns>
        public bool hasPermission(string featureCodeOrName)
        {
            return featurePermissions.Count(u => (u.featureCode == featureCodeOrName || u.featureName == featureCodeOrName) && u.enabled) > 0;
        }
        /// <summary>
        /// get permission by featureCodeOrName
        /// </summary>
        /// <param name="featureCodeOrName"></param>
        /// <returns></returns>
        public FeaturePermission getPermission(string featureCodeOrName)
        {
            var featurePermission = featurePermissions.FirstOrDefault(u => (u.featureCode == featureCodeOrName || u.featureName == featureCodeOrName) && u.enabled);
            return featurePermission;
        }
        /// <summary>
        /// Get all permission on groupName
        /// </summary>
        /// <param name="featureCodeOrName"></param>
        /// <returns></returns>
        public FeaturePermission getPermissions(string featureGroupName)
        {
            var featurePermission = featurePermissions.FirstOrDefault(u => (u.featureGroupName == featureGroupName || u.featureName == featureGroupName) && u.enabled);
            return featurePermission;
        }


    }
    public class WalletProfile
    {
        public string walletID { get; set; }
    }
    public partial class FeaturePermission
    {
        public int featurePermissionID { get; set; }
        public int userProfileID { get; set; }
        public int businessRoleID { get; set; }
        public int featureID { get; set; }

        public int? featureGroupID { get; set; }
        public bool enabled { get; set; }

        public string businessRoleName { get; set; }
        public string featureName { get; set; }
        public string featureCode { get; set; }
        public string featureGroupName { get; set; }
        public string featureGroupCode { get; set; }
    }
    public partial class UserProfileAppRegister
    {
        public int userProfileAppRegisterID { get; set; }
        public int userProfileID { get; set; }
        public string appName { get; set; }
        public bool enabled { get; set; }
    }

    public partial class WorkflowStep
    {
        public int workflowStepID { get; set; }
        public int workflowID { get; set; }
        public string type { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int orderInProcess { get; set; }
        public int? assignUserProfileID { get; set; }

        public string workflowName { get; set; }
        public string assignUserProfileName { get; set; }
    }
    public class UserLogInAccount
    {
        public string sub { get; set; }
        public string name { get; set; }
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string website { get; set; }
        public string preferred_username { get; set; }
    }
    public class UserProfileViewModel
    {
        public string result { get; set; }
        public string errorMessage { get; set; }
        public UserProfile userProfile { get; set; }

        public UserProfileViewModel()
        {
            userProfile = new UserProfile();
        }
    }

    public class APIAccessToken {
        public string token_type { get; set; }
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public DateTime? startTime { get; set; }
        public string startTimeS { get; set; }

    }
   

    public class SearchParam
    {
        public string key { get; set; }
        public object value { get; set; }
    }
    public class GetPagingParam
    {
        public int? pageIndex { get; set; }
        public int? pageSize { get; set; }
        public List<SearchParam> searchParams { get; set; }
        public GetPagingParam()
        {
            searchParams = new List<SearchParam>();
        }
    }
    public class GetSearchParam
    {
        public List<SearchParam> searchParams { get; set; }
        public GetSearchParam()
        {
            searchParams = new List<SearchParam>();
        }
    }
    
}
