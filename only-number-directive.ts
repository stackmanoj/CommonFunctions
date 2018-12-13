import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('keypress', ['$event'])
  onInput(event: any) {
    if (isNaN(parseInt(event.key))) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    event.key = event.clipboardData.getData('Text');
    this.onInput(event);
  }
}
