using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        string? memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        List<SeedUserDto>? members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        if (members == null) { Console.WriteLine("No members in seed data."); return; }


        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordSalt = hmac.Key,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    City = member.City,
                    Country = member.Country,
                    Gender = member.Gender,
                    ImageUrl = member.ImageUrl,
                    Created = member.Created,
                    DateOfBirth = member.DateOfBirth,
                    Description = member.Description,
                    LastActive = member.LastActive
                }
            };

            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!,
                MemberId = member.Id
            });
            await context.Users.AddAsync(user);
        }
        await context.SaveChangesAsync();
    }
}
