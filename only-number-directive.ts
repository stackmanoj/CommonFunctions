import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  allowedKeys = [
    'Backspace', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab', 'Delete', 'Home', 'End'
  ];

  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('keypress', ['$event'])
  onInput(event: any) {
    let key: string = event.key;
    let controlOrCommand = (event.ctrlKey === true || event.metaKey === true);
    if (this.allowedKeys.indexOf(key) != -1 ||
      (key == 'a' && controlOrCommand) ||
      (key == 'c' && controlOrCommand) ||
      (key == 'v' && controlOrCommand) ||
      (key == 'x' && controlOrCommand)) {
      return true;
    }
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

