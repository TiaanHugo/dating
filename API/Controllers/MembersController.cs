using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member != null)
            {
                return Ok(member);
            }
            return NotFound();
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            var photos = await memberRepository.GetPhotosForMemberAsync(id);
            if (photos != null)
            {
                return Ok(photos);
            }
            return NotFound();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateMember(string id, Member dto)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();

            member.City = dto.City;
            member.Country = dto.Country;
            member.Description = dto.Description;

            memberRepository.Update(member);

            return await memberRepository.SaveAllAsync()
                ? NoContent()
                : BadRequest("Failed to update member");
        }

    }
}
