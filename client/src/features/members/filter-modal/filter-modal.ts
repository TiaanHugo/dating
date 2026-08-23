import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberParams } from '../../../types/member';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css'
})
export class FilterModal {
  @ViewChild('filterModal')
  modalRef!: ElementRef<HTMLDialogElement>;

  memberParams = input.required<MemberParams>();

  closeModal = output<void>();
  submitData = output<MemberParams>();

  protected draftParams = signal(new MemberParams());

  open(): void {
    // Make a completely separate copy.
    // This is what allows Cancel to actually cancel.
    this.draftParams.set(
      Object.assign(
        new MemberParams(),
        this.memberParams()
      )
    );

    this.modalRef.nativeElement.showModal();
  }

  close(): void {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit(): void {
    const updatedParams = Object.assign(
      new MemberParams(),
      this.draftParams()
    );

    this.submitData.emit(updatedParams);
    this.close();
  }

  onMinAgeChange(): void {
    const params = this.draftParams();

    if (params.minAge < 18) {
      params.minAge = 18;
    }

    if (params.minAge > params.maxAge) {
      params.maxAge = params.minAge;
    }

    this.draftParams.set({ ...params });
  }

  onMaxAgeChange(): void {
    const params = this.draftParams();

    if (params.maxAge < 18) {
      params.maxAge = 18;
    }

    if (params.maxAge < params.minAge) {
      params.minAge = params.maxAge;
    }

    this.draftParams.set({ ...params });
  }
}