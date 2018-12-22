/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, HostBinding } from '@angular/core';
import { FadeAnimationClass } from '../../animations/fade.animation';


/**
 * This component is used by turboGUI angular library to show the busy state to the user.
 * It is used to block all the user input and progressively shows a busy cursor to notify that the application
 * is waiting for something.
 *
 * We can (should) override this component with our own one to adapt its visual appearance to our application.
 * We can then set dialogService.busyStateComponentClass to our component class at the application start to to
 * override the default one.
 */
@Component({
  selector: 'tg-busy-state-base',
  templateUrl: './busy-state-base.component.html',
  animations: [FadeAnimationClass.getTrigger('busyStateBaseFade', '1s ease', '400ms ease')],
  styleUrls: ['./busy-state-base.component.scss']
})


export class BusyStateBaseComponent {


    /**
     * This is used to attach the fade animation directly to this component so it fades in and out when created and removed from the app
     */
    @HostBinding('@busyStateBaseFade') busyStateBaseFade = true;
}
