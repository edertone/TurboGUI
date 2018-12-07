import { Component, HostListener } from '@angular/core';


/**
 * Component that block all the user input and progressively shows a busy cursor to notify the user
 * that application is waiting for something
 */
@Component({
  selector: 'tg-busy-state',
  templateUrl: './busy-state.component.html',
  styleUrls: ['./busy-state.component.css']
})


export class BusyStateComponent {

    /** Listen to the parent app root element keydown and prevent it from happening */
    @HostListener('window:keydown', ['$event'])
    preventKeyboardEvents(event: UIEvent) {

        event.preventDefault();
    }


    /** Listen to the parent app root element mousedown and prevent it from happening */
    @HostListener('document:mousedown', ['$event'])
    preventClickEvents(event: UIEvent) {

        event.preventDefault();
    }


    /** Listen to the parent app root element pointerdown and prevent it from happening */
    @HostListener('document:pointerdown', ['$event'])
    preventPointerEvents(event: UIEvent) {

        event.preventDefault();
    }
}
