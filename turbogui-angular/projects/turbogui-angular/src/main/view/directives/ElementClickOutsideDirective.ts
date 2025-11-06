/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';


/**
 * It is necessary to import TurboGuiAngularModule at the component that uses this directive
 * 
 * This directive is used to execute an action when the user clicks outside of an element.
 * 
 * If we set the elementClickOutside tag to the html element and set the clickOutsideElement event to a function: <element elementClickOutside (clickOutsideElement)="clickOutsideElement()" ...,
 * this function will be executed when the user clicks outside of the element.
 */
@Directive({
    selector: '[elementClickOutside]',
    standalone: false
})



export class ElementClickOutsideDirective {
    
    
    @Output() clickOutsideElement = new EventEmitter<void>();
  

    constructor(private readonly elementRef: ElementRef) {
    
    }
  

    @HostListener('document:click', ['$event.target']) onClick(targetElement: HTMLElement): void {
    
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    
        if (!clickedInside) {
            
            this.clickOutsideElement.emit();
        }
    }  
}
