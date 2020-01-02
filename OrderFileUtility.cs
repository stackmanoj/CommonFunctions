using Jewelex.Common.Aspects.Constants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Xml.Linq;
using Thinktecture.IdentityModel.Client;

namespace Jewelex.API.Common
{
    public class OrderFile
    {
        public string FileName { get; set; }
        public string Url { get; set; }
    }
    public static class OrderFileUtility
    {
        private static OAuth2Client _oauth2;
        public static List<OrderFile> GetFiles(string orderNumber)
        {

            List<OrderFile> orderFiles = new List<OrderFile>();
            //var order1 = new OrderFile { FileName = "b2671d38-65d8-4e57-9347-2f7c09a72ab4", Url = @"http://www.africau.edu/images/default/sample.pdf" };
            //var order2 = new OrderFile { FileName = "fb054d56-6d71-434c-ab3d-47af5792d3df", Url = @"http://www.africau.edu/images/default/sample.pdf" };
            //orderFiles.Add(order1);
            //orderFiles.Add(order2);
            try
            {
                _oauth2 = new OAuth2Client(new Uri(AppConstants.IonApi_OAuth2TokenEndpoint), AppConstants.IonApi_ResourceOwnerClientId, AppConstants.IonApi_ResourceOwnerClientSecret);

                TokenResponse token = RequestToken();

                if (!token.IsError)
                {
                    orderFiles = CallService(token.AccessToken, orderNumber);

                    RevokeToken(token.AccessToken, OAuth2Constants.AccessToken);

                    if (token.RefreshToken != null)
                    {
                        RevokeToken(token.RefreshToken, OAuth2Constants.RefreshToken);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return orderFiles;
        }

        private static List<OrderFile> CallService(string token, string orderNumber)
        {
            List<OrderFile> orderFiles = new List<OrderFile>();
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(AppConstants.IonApi_BaseUrl + "/api/items/search?%24query=%2FMDS_GenericDocument%5B%40MDS_id1%20%3D%20%22" + orderNumber + "%22%5D&%24offset=0&%24limit=3&%24includeCount=true");
            request.Method = "GET";
            request.Headers.Add("Authorization", "Bearer " + token);
            System.Text.UTF8Encoding encoding = new System.Text.UTF8Encoding();
            request.ContentType = "application/json";
            try
            {
                XDocument doc;
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    using (Stream stream = response.GetResponseStream())
                    {
                        doc = XDocument.Load(stream);

                        var items = doc.Elements().Elements().Where(m => m.Name.LocalName.ToLower() == "item").ToList();
                        for (int i = 0; i < items.Count; i++)
                        {
                            try
                            {
                                var resrs = items[i].Elements().Where(m => m.Name.LocalName.ToLower() == "resrs").FirstOrDefault();
                                if (resrs != null)
                                {
                                    var file = resrs.Elements().Where(m => m.Elements().Where(x => x.Name.LocalName.ToLower() == "mimetype").FirstOrDefault().Value == "application/pdf").FirstOrDefault();
                                    orderFiles.Add(new OrderFile()
                                    {
                                        FileName = file.Elements().Where(m => m.Name.LocalName.ToLower() == "filename").FirstOrDefault().Value,
                                        Url = file.Elements().Where(m => m.Name.LocalName.ToLower() == "url").FirstOrDefault().Value
                                    });
                                }
                            }
                            catch (Exception ex)
                            {

                            }
                        }
                    }
                }
            }
            catch (WebException ex)
            {

            }
            return orderFiles;
        }

        private static TokenResponse RequestToken()
        {
            return _oauth2.RequestResourceOwnerPasswordAsync
                (AppConstants.IonApi_ServiceAccountAccessKey, AppConstants.IonApi_ServiceAccountSecretKey).Result;
        }

        private static TokenResponse RefreshToken(string refreshToken)
        {
            return _oauth2.RequestRefreshTokenAsync(refreshToken).Result;
        }

        private static bool RevokeToken(string token, string tokenType)
        {
            var client = new HttpClient();
            client.SetBasicAuthentication(AppConstants.IonApi_ResourceOwnerClientId, AppConstants.IonApi_ResourceOwnerClientSecret);

            var postBody = new Dictionary<string, string>
            {
                { "token", token },
                { "token_type_hint", tokenType }
            };

            var result = client.PostAsync(AppConstants.IonApi_OAuth2TokenRevocationEndpoint, new FormUrlEncodedContent(postBody)).Result;

            if (result.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}