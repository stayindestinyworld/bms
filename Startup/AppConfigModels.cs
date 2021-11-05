using System;

namespace BMS
{
    public class AppSettings
    {
        public static AppSettings Current { get; set; }
        public AppSettings()
        {
            Current = this;
        }
        //for application authorization
        public string AppClientID { get; set; }
        public string AppClientSecret { get; set; }
        public string AppClientScope { get; set; }
        public string AppDomainUrl { get; set; }
        //for upload document
        public bool UseStaticServer { get; set; }
        public string StaticServerEndPoint { get; set; }
        public string StaticServerAccessKey { get; set; }
        public string StaticServerSecretKey { get; set; }
        public double MaxUploadFileSize { get; set; }
        public string TempFolderPrefix { get; set; }
        public string EnvironmentFolderPrefix { get; set; }
        //for setup environment
        public bool IsDebug { get; set; }
        public bool IsLocal { get; set; }
        public string DeployVersion { get; set; }
        public string Environment { get; set; }

        //for mobile dynamic link navigator
        public string AndroidApp_Namespace { get; set; }
        public string AndroidApp_PackageName { get; set; }
        public string AndroidApp_Sha256CertFingerprints { get; set; }
        public string AndroidApp_WebNamespace { get; set; }
        public string AndroidApp_Website { get; set; }
        public string IOSApp_AppName { get; set; }
        public string IOSApp_AppID { get; set; }
        public string IOSApp_AppPaths { get; set; }

    }
    public class FAKSettings
    {
        public static FAKSettings Current { get; set; }
        public FAKSettings()
        {
            Current = this;
        }
        public string FacebookAppID01 { get; set; }
        public string FacebookAppSecret01 { get; set; }
        public string FacebookAppVersion01 { get; set; }
        public string FacebookAppID02 { get; set; }
        public string FacebookAppSecret02 { get; set; }
        public string FacebookAppVersion02 { get; set; }
        public string UseVersion { get; set; }
     }
    public class BusinessAPISettings
    {
        public static BusinessAPISettings Current { get; set; }
        public BusinessAPISettings()
        {
            Current = this;
        }
        public string BusinessAPI_BaseUrl { get; set; }
    }
    public class IdentityServiceSettings
    {
        public static IdentityServiceSettings Current { get; set; }
        public IdentityServiceSettings()
        {
            Current = this;
        }
        public string Authority { get; set; }
    }

    public class SessionSettings
    {
        public static SessionSettings Current { get; set; }
        public SessionSettings()
        {
            Current = this;
        }
        
        public string RedisSentinelService { get; set; }
        public string RedisSentinelServer01 { get; set; }
        public int RedisSentinelPort01 { get; set; }

    }
}
