/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Type, inject } from "@angular/core";


/**
 * Defines a base class that can be used to create singleton services which cannot be instantiated more than one time
 * during the whole application lifetime.
 * 
 * To use it, simply extend this class and pass the parent class type to this constructor via super() 
 */
export class SingletoneStrictClass {
    
	constructor(classType: Type<any>) {
		
	    const parent = inject(classType, { skipSelf: true, optional: true});
	    
	    if (parent) {
			
	        throw Error(`[${classType.name}]: Can not create more than one instance`);
	    }
	}
}
