import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (isNaN(parseInt(event.data))) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    event.data = event.clipboardData.getData('Text');
    this.onInput(event);
  }
}
