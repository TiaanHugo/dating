import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member-service';
import { inject } from '@angular/core';
import { EMPTY } from 'rxjs';
import { Member } from '../../types/member';

export const memberResolver: ResolveFn<Member> = (route) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return memberService.getMember(id!);
};
