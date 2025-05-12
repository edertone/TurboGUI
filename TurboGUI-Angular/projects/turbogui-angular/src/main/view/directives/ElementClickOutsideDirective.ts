/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';


/** This directive is used to trigger an event when the user clicks outside of an element */
@Directive({
    selector: '[elementClickOutside]',
    standalone: false
})


/**
 * This directive is used to execute an action when the user clicks outside of an element.
 * If we set the elementClickOutside tag to the html element and set the onClickOutside event to a function: <element elementClickOutside (onClickOutside)="onClickedOutside()" ...,
 * this function will be executed when the user clicks outside of the element.
 */
export class ElementClickOutsideDirective {
    
    
    @Output() onClickOutside = new EventEmitter<void>();
  

    constructor(private readonly elementRef: ElementRef) {
    
    }
  

    @HostListener('document:click', ['$event.target']) onClick(targetElement: HTMLElement): void {
    
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    
        if (!clickedInside) {
            
            this.onClickOutside.emit();
        }
    }  
}
