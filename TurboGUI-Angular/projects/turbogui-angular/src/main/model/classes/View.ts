/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { ViewContainerRef } from "@angular/core";
import { ViewService } from "./ViewService";


/**
 * Defines an application view.
 * Our View components must extend this class so they can be manipulated via ViewsService and be correctly linked to a views-container.
 */
export abstract class View {


	/**
	 * This constructor is specifically designed to force the view to set the viewContainerRef which will be automatically assigned
	 * to the respective view service. If the view has no service, we can set it to null.
	 */
	constructor(viewContainerRef: ViewContainerRef, viewService:ViewService|null) {
	
		if(viewService !== null){
			
			viewService.viewContainerRef = viewContainerRef;
		}	
	}
}
