using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ServiceFilter(typeof(API.Helpers.AdminPasswordFilter))]
public class AdminController(AppDbContext context) : BaseApiController
{
    [HttpGet("users")]
    public async Task<ActionResult<IReadOnlyList<AdminUserDto>>> GetUsers()
    {
        var users = await context.Users
            .Include(x => x.Member)
            .Select(x => new AdminUserDto
            {
                Id = x.Id,
                Email = x.Email,
                DisplayName = x.DisplayName,
                ImageUrl = x.ImageUrl,
                Description = x.Member.Description,
                Gender = x.Member.Gender,
                City = x.Member.City,
                Country = x.Member.Country
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("users/{id}")]
    public async Task<ActionResult<AdminUserDto>> GetUser(string id)
    {
        var user = await context.Users.Include(x => x.Member).SingleOrDefaultAsync(x => x.Id == id);
        if (user == null) return NotFound();

        return new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            ImageUrl = user.ImageUrl,
            Description = user.Member.Description,
            Gender = user.Member.Gender,
            City = user.Member.City,
            Country = user.Member.Country
        };
    }

    [HttpPut("users/{id}")]
    public async Task<ActionResult> UpdateUser(string id, AdminUpdateUserDto dto)
    {
        var user = await context.Users.Include(x => x.Member).SingleOrDefaultAsync(x => x.Id == id);
        if (user == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var emailExists = await context.Users.AnyAsync(x => x.Id != id && x.Email.ToLower() == dto.Email.ToLower());
            if (emailExists) return BadRequest("Email address is already in use.");
            user.Email = dto.Email.Trim();
        }

        if (dto.DisplayName != null)
        {
            user.DisplayName = dto.DisplayName;
            user.Member.DisplayName = dto.DisplayName;
        }
        if (dto.Description != null) user.Member.Description = dto.Description;
        if (dto.Gender != null) user.Member.Gender = dto.Gender;
        if (dto.City != null) user.Member.City = dto.City;
        if (dto.Country != null) user.Member.Country = dto.Country;

        if (!string.IsNullOrEmpty(dto.Password))
        {
            if (dto.Password.Length < 4) return BadRequest("Password must be at least 4 characters.");
            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            user.PasswordSalt = hmac.Key;
        }

        await context.SaveChangesAsync();
        return NoContent();
    }
}
