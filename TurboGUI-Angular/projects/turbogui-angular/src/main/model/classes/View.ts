/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Type } from '@angular/core';
import { ViewModel } from '../../model/classes/ViewModel';


/**
 * Defines an application view.
 * Our View components must extend this class so they can be manipulated via ViewsService
 */

export abstract class View {
    

    /**
     * This method is used to obtain the model instance that is related to this view.
     * 
     * We must declare this method in our view class to return the value of the currently active model, which is normally
     * retrieved via --> return this.viewsService.model as OurViewClassModel; <-- Where OurViewClassModel is the type of the model class.
     * If we are not using a mode with our class, we can set this method to simply return null.
     */
    abstract get model(): any;
    
    
    private _modelClass: null | Type<ViewModel> = null;

    
    /**
     * In order for the views service to know which model class must be created when setting a new active view,
     * each view must specify the class for the view model at the overriden constructor super() call.
     * All view models must also extend ViewModel. If we do not plan to attach a model to a view, we can pass a null value to 
     * the constructor super() call.
     *
     * A new model instance will be automatically created each time the view is added to the views container, and 
     * destroyed when the view is removed. So the view model will only live while the view is active on the views service.
     */
    constructor(modelClass: null | Type<ViewModel>) {
    
        this._modelClass = modelClass;    
    }

    
    /**
     * Obtain the class type for the model that is linked to this view, or null if the view model is not yet instantiated.
     */
    get modelClass() {
        
        return this._modelClass;
    }
}
