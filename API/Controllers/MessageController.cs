using API.Controllers;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class MessagesController : BaseApiController
{
    private readonly AppDbContext _context;

    public MessagesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /messages/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages(string id)
    {
        // Fetch messages where the user is the recipient or sender
        var messages = await _context.Messages
            .Where(m => m.RecipientId == id || m.SenderId == id)
            .OrderByDescending(m => m.Id)
            .ToListAsync();

        if (!messages.Any())
            return NotFound("No messages found for this user.");

        return Ok(messages);
    }

    [HttpPost]
    public async Task<ActionResult<Message>> CreateMessage(Message dto)
    {
        var message = new Message
        {
            SenderId = dto.SenderId,
            SenderDisplayName = dto.SenderDisplayName,
            SenderImageUrl = dto.SenderImageUrl,
            Content = dto.Content,
            RecipientId = dto.RecipientId
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMessages), new { id = message.RecipientId }, message);
    }

}
