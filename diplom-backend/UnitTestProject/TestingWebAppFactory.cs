using diplom_backend;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using diplom_backend.Models;


namespace UnitTestProject
{
    public class TestingWebAppFactory<TEntryPoint> :
WebApplicationFactory<Program> where TEntryPoint : Program
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<HouseProjectDBContext>));
                if (descriptor != null)
                    services.Remove(descriptor);
                object p = services.AddDbContext<HouseProjectDBContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryHouseProjectTest");
                });
                var sp = services.BuildServiceProvider();
                using (var scope = sp.CreateScope())
                using (var appContext =
                scope.ServiceProvider.GetRequiredService<HouseProjectDBContext>())
                {
                    try
                    {
                        appContext.Database.EnsureCreated();
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            });
        }

    }
}
