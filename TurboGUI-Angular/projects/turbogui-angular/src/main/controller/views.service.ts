/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Type, ViewContainerRef, Injectable, ComponentFactoryResolver } from '@angular/core';
import { View } from '../model/classes/View';
import { ViewModel } from '../model/classes/ViewModel';


/**
 * Manages adding, removing and manipulating the application views
 */
@Injectable()
export class ViewsService {


    /**
     * See getter method for docs
     */
    private _loadedViewClass: Type<View> | null = null;


    /**
     * An instance of the model that is assigned to the currently loaded view
     */
    private _loadedViewModel: ViewModel | null = null;


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

        return this._loadedViewClass !== null;
    }


    /**
     * Stores a reference to the visual element that will be used as the container for all the views.
     * This is automatically assigned by the tg-views-container component once it is created.
     *
     * @see ViewsContainerComponent for more information
     */
    set viewContainerRef(ref: ViewContainerRef | null) {

        if (ref !== null && this._viewContainerRef !== null) {

            throw new Error('Views container already defined. Only one views container element can exist on an application');
        }

        this._viewContainerRef = ref;
    }


    /**
     * Create a new view instance with the specified type and add it to the current application views container.
     *
     * Make sure this method is called when all the visual components of the application have been created (ngAfterViewInit)
     *
     * @param view The classname for the view that we want to create and add to the views container (must extend View base class).
     *
     * @return The instance of the newly added and created view. 
     */
    pushView(view: Type<View>) {

        // If a view is already loaded, we will unload it first
        if (this._loadedViewClass !== null) {

            // If the loaded view is the same as the specified one, we will do nothing
            if (this._loadedViewClass === view) {

                return;
            }

            this.popView();
        }

        this.verifyViewsContainerExist();
        
        const factory = this.componentFactoryResolver.resolveComponentFactory(view);

        const componentRef = (this._viewContainerRef as ViewContainerRef).createComponent(factory);

        this._loadedViewModel = componentRef.instance.modelClass !== null ? new (componentRef.instance.modelClass as any)() : null;

        componentRef.changeDetectorRef.detectChanges();

        this._loadedViewClass = view;

        return componentRef;
    }


    /**
     * Get the model that is instantiated for the currently active view. (A view model only lives while its view is active)
     * If no view model is assigned to the current view or no view is loaded, an exception will be thrown.
     *
     * @return The current view model instance, which must be casted to the appropiate ViewModel extended class
     */
    get model() {

        if (this._loadedViewModel === null) {

            throw new Error('No active model. Make sure a view is loaded with an assigned model. Do not access the model until view is initialized (for example on ngAfterViewInit)');
        }

        return this._loadedViewModel;
    }


    /**
     * Delete the currently loaded view from the views container.
     * If no view is currently loaded, this method will do nothing
     */
    popView() {

        this.verifyViewsContainerExist();

        if (this._loadedViewClass !== null) {

            (this._viewContainerRef as ViewContainerRef).clear();
        }

        this._loadedViewClass = null;
        this._loadedViewModel = null;
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
