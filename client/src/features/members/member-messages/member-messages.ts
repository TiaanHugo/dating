import { Component, inject } from '@angular/core';
import { Message } from '../../../types/member';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-messages',
  imports: [AsyncPipe],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages {
  protected messages$?: Observable<Message[]>;
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')!;
    if (memberId) {
      this.messages$ = this.memberService.getMessages(memberId);
    }
  }

}
