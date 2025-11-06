/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */


/**
 * Utilities to programatically operate with the browser DOM
 */
export class DOMUtils {


    /**
     * Obtain an HTML element object instance that is created from a provided html raw string
     *
     * @param rawCode Html code to convert to a single html element
     *
     * @returns The generated html element
     */
    public static stringToHtmlElement(rawCode:string) {
        
        let template = document.createElement('template');
        
        template.innerHTML = rawCode.trim();
        
        return template.content.firstChild; 
    }
}