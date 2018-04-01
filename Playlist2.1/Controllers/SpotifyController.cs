using System;
using System.Net;
using System.Collections;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace Playlist2._1.Controllers
{
    [Route("api/[controller]")]
    public class SpotifyController : Controller
    {
        [HttpGet("[action]")]
        public IActionResult Login()
        {
            Console.WriteLine("Hello");
            return View("~/Views/Login.cshtml");
        }

        [HttpGet("[action]")]
        public IEnumerable PublicToken()
        {
            Console.WriteLine("Hello");
            string url5 = "https://accounts.spotify.com/api/token";

            string auth = "your_spotify_clientId:your_spotify_client_secret";

            byte[] auth_byte = Encoding.UTF8.GetBytes(auth);
            var auth_mod = Convert.ToBase64String(auth_byte); //clientid is modded to Base 64 encoded     string

            //request to get the access token

            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url5);

            webRequest.Method = "POST";
            webRequest.ContentType = "application/x-www-form-urlencoded";
            webRequest.Accept = "application/json";
            webRequest.Headers.Add("Authorization: Basic " + auth_mod);
            var request = ("grant_type=client_credentials");
            byte[] req_bytes = Encoding.ASCII.GetBytes(request);
            webRequest.ContentLength = req_bytes.Length;

            Stream strm = webRequest.GetRequestStream();
            strm.Write(req_bytes, 0, req_bytes.Length);
            strm.Close();


            HttpWebResponse resp = (HttpWebResponse)webRequest.GetResponse();

            String json = "";
            using (Stream respStr = resp.GetResponseStream())
            {
                using (StreamReader rdr = new StreamReader(respStr, Encoding.UTF8))
                {
                    //should get back a string i can then turn to json and parse for accesstoken
                    json = rdr.ReadToEnd();
                    rdr.Close();
                }
            }
            return json;
        }
    }
}
