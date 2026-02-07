import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm: NgForm | undefined;
  protected memberService = inject(MemberService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined);
  protected editableMember: EditableMember = {
    displayName: '',
    city: '',
    country: '',
    description: ''
  };


  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data['member']);
    })
    this.editableMember = {
      displayName: this.member()?.displayName || '',
      city: this.member()?.city || '',
      country: this.member()?.country || '',
      description: this.member()?.description || ''
    }
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

  updateProfile() {
    if (!this.member() || !this.editableMember) return;
    const updatedMember = { ...this.member(), ...this.editableMember };
    console.log(updatedMember);
    this.toastService.success('Profile updated successfully');
    this.memberService.editMode.set(false);
  }

}
