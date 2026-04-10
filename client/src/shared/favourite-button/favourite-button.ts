import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';

@Component({
  selector: 'app-favourite-button',
  templateUrl: './favourite-button.html'
})
export class FavouriteButtonComponent {
  disabled = input<boolean>();
  selected = input<boolean>();
  clickEvent = output<Event>();

  onClick(event: Event){
    this.clickEvent.emit(event);
  }
}