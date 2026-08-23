import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  EditableMember,
  Member,
  MemberParams,
  Message,
  Photo
} from '../../types/member';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  editMode = signal<boolean>(false);
  member = signal<Member | null>(null);

  getMembers(memberParams: MemberParams): Observable<PaginatedResult<Member>> {
    let params = new HttpParams()
      .set('pageNumber', memberParams.pageNumber.toString())
      .set('pageSize', memberParams.pageSize.toString())
      .set('minAge', memberParams.minAge.toString())
      .set('maxAge', memberParams.maxAge.toString())
      .set('orderBy', memberParams.orderBy);

    if (memberParams.gender) {
      params = params.set('gender', memberParams.gender);
    }

    return this.http.get<PaginatedResult<Member>>(
      this.baseUrl + 'members',
      { params }
    );
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(
      this.baseUrl + 'members/' + id
    );
  }

  updateMember(member: EditableMember) {
    return this.http.put(
      this.baseUrl + 'members',
      member
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(
      this.baseUrl + 'members/' + id + '/photos'
    );
  }

  getMessages(id: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/' + id
    );
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Photo>(
      this.baseUrl + 'members/add-photo',
      formData
    );
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(
      this.baseUrl + 'members/set-main-photo/' + photo.id,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(
      this.baseUrl + 'members/delete-photo/' + photoId
    );
  }
}