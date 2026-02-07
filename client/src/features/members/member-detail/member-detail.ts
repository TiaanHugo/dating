import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Member } from '../../../types/member';
import { filter } from 'rxjs';
import { AgePipe } from "../../../pipes/age-pipe";
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';

@Component({
  standalone: true,
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css'
})
export class MemberDetail implements OnInit {
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  // Initializing to null is a good practice for observables
  protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  });

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
}