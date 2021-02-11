/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */


/**
 * Utilities to programatically operate with css styles and style sheets
 */
export class CSSUtils {


    /**
     * Obtain the style properties that are defined by the specified css class
     *
     * @param className The name for the css class we want to inspect
     *
     * @returns The list of css style values that are related to the specified class
     */
    public static getStylesFromClass(className:string):CSSStyleDeclaration {
        
        if(className.substring(0, 0) !== '.'){
            
            className = '.' + className;
        }
            
        let sheets = document.styleSheets;
        
        for (let i in sheets) {
            
            let rules = (sheets[i] as any).rules || (sheets[i] as any).cssRules;
                
            for (let r in rules) {
                
                if (className === (rules[r] as any).selectorText) {
                    
                    return (rules[r] as any).style;
                }
            }
        }
        
        throw new Error('css class not found: ' + className); 
    }
}