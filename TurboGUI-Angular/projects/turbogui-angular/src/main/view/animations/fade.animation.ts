/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { trigger, animate, transition, style } from '@angular/animations';


/**
 * Fade animations
 */
@Injectable()
export class FadeAnimationClass {

    /**
     * Get a custom trigger to create fade animations when components are added or removed from the application
     *
     * @param triggerName The name for the trigger we want to create
     * @param enter The time and easing that we want to use for the enter state
     * @param leave The time and easing that we want to use for the leave state
     */
    static getTrigger(triggerName: string, enter = '1s ease', leave = '0s ease') {

        return trigger(triggerName, [
                                     transition(':enter', [style({opacity: 0}), animate(enter)]),
                                     transition(':leave', [style({opacity: 1}), animate(leave, style({opacity: 0}))])
                                    ]);
    }
}
