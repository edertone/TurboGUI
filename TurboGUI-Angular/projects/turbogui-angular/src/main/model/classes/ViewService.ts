/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { ViewContainerRef } from "@angular/core";


/**
 * Defines a service that is attached to an application view.
 * All our service components that are linked to a view must extend this class so they can be correctly initialized at the view constructor.
 */
export abstract class ViewService {


	/**
	 * A reference to the view container ref which is necessary to propagate the view providers and services to related dialogs
	 */
    viewContainerRef: ViewContainerRef;	
}
