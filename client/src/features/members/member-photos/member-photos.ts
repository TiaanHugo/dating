import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, Photo } from '../../../types/member';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { FavouriteButtonComponent } from "../../../shared/favourite-button/favourite-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, FavouriteButtonComponent, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal<boolean>(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')!;
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe(photos => {
        this.photos.set(photos);
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: error => {
        console.log('Error uploading photo:', error);
        this.loading.set(false);
      }
    })
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photo.id));
      },
      error: err => {
        console.error('Failed to delete photo:', err);
      }
    });
  }


  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          currentUser.imageUrl = photo.url;
          this.accountService.setCurrentUser(currentUser);
          this.memberService.member.update(member => {
            if (!member) return member;
            return {
              ...member,
              imageUrl: photo.url
            } as Member;
          });
        }
      },
      error: err => {
        console.error('Failed to set main photo:', err);
      }
    });
  }
}
