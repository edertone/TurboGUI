/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Type, ViewContainerRef, Injectable, ComponentFactoryResolver } from '@angular/core';
import { View } from '../model/classes/View';


/**
 * Manages adding, removing and manipulationg the application views
 */
@Injectable()
export class ViewsService {


    /**
     * See getter method for docs
     */
    private _isViewLoaded = false;


    /**
     * See setter method for docs
     */
    private _viewContainerRef: ViewContainerRef | null = null;


    constructor(private readonly componentFactoryResolver: ComponentFactoryResolver) {

    }


    /**
     * Tells if there's any view currently loaded on the application views container
     */
    get isViewLoaded() {

        return this._isViewLoaded;
    }


    /**
     * Stores a reference to the visual element that will be used as the container for all the views.
     * This is automatically assigned by the tg-views-container component once it is created.
     *
     * @see ViewsContainerComponent for more information
     */
    set viewContainerRef(ref: ViewContainerRef) {

        if (this._viewContainerRef !== null) {

            throw new Error('Views container already defined. Only one views container element can exist on an application');
        }

        this._viewContainerRef = ref;
    }


    /**
     * Create a new view instance with the specified type and add it to the current application views container.
     *
     * Make sure this method is called when all the visual components of the application have been created (ngAfterViewInit)
     *
     * @param view The classname for the view that we want to create and add to the views container.
     */
    addView(view: Type<View>) {

        this.verifyViewsContainerExist();

        const factory = this.componentFactoryResolver.resolveComponentFactory(view);

        const componentRef = (this._viewContainerRef as ViewContainerRef).createComponent(factory);

        componentRef.changeDetectorRef.detectChanges();

        this._isViewLoaded = true;

        return componentRef;
    }


    /**
     * TODO
     */
    getModel() {

        return null;
    }


    /**
     * Delete the currently loaded view from the views container.
     * If no view is currently loaded, this method will do nothing
     */
    removeView() {

        this.verifyViewsContainerExist();

        if (this._isViewLoaded) {

            (this._viewContainerRef as ViewContainerRef).clear();
        }

        this._isViewLoaded = false;
    }


    /**
     * Auxiliary method to test if the views container instance is available on the application
     */
    private verifyViewsContainerExist() {

        if (this._viewContainerRef === null) {

            throw new Error('Views container not defined. Please declare a <views-container> element in your application');
        }
    }
}
