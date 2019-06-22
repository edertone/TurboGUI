/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Type } from '@angular/core';
import { ViewModel } from '../../model/classes/ViewModel';


/**
 * Defines an application view.
 * Our View components must extend this class so they can be manipulated via ViewsService
 */

export abstract class View {


    /**
     * The class for the model that is associated to this view.
     * A new model instance will be automatically created each time the view is
     * added to the views container
     */
    static readonly modelClass: null | Type<ViewModel> = null;
}
