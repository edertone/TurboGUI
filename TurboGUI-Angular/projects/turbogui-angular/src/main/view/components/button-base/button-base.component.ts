/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { HostBinding, HostListener, Input, OnInit } from '@angular/core';


/**
 * This is the base class for all button components
 */
export abstract class ButtonBaseComponent implements OnInit {


    /**
     * Defines the actual opacity that is binded on the html part
     */
    @HostBinding('style.opacity') currentOpacity = .7;


    /**
     * Defines the actual opacity that is binded on the html part
     */
    @HostBinding('style.transform') currentScale = 'scale(1)';


    /**
     * Specifies if the button animations must rollback when the user releases the mouse or pointer after pressing it
     */
    @Input() releaseOnMouseUp = true;


    /**
     * Defines the button opacity when it is not clicked
     */
    @Input() defaultOpacity = .7;


    /**
     * Defines the image scale when it is not clicked
     */
    @Input() defaultScale = 1;


    /**
     * Defines the button opacity when it is hovered
     */
    @Input() hoverOpacity = .8;


    /**
     * Defines the image scale when it is hovered
     */
    @Input() hoverScale = 1;


    /**
     * Defines the button opacity when it is clicked
     */
    @Input() clickOpacity = 1;


    /**
     * Defines the image scale when it is clicked
     */
    @Input() clickScale = 1;


    /**
     * Set button default values
     */
    ngOnInit() {

        this.currentOpacity = this.defaultOpacity;
        this.currentScale = 'scale(1)';
    }


    /**
     * Listens for the mouse over the button component
     */
    @HostListener('mouseover')
    onMouseOver() {

        this.currentOpacity = this.hoverOpacity;
        this.currentScale = 'scale(' + (this.hoverScale as any as string) + ')';
    }


    /**
     * Listens for the mouse out of the button component
     */
    @HostListener('mouseout')
    @HostListener('pointerout')
    @HostListener('pointerleave')
    onMouseOut() {

        this.currentOpacity = this.defaultOpacity;
        this.currentScale = 'scale(' + (this.defaultScale as any as string) + ')';
    }


    /**
     * Listens for the mouse down on the button component
     */
    @HostListener('mousedown')
    @HostListener('pointerdown')
    onMouseDown() {

        this.currentOpacity = this.clickOpacity;
        this.currentScale = 'scale(' + (this.clickScale as any as string) + ')';
    }


    /**
     * Listens for the mouse up of the button component
     */
    @HostListener('mouseup')
    @HostListener('pointerup')
    onMouseUp() {

        if (this.releaseOnMouseUp) {

            this.currentOpacity = this.defaultOpacity;
            this.currentScale = 'scale(' + (this.defaultScale as any as string) + ')';
        }
    }
}
