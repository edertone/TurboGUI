/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { FormControl, Validators } from '@angular/forms';
import { StringUtils } from 'turbocommons-ts';


/**
 * Validation class that extends the base angular Form Validators class and adds extra useful validators 
 */
export class ValidatorsPlus extends Validators {
    
    
    /**
     * Verify that the data of a form value is required and also Not semantically empty, just like the
     * TurboCommons StringUtils.isEmpty method does
     */
    static nonEmpty(control: FormControl) {

        // Apply first the required validation
        let validateRequired = Validators.required(control);
        
        if(validateRequired !== null){

            return validateRequired;
        }
                
        // first check if the control has a value
        if (control.value && control.value.length > 0) {

            if(!StringUtils.isEmpty(control.value)){
                
                return null;
            
            }else{
                
                return { isEmpty: true };
            }
            
        } else {
            
          return null;
        }
    }
}
