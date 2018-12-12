/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, HostListener, HostBinding } from '@angular/core';
import { FadeAnimationClass } from '../../animations/fade.animation';


/**
 * Component that blocks all the user input and progressively shows a busy cursor to notify the user
 * that the application is waiting for something
 */
@Component({
  selector: 'tg-busy-state',
  templateUrl: './busy-state.component.html',
  animations: [FadeAnimationClass.getTrigger('busyStateFade', '1s ease', '400ms ease')],
  styleUrls: ['./busy-state.component.css']
})


export class BusyStateComponent {


    /**
     * This is used to attach the fade animation directly to this component so it fades in and out when created and removed from the app
     */
    @HostBinding('@busyStateFade') busyStateFade = true;


    /**
     * Listen to the parent app root element keydown and prevent it from happening
     */
    @HostListener('window:keydown', ['$event'])
    preventKeyboardEvents(event: UIEvent) {

        event.preventDefault();
    }


    /**
     * Listen to the parent app root element mousedown and prevent it from happening
     */
    @HostListener('document:mousedown', ['$event'])
    preventClickEvents(event: UIEvent) {

        event.preventDefault();
    }


    /**
     * Listen to the parent app root element pointerdown and prevent it from happening
     */
    @HostListener('document:pointerdown', ['$event'])
    preventPointerEvents(event: UIEvent) {

        event.preventDefault();
    }
}
