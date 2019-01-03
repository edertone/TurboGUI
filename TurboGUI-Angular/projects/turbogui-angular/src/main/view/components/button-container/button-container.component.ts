/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, HostBinding } from '@angular/core';
import { FadeAnimationClass } from '../../animations/fade.animation';
import { ButtonBaseComponent } from '../../../view/components/button-base/button-base.component';


/**
 * This component is a basic button without visual appearance, that is used as a container to load any content.
 */
@Component({
  selector: 'tg-button-container',
  templateUrl: './button-container.component.html',
  animations: [FadeAnimationClass.getTrigger('buttonFade', '300ms ease', '300ms ease')],
  styleUrls: ['./button-container.component.scss']
})


export class ButtonContainerComponent extends ButtonBaseComponent {


    /**
     * This is used to attach the fade animation directly to this component so it fades in and out when created and removed from the app
     */
    @HostBinding('@buttonFade') buttonFade = true;
}
