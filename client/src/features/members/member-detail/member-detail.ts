import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Member } from '../../../types/member';
import { filter, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css'
})
export class MemberDetail implements OnInit {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // Initializing to null is a good practice for observables
  protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  ngOnInit(): void {
    // Use ngOnInit for initialization logic
    this.route.data.subscribe({
      next: (data) => {
        this.member.set(data['member']);
      }
    });
    this.title.set(this.route.firstChild?.snapshot?.title)

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })

  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;
    return this.memberService.getMember(id);
  }

  like() {
    const member = this.member();
    if (!member) return;

    this.memberService.addLike(member.id).subscribe({
      next: () => {
        console.log('You have liked ' + member.id);
      }
    });
  }
}