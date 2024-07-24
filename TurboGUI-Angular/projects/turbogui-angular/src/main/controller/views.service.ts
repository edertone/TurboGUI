/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Type, ViewContainerRef, Injectable, ComponentRef } from '@angular/core';
import { View } from '../model/classes/View';
import { SingletoneStrictClass } from '../model/classes/SingletoneStrictClass';
import { AnimationBuilder, animate, style } from '@angular/animations';


/**
 * Manages adding, removing and manipulating the application views
 */
@Injectable({
  providedIn: 'root',
})
export class ViewsService extends SingletoneStrictClass {


    /**
     * See getter method for docs
     */
    private _loadedViewClass: Type<View> | null = null;


    /**
     * See setter method for docs
     */
    private _viewContainerRef: ViewContainerRef | null = null;
    

    /**
     * Contains the reference to the currently loaded view component
     */
    private _currentComponentRef: ComponentRef<View> | null = null;
    
    
    /**
     * Flag that stores if any view is in the process of being loaded
     */
    private _isLoadingView = false;
    

    constructor(private animationBuilder: AnimationBuilder) {

		super(ViewsService);
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
     * Create a new view instance with the specified type and add it to the current application views container. Any currently loaded 
     * view will be removed.
     * 
     * If we push a view while another one is in the process of being loaded, the new push will be ignored.
     *
     * Make sure this method is called when all the visual components of the application have been created (ngAfterViewInit)
     *
     * @param view The classname for the view that we want to create (must extend View base class). A new angular object 
     *        will be instantiated and loaded into the views container.
     */
    async pushView(view: Type<View>) {
        
        // If the loaded view is the same as the specified one, we will do nothing
        if (this._loadedViewClass === view) {

            return;
        }
                    
        // If a view is already being loaded, nothing to do
        if(this._isLoadingView){
            
            return;
        }
        
        this._isLoadingView = true;
                
        // If a view is already loaded, we will unload it first
        if (this._loadedViewClass !== null) {

            await this.removeCurrentView();
        }

        // Create the new view
        const newComponentRef = (this._viewContainerRef as ViewContainerRef).createComponent(view);
        newComponentRef.changeDetectorRef.detectChanges();

        // Set initial opacity to 0
        newComponentRef.location.nativeElement.style.opacity = '0';

        // Fade in the new view
        const fadeInPlayer = this.animationBuilder.build([
            style({ opacity: 0 }),
            animate('300ms ease', style({ opacity: 1 }))
        ]).create(newComponentRef.location.nativeElement);

        await new Promise<void>((resolve) => {
            fadeInPlayer.onDone(() => {
                this._currentComponentRef = newComponentRef;
                this._loadedViewClass = view;
                this._isLoadingView = false;
                resolve();
            });
            fadeInPlayer.play();
        });
    }


    /**
     * Delete the currently loaded view from the views container, and leave it empty.
     * If no view is currently loaded, this method will do nothing
     */
    async popView() {

        if (this._loadedViewClass !== null && this._currentComponentRef) {
            
            await this.removeCurrentView();
        }
    }
    
    
    /**
     * Aux method to remove the currently loaded view from the views container using a promise
     */
    private removeCurrentView(): Promise<void> {
        
        if (this._viewContainerRef === null) {

            throw new Error('Views container not defined. Please declare a <views-container> element in your application');
        }

        return new Promise<void>((resolve) => {
            
            if (this._currentComponentRef) {
                
                const element = this._currentComponentRef.location.nativeElement;
                
                const fadeOutPlayer = this.animationBuilder.build([
                    style({ opacity: 1 }),
                    animate('300ms ease', style({ opacity: 0 }))
                ]).create(element);

                fadeOutPlayer.onDone(() => {
                    
                    if(this._viewContainerRef !== null){
                        
                        this._viewContainerRef.clear();
                    }
                    
                    this._currentComponentRef = null;
                    this._loadedViewClass = null;
                    resolve();
                });

                fadeOutPlayer.play();
                
            } else {
                
                resolve();
            }
        });
    }
}
