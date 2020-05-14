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
 * Defines the service base class for a view service class. All services that are used by views must extend this.
 * We must create the view services as an @Injectable() angular class which will be globally available at any time, but we must take
 * into consideration that the view model will only be instantiated when the view is active.
 */
export abstract class ViewService<T extends ViewModel> {


    /**
     * Class requires a views service instance
     */
    constructor(private readonly viewsService: ViewsService) {
    }


    /**
     * A reference to the currently active view model
     */
    get model(): T {

        return this.viewsService.model as T;
    }
}
