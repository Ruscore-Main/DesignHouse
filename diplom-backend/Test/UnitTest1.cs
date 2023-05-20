using diplom_backend;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using System;
using System.Net;
using System.Net.Http;
using Xunit;

namespace Test
{
    public class UnitTest1
    {

        public UnitTest1()
        {
            var server = new TestServer(new WebHostBuilder().UseEnvironment("Development").UseStartup<Startup>());
            _client = server.CreateClient();
        }

        private readonly HttpClient _client;

        // GET - получение списка проекта домов
        [Theory]
        [InlineData("GET")]
        public async void GetTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/pizza");
            var response = await _client.SendAsync(request);
            
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение отсортировнного списка проекта домов
        [Theory]
        [InlineData("GET")]
        public async void GetSortTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/pizza");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
