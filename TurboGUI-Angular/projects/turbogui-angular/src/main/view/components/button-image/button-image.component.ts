/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, HostBinding, Input, HostListener, OnInit } from '@angular/core';
import { FadeAnimationClass } from '../../animations/fade.animation';


/**
 * This component is a basic button that uses an image as its visual appearance
 */
@Component({
  selector: 'tg-button-image',
  templateUrl: './button-image.component.html',
  animations: [FadeAnimationClass.getTrigger('buttonImageFade', '300ms ease', '300ms ease')],
  styleUrls: ['./button-image.component.scss']
})


export class ButtonImageComponent implements OnInit {


    /**
     * This is used to attach the fade animation directly to this component so it fades in and out when created and removed from the app
     */
    @HostBinding('@buttonImageFade') buttonImageFade = true;


    /**
     * Defines the path to the image thatis shown by this button
     */
    @Input() src = '';


    /**
     * Defines the button opacity when it is not clicked
     */
    @Input() defaultOpacity = .7;


    /**
     * Defines the button opacity when it is hovered
     */
    @Input() hoverOpacity = .8;


    /**
     * Defines the button opacity when it is clicked
     */
    @Input() clickOpacity = 1;


    /**
     * Defines the actual opacity that is binded to the html part
     */
    currentOpacity = .7;


    /**
     * Set button default values
     */
    ngOnInit() {

        this.currentOpacity = this.defaultOpacity;
    }


    /**
     * Listens for the mouse over the button component
     */
    @HostListener('mouseover')
    onMouseOver() {

        this.currentOpacity = this.hoverOpacity;
    }


    /**
     * Listens for the mouse out of the button component
     */
    @HostListener('mouseout')
    onMouseOut() {

        this.currentOpacity = this.defaultOpacity;
    }


    /**
     * Listens for the mouse down on the button component
     */
    @HostListener('mousedown')
    onMouseDown() {

        this.currentOpacity = this.clickOpacity;
    }


    /**
     * Listens for the pointer down on the button component
     */
    @HostListener('pointerdown')
    onPointerDown() {

        this.currentOpacity = this.clickOpacity;
    }


    /**
     * Listens for the pointer up on the button component
     */
    @HostListener('pointerup')
    onPointerUp() {

        this.currentOpacity = this.defaultOpacity;
    }
}
