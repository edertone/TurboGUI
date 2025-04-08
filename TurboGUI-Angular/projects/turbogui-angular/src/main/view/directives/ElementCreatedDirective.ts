/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Directive, EventEmitter, Output, OnInit } from '@angular/core';


/** This directive is used to listen for onInit events on raw html elements */
@Directive({
    selector: '[elementCreated]',
    standalone: false
})


/**
 * This directive is used to listen for onInit events on raw html elements
 * If we place (elementCreated)="someMethod()" on the element at the html template part, when the element
 * that uses this directive is visually created, someMethod() will be called.
 */
export class ElementCreatedDirective implements OnInit {


    /**
     * Event that will be dispatched once element is created
     */
    @Output('elementCreated')
    public elementCreated: EventEmitter<ElementCreatedDirective> = new EventEmitter();


    /**
     * Listen for the on init event
     */
    ngOnInit() {

        this.elementCreated.next(this);
    }

}
