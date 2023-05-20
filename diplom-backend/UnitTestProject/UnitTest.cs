using diplom_backend;
using diplom_backend.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Xunit;

namespace UnitTestProject
{
    public class UnitTest : IClassFixture<TestingWebAppFactory<Program>>
    {
        private readonly HttpClient _client;

        HouseProjectJson houseProjectTest = new HouseProjectJson()
        {
            name = "HouseProjectNameTest",
            description = "HouseProjectDescriptionTest",
            area = 110,
            price = 2490000,
            amountFloors = 1,
            isPublished = true,
            images = new List<byte[]>() { Properties.Resources.HouseProjectImageTest }
        };

        MultipartFormDataContent houseProjectSend = new MultipartFormDataContent();

        public UnitTest(TestingWebAppFactory<Program> factory)
        {
            _client = factory.CreateClient();
            var bytefile = houseProjectTest.images[0];
            var fileContent = new ByteArrayContent(bytefile);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("multipart/form-data");
            houseProjectSend.Add(fileContent, "images", "image1.jpg");

            //the other data in form
            houseProjectSend.Add(new StringContent(houseProjectTest.name), "name");
            houseProjectSend.Add(new StringContent(houseProjectTest.description), "description");
            houseProjectSend.Add(new StringContent(Convert.ToString(houseProjectTest.area)), "area");
            houseProjectSend.Add(new StringContent(Convert.ToString(houseProjectTest.price)), "price");
            houseProjectSend.Add(new StringContent(Convert.ToString(houseProjectTest.amountFloors)), "amountFloors");
            houseProjectSend.Add(new StringContent(Convert.ToString(houseProjectTest.isPublished)), "isPublished");
        }

        //////////////////////////////////// GET TESTS ////////////////////////////////////
        // GET - получение списка проектов домов
        [Theory]
        [InlineData("GET")]
        public async void GetTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/project");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение отсортировнного списка проектов домов по какому-либо параметру
        [Theory]
        [InlineData("GET")]
        public async void GetSortTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/project?sort=area");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение списка проектов домов по количеству этажей
        [Theory]
        [InlineData("GET")]
        public async void GetCategoryTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/project?category=Одноэтажные");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение списка проектов домов по содержимому названия
        [Theory]
        [InlineData("GET")]
        public async void GetNameTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/project?searchValue=текст");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение списка проектов домов со всеми фильтрациями и сортировкой
        [Theory]
        [InlineData("GET")]
        public async void GetSortNameCategoryTestHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/project?category=Одноэтажные");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение списка пользователей
        [Theory]
        [InlineData("GET")]
        public async void GetUserList(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "api/admin/users");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение списка запросов пользователей
        [Theory]
        [InlineData("GET")]
        public async void GetRequestList(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "api/admin/request");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // GET - получение полной информации о несуществующем проекте
        [Theory]
        [InlineData("GET")]
        public async void GetFakeFullHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), "/api/project/-1");
            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // GET - получение полной информации о существующем проекте
        [Theory]
        [InlineData("GET")]
        public async void GetFullHouseProject(string method)
        {
            var responsePost = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responsePost.Content.ReadAsStringAsync());

            var request = new HttpRequestMessage(new HttpMethod(method), $"/api/project/{houseProjectId}");
            var response = await _client.SendAsync(request);
            HouseProjectJson? houseProjectResp = await response.Content.ReadFromJsonAsync<HouseProjectJson>();

            Assert.Contains(houseProjectTest.name, houseProjectResp.name);
        }


        //////////////////////////////////// POST TEST ////////////////////////////////////

        // POST - создание пользователя
        [Fact]
        public async void PostCreateUser()
        {
            UserJson userData = new UserJson()
            {
                login = "RuslanUser",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            using var responsePost = await _client.PostAsJsonAsync("/api/user/registration", userData);

            UserJson? user = await responsePost.Content.ReadFromJsonAsync<UserJson>();
            Assert.Equal(userData.login, user.login);
        }

        // POST - создание пользователя с существующим логином
        [Fact]
        public async void PostCreateSameUser()
        {
            UserJson userData = new UserJson()
            {
                login = "RuslanTestUser123",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };

            await _client.PostAsJsonAsync("/api/user/registration", userData);
            using var responsePost2 = await _client.PostAsJsonAsync(
                "/api/user/registration",
                userData
            );
            var responseString = await responsePost2.Content.ReadAsStringAsync();

            Assert.Contains("Пользователь с таким логином уже существует!", responseString);
        }

        // POST - тестироание авторизации с существующими пользователем
        [Fact]
        public async void PostAuthorizationTest()
        {
            UserJson userData = new UserJson()
            {
                login = "RuslanTestUser123",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };

            using var responsePostReg = await _client.PostAsJsonAsync("/api/user/registration", userData);
            UserJson? userReg = await responsePostReg.Content.ReadFromJsonAsync<UserJson>();

            using var responsePostAuth = await _client.PostAsJsonAsync("/api/user/authorization", userReg);

            Assert.Equal(HttpStatusCode.OK, responsePostAuth.StatusCode);
        }

        // POST - тестироание авторизации с несуществующими пользователем
        [Fact]
        public async void PostFakeAuthorizationTest()
        {
            UserJson userData = new UserJson()
            {
                login = null,
                password = null,
            };

            using var response = await _client.PostAsJsonAsync("/api/user/authorization", userData);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // POST - тестироание создания проекта дома
        [Fact]
        public async void PostCreateHouseProject()
        {
            var response = await _client.PostAsync("/api/project", houseProjectSend);
            response.EnsureSuccessStatusCode();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // POST - тестироание создания проекта дома с неправильно введенными данными
        [Fact]
        public async void PostCreateFakeHouseProject()
        {
            HouseProjectJson houseProjectJson = new HouseProjectJson()
            {
                name = null
            };
            using var response = await _client.PostAsJsonAsync(
                "/api/project",
                houseProjectJson
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // POST - тестироание добавление проекта в избранное
        [Fact]
        public async void PostAddFavorite()
        {
            var responseHouseProject= await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            UserJson userData = new UserJson()
            {
                login = "UserFavorite",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            using var responsePostUser = await _client.PostAsJsonAsync("/api/user/registration", userData);
            UserJson? user = await responsePostUser.Content.ReadFromJsonAsync<UserJson>();

            houseProjectTest.id = houseProjectId;
            houseProjectTest.userId = user.id;

            var responseFavorite = await _client.PostAsJsonAsync("/api/user/addFavorite", houseProjectTest);
            HouseProjectJson? favorite = await responseFavorite.Content.ReadFromJsonAsync<HouseProjectJson>();

            responseFavorite.EnsureSuccessStatusCode();
            Assert.Equal(houseProjectTest.name, favorite.name);
        }

        // POST - тестирование удаления проекта из избранного
        [Fact]
        public async void PostRemoveFavorite()
        {
            var responseHouseProject = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            UserJson userData = new UserJson()
            {
                login = "UserRemoveFavorite",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            using var responsePostUser = await _client.PostAsJsonAsync("/api/user/registration", userData);
            UserJson? user = await responsePostUser.Content.ReadFromJsonAsync<UserJson>();

            houseProjectTest.id = houseProjectId;
            houseProjectTest.userId = user.id;

            var responseAddFavorite = await _client.PostAsJsonAsync("/api/user/addFavorite", houseProjectTest);

            var responseRemoveFavorite = await _client.PostAsJsonAsync("/api/user/removeFavorite", houseProjectTest);
            responseRemoveFavorite.EnsureSuccessStatusCode();

            Assert.Equal(HttpStatusCode.OK, responseRemoveFavorite.StatusCode);
        }

        // POST - тестироание добавление проекта в избранное с неправильными данными
        [Fact]
        public async void PostAddFakeFavorite()
        {
            var responseHouseProject = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            houseProjectTest.id = houseProjectId;
            houseProjectTest.userId = null;

            var responseFavorite = await _client.PostAsJsonAsync("/api/user/addFavorite", houseProjectTest);

            Assert.Equal(HttpStatusCode.NotFound, responseFavorite.StatusCode);
        }

        // POST - тестироание добавление заявления на строительство
        [Fact]
        public async void PostAddRequest()
        {
            var responseHouseProject = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            UserJson userData = new UserJson()
            {
                login = "UserRequest",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            var responsePostUser = await _client.PostAsJsonAsync("/api/user/registration", userData);
            UserJson? user = await responsePostUser.Content.ReadFromJsonAsync<UserJson>();

            RequestJson request = new RequestJson()
            {
                contentText = "Сколько времени уйдет на строительство дома по этому проекту?",
                userId = user.id,
                houseProjectId = houseProjectId
            };

            var responseRequest = await _client.PostAsJsonAsync("/api/user/request", request);
            RequestJson? userRequest = await responseRequest.Content.ReadFromJsonAsync<RequestJson>();

            responseRequest.EnsureSuccessStatusCode();
            Assert.Equal(userRequest.name, houseProjectTest.name);
        }

        // POST - тестироание добавление заявления на строительство с неправильными данными
        [Fact]
        public async void PostAddFakeRequest()
        {
            var responseHouseProject = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            RequestJson request = new RequestJson()
            {
                contentText = "Сколько времени уйдет на строительство дома по этому проекту?",
                userId = -1,
                houseProjectId = houseProjectId
            };

            var responseRequest = await _client.PostAsJsonAsync("/api/user/request", request);

            Assert.Equal(HttpStatusCode.NotFound, responseRequest.StatusCode);
        }



        //////////////////////////////////// PUT TEST ////////////////////////////////////

        // PUT - Обновление пользователя
        [Fact]
        public async void PutUpdateUser()
        {
            UserJson userData = new UserJson()
            {
                login = "RuslanUpdate1",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            using var responsePost = await _client.PostAsJsonAsync("/api/user/registration", userData);

            UserJson? user = await responsePost.Content.ReadFromJsonAsync<UserJson>();
            string newLogin = "RuslanUpdate1";
            user.login = newLogin;

            using var responsePut = await _client.PutAsJsonAsync("/api/user/update", user);
            UserJson? updatedUser = await responsePut.Content.ReadFromJsonAsync<UserJson>();
            responsePut.EnsureSuccessStatusCode();
            Assert.Equal(updatedUser.login, newLogin);
        }

        // PUT - Обновление пользователя
        [Fact]
        public async void PutUpdateSameUser()
        {
            UserJson userData = new UserJson()
            {
                login = "RuslanUpdate",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            using var responsePost1 = await _client.PostAsJsonAsync("/api/user/registration", userData);
            userData.login = "Ruslan2";
            using var responsePost2 = await _client.PostAsJsonAsync("/api/user/registration", userData);
            UserJson? user = await responsePost2.Content.ReadFromJsonAsync<UserJson>();
            string newLogin = "RuslanUpdate";
            user.login = newLogin;

            using var responsePut = await _client.PutAsJsonAsync("/api/user/update", user);
            string responseText = await responsePut.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.BadRequest, responsePut.StatusCode);
        }

        // PUT - Обновление пользователя
        [Fact]
        public async void PutUpdateFakeUser()
        {
            UserJson userData = new UserJson()
            {
                login = null
            };

            using var responsePut = await _client.PutAsJsonAsync("/api/user/update", userData);

            Assert.Equal(HttpStatusCode.NotFound, responsePut.StatusCode);
        }

        // PUT - Обновление несуществующего проекта дома
        [Fact]
        public async void PutUpdateHouseProject()
        {
            houseProjectSend.Add(new StringContent("-1"), "id");

            var responsePut = await _client.PutAsync("/api/project", houseProjectSend);

            Assert.Equal(HttpStatusCode.NotFound, responsePut.StatusCode);
        }


        //////////////////////////////////// DELETE TEST ////////////////////////////////////

        // DELETE - удаление существующего проекта дома
        [Theory]
        [InlineData("DELETE")]
        public async void DeleteHouseProject(string method)
        {
            var responseHouseProject = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            var request = new HttpRequestMessage(new HttpMethod(method), $"api/project/{houseProjectId}");
            var response = await _client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // DELETE - удаление несуществующего проекта дома
        [Theory]
        [InlineData("DELETE")]
        public async void DeleteFakeHouseProject(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), $"api/project/{-1}");
            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // DELETE - удаление существующего запроса на строительство
        [Theory]
        [InlineData("DELETE")]
        public async void DeleteRequest(string method)
        {
            var responseHouseProject = await _client.PostAsync("/api/project", houseProjectSend);
            int houseProjectId = Convert.ToInt32(await responseHouseProject.Content.ReadAsStringAsync());

            UserJson userData = new UserJson()
            {
                login = "UserDeleteRequest",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            var responsePostUser = await _client.PostAsJsonAsync("/api/user/registration", userData);
            UserJson? user = await responsePostUser.Content.ReadFromJsonAsync<UserJson>();

            RequestJson request = new RequestJson()
            {
                contentText = "Сколько времени уйдет на строительство дома по этому проекту?",
                userId = user.id,
                houseProjectId = houseProjectId
            };

            var responseRequest = await _client.PostAsJsonAsync("/api/user/request", request);
            RequestJson? userRequest = await responseRequest.Content.ReadFromJsonAsync<RequestJson>();

            var deleteRequest = new HttpRequestMessage(new HttpMethod(method), $"api/admin/request?id={userRequest.id}");
            var deleteResponse = await _client.SendAsync(deleteRequest);

            deleteResponse.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
        }

        // DELETE - удаление существующего запроса на строительство
        [Theory]
        [InlineData("DELETE")]
        public async void DeleteFakeRequest(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), $"api/admin/request?id={-1}");
            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // DELETE - Удаление пользователя
        [Theory]
        [InlineData("DELETE")]
        public async void DeleteUser(string method)
        {
            UserJson userData = new UserJson()
            {
                login = "RuslanUser",
                password = "Password",
                role = "User",
                email = "bikbaev-ruslan@mail.ru",
                phoneNumber = "89179020000",
            };
            using var responsePost = await _client.PostAsJsonAsync("/api/user/registration", userData);

            UserJson? user = await responsePost.Content.ReadFromJsonAsync<UserJson>();

            var request = new HttpRequestMessage(new HttpMethod(method), $"api/admin/users?id={user.id}");
            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // DELETE - Удаление несуществующего пользователя
        [Theory]
        [InlineData("DELETE")]
        public async void DeleteFakeUser(string method)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), $"api/admin/users?id={-1}");
            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
