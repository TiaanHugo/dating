import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member, Message, Photo } from '../../types/member';
import { Observable } from 'rxjs';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.apiUrl;
  editMode = signal<boolean>(false);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }

  updateMember(id: string, dto: any) {
    return this.http.put(
      `${this.baseUrl}members/${id}`,
      dto
    );
  }



  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  getMessages(id: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/' + id);
  }
}