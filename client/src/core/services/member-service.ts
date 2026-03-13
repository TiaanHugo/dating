import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Message, Photo } from '../../types/member';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal<boolean>(false);
  member = signal<Member | null>(null);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => {
        this.member.set(member);
      })
    )
  }

  updateMember(member: EditableMember){
    return this.http.put(this.baseUrl + 'members', member);
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  getMessages(id: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/' + id);
  }
}