/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { ViewModel } from '../../model/classes/ViewModel';
import { ViewsService } from '../../controller/views.service';


/**
 * Defines the service base class for an application view
 */
export abstract class ViewService<T extends ViewModel> {


    /**
     * Class requires a views service instance
     */
    constructor(private readonly viewsService: ViewsService) {
    }


    /**
     * A reference to the view model
     */
    protected get model(): T {

        return this.viewsService.model as T;
    }
}
