/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';


/** This directive is used to perform an automatic select all text on an element every time it is focused */
@Directive({
  selector: '[autoSelectTextOnFocus]'
})


/**
 * This directive is used to perform an an automatic select all text on an element every time it is focused.
 * If we set the autoSelectTextOnFocus tag to the html element, its text will be automatically selected after it gets the focus.
 */
export class AutoSelectTextOnFocusDirective {
    
    
    constructor(private el: ElementRef, private renderer: Renderer2) {
    
        if (!el.nativeElement['select']) {
        
            throw new Error('Element does not accept select');
        }
    }
    
    
    @HostListener('focus', ['$event']) onFocus() {
    
        this.renderer.selectRootElement(this.el.nativeElement).select();
    }
}
