import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  pageNumber = model(1);
  pageSize = model(10);
  totalCount = input(0);
  totalPages = input(1);

  pageSizeOptions = input([5, 10, 20, 50]);
  
  pageChange = output<{ pageNumber: number, pageSize: number }>();

  lastItemIndex() {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount());
  }

  onPageChange(newPage?: number, pageSizeEvent?: EventTarget | null) {
  if (newPage) this.pageNumber.set(newPage);

  if (pageSizeEvent) {
    const pageSizeValue = Number((pageSizeEvent as HTMLSelectElement).value);
    this.pageSize.set(pageSizeValue);
  }

  this.pageChange.emit({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize()
  });
}
}
