namespace API.DTOs;

public class AdminUpdateUserDto
{
    public string? Email { get; set; }
    public string? DisplayName { get; set; }
    public string? Description { get; set; }
    public string? Gender { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Password { get; set; }
}
