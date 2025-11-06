/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { BrowserManager } from 'turbocommons-ts';
import { Location, PopStateEvent } from '@angular/common';


/**
 * An abstraction of the browser entity an all its related operations and properties
 */
@Injectable({
  providedIn: 'root',
})
export class BrowserService extends BrowserManager {


    constructor(private readonly location: Location) {

        super();
    }


    /**
     * Modify the current browser URI without reloading the current page document
     *
     * @param path The uri value we want to set
     * @param query The query url parameters part we want to specify if any
     *
     * @returns void
     */
    setCurrentUrlURI(path: string, query?: string | undefined){

        this.location.go(path, query);
    }
    
    
    /**
     * Obtain a subscription to get notified on any changes at the browser url
     *
     * @param onNext A method to be executed every time the url changes on the browser. The url will be available inside the value parameter
     *
     * @returns Subscribed events. Make sure to unsubscribe when not needed
     */
    subscribeToUrlChange(onNext: (value: PopStateEvent) => void){
        
        return this.location.subscribe(onNext);
    }
}
