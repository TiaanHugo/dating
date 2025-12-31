using System;

namespace API.Entities;

public class Message
{
    public int Id { get; set; }
    public string SenderId { get; set; } = null!;
    public string SenderDisplayName { get; set; } = null!;
    public string SenderImageUrl { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string RecipientId { get; set; } = null!;
}

