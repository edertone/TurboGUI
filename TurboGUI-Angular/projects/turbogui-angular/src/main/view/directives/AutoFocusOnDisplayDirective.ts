/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Directive, ElementRef, NgZone, Renderer2, AfterContentInit } from '@angular/core';


/** This directive is used to perform an autofocus on an element every time it is displayed */
@Directive({
  selector: '[autoFocusOnDisplay]'
})


/**
 * This directive is used to perform an autofocus on an element every time it is displayed
 * If we set the autoFocusOnDisplay tag to the html element, it will be automatically focused after it is shown.
 */
export class AutoFocusOnDisplayDirective implements AfterContentInit {
    
    
    constructor(private el: ElementRef, private zone: NgZone, private renderer: Renderer2) {
    
        if (!el.nativeElement['focus']) {
        
            throw new Error('Element does not accept focus');
        }
    }
    
    ngAfterContentInit() {
        
        this.zone.runOutsideAngular(() => setTimeout(() => {
            
            this.renderer.selectRootElement(this.el.nativeElement).focus();
            
        }, 0));
    }
}
