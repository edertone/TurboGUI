/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FadeAnimationClass } from '../../animations/fade.animation';
import { ButtonBaseComponent } from '../../../view/components/button-base/button-base.component';


/**
 * This component is a basic button that uses an image as its visual appearance
 */
@Component({
  	selector: 'tg-button-image',
  	standalone: true,
	imports: [],
	providers: [],
  	templateUrl: './button-image.component.html',
  	animations: [FadeAnimationClass.getTrigger('buttonFade', '300ms ease', '300ms ease')],
  	styleUrls: ['./button-image.component.scss']
})


export class ButtonImageComponent extends ButtonBaseComponent implements OnInit {


    /**
     * This is used to attach the fade animation directly to this component so it fades in and out when created and removed from the app
     */
    @HostBinding('@buttonFade') buttonFade = true;


    /**
     * Defines the path to the image that is shown by this button
     */
    @Input() src = '';


    /**
     * Defines the percentual size of the image based on the button size. 100 means the image will fill the whole button,
     * 50 only half, etc..
     */
    @Input() percentSize = 100;
}
