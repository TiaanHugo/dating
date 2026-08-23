import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';

import { MemberService } from '../../../core/services/member-service';
import {
  Member,
  MemberParams
} from '../../../types/member';

import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    MemberCard,
    Paginator,
    FilterModal
  ],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {

  @ViewChild('filterModal')
  modal!: FilterModal;

  private memberService = inject(MemberService);

  protected paginatedMembers =
    signal<PaginatedResult<Member> | null>(null);

  protected memberParams =
    new MemberParams();

  private updatedParams =
    new MemberParams();

  constructor() {
    this.loadSavedFilters();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  private loadSavedFilters(): void {
    const filters = localStorage.getItem('filters');

    if (!filters) {
      return;
    }

    try {
      const parsedFilters = JSON.parse(filters);

      this.memberParams = Object.assign(
        new MemberParams(),
        parsedFilters
      );

      this.updatedParams = Object.assign(
        new MemberParams(),
        parsedFilters
      );

    } catch {
      localStorage.removeItem('filters');

      this.memberParams = new MemberParams();
      this.updatedParams = new MemberParams();
    }
  }

  loadMembers(): void {
    this.memberService
      .getMembers(this.memberParams)
      .subscribe({
        next: members => {
          this.paginatedMembers.set(members);
        }
      });
  }

  onPageChange(
    event: {
      pageNumber: number;
      pageSize: number;
    }
  ): void {

    this.memberParams.pageNumber =
      event.pageNumber;

    this.memberParams.pageSize =
      event.pageSize;

    this.loadMembers();
  }

  openModal(): void {
    this.modal.open();
  }

  onClose(): void {
    // Nothing needs to happen here.
    // The modal maintains its own draft state.
  }

  onFilterChange(data: MemberParams): void {

    this.memberParams = Object.assign(
      new MemberParams(),
      data,
      {
        pageNumber: 1
      }
    );

    this.updatedParams = Object.assign(
      new MemberParams(),
      this.memberParams
    );

    localStorage.setItem(
      'filters',
      JSON.stringify(this.updatedParams)
    );

    this.loadMembers();
  }

  resetFilters(): void {

    this.memberParams =
      new MemberParams();

    this.updatedParams =
      new MemberParams();

    localStorage.removeItem('filters');

    this.loadMembers();
  }

  get displayMessage(): string {

    const defaultParams =
      new MemberParams();

    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(
        `${this.updatedParams.gender}s`
      );
    } else {
      filters.push(
        'Males, Females'
      );
    }

    if (
      this.updatedParams.minAge !==
        defaultParams.minAge ||
      this.updatedParams.maxAge !==
        defaultParams.maxAge
    ) {
      filters.push(
        `Ages ${this.updatedParams.minAge} - ${this.updatedParams.maxAge}`
      );
    }

    if (
      this.updatedParams.orderBy ===
      'lastActive'
    ) {
      filters.push(
        'Recently active'
      );
    } else {
      filters.push(
        'Newest members'
      );
    }

    return `Selected: ${filters.join(' | ')}`;
  }
}