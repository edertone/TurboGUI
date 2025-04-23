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
 * This is a base class that helps managing our application pages.
 * We should extend this class to create our application pages, as it forces us to set the viewContainerRef and the viewService, 
 * which are both used when working with pages.
 * 
 * IMPORTANT!!! View services are created and destroyed when the page is created and destroyed. It is vital to specify the view service 
 * as a provider for the page to ensure that it will be created and destroyed when the view is created and destroyed.
 * 
 * Example:
 * 
 * @Component({
 *   ...
 *   selector: 'app-my-view-page',
 *   providers: [MyViewService]
 *   ...
 *})  
 */
export abstract class View {


	/**
	 * This constructor is specifically designed to force the following:
     * 
     * - Set the viewContainerRef which will be automatically assigned to the respective view service.
     * 
     * - If the view has no service, we can set it to null, but it is recommended to always use a service with a view, to store the view state and global methods 
	 */
	constructor(public viewContainerRef: ViewContainerRef, public viewService:ViewService|null) {
	
		if(viewService !== null){
			
			viewService.viewContainerRef = viewContainerRef;
		}
	}
}
