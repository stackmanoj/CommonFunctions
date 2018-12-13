import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyDecimal]'
})
export class OnlyDecimal {

    constructor(private el: ElementRef) { }

    @Input() OnlyDecimal: OnlyDecimalParams;

    @HostListener('keypress', ['$event'])
    onInput(event: any) {
        let text = (<HTMLInputElement>event.currentTarget).value;
        if (event.key != '.' && isNaN(parseInt(event.key))) {
            event.preventDefault();
            return;
        }
        if (event.key == '.' && text.indexOf('.') > -1) {
            event.preventDefault();
            return;
        }
        text = text.substring(0, event.target.selectionStart) + event.key + text.substring(event.target.selectionEnd);
        let arr = text.split('.');
        if (arr[0] != undefined && arr[0].length > this.OnlyDecimal.maxDigitsBeforeDot) {//&& event.target.selectionStart > text.indexOf('.')
            event.preventDefault();
            return;
        }
        if (arr[1] != undefined && arr[1].length > this.OnlyDecimal.maxDigitsAfterDot) {//&& event.target.selectionStart <= text.indexOf('.') 
            event.preventDefault();
            return;
        }
    }
}
export class OnlyDecimalParams {
    maxDigitsBeforeDot: number;
    maxDigitsAfterDot: number;
}
