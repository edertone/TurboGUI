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
 * This is a base class that helps managing our application views. We should extend this class to create our views, as it forces us
 * to set the viewContainerRef and the viewService, which are both used when working with views.
 * 
 * When using view services, it is important to specify the view service as a provider for the view component to ensure that it will
 * be created and destroyed when the view is created and destroyed. 
 */
export abstract class View {


	/**
	 * This constructor is specifically designed to force the view to set the viewContainerRef which will be automatically assigned
	 * to the respective view service. If the view has no service, we can set it to null, but it is recommended to always use a service with a view,
     * to store the view state and global methods that can be used by other components loaded in the view.
	 */
	constructor(public viewContainerRef: ViewContainerRef, public viewService:ViewService|null) {
	
		if(viewService !== null){
			
			viewService.viewContainerRef = viewContainerRef;
		}	
	}
}
