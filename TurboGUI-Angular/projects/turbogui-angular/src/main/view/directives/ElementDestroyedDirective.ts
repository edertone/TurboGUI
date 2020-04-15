/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Directive, OnDestroy, EventEmitter, Output } from '@angular/core';


/** This directive is used to listen for onDestroy events on raw html elements */
@Directive({
  selector: '[elementDestroyed]'
})


/**
 * This directive is used to listen for onDestroy events on raw html elements
 * If we place (elementDestroyed)="someMethod()" on the element at the html template part, when the element
 * that uses this directive is visually destroyed from the screen, someMethod() will be called.
 */
export class ElementDestroyedDirective implements OnDestroy {


    /**
     * Event that will be dispatched once element is destroyed
     */
    @Output('elementDestroyed')
    public elementDestroyed: EventEmitter<ElementDestroyedDirective> = new EventEmitter();


    /**
     * Listen for the on destroy event
     */
    ngOnDestroy() {

        this.elementDestroyed.next(this);
    }

}
