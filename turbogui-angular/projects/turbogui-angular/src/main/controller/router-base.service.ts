/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalesBaseService } from './locales-base.service';


/**
 * Global service that helps with application routing and related functionalities.
 * It is defined as an abstract class so it must be extended in our application to be used.
 * We must declare a static array of routes that will be used to define the routes of the application.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class RouterBaseService implements OnDestroy {
    

    /**
     * Indicates whether the title manager has been initialized.
     * This should only be done once, typically at application startup.
     */ 
    private _isTitleManagerInitialized = false;
    
    
    /**
     * @see getCurrentRouteTitle
     */
    private _currentRouteTitle:string;
    

    /**
     * @see getCurrentBrowserTitle
     */
    private _currentBrowserTitle:string;

    
    /**
     * Subscription to router events. This is used to update the current route URL
     */
    private _routerSubscription: Subscription | undefined;
    
    
    /**
     * BehaviorSubject that holds the current route URL.
     * This allows components to reactively subscribe to route changes.
     */
    private readonly _currentRoute = new BehaviorSubject<string>(this.router.url);

    
    /** 
     * Instance of the LocalesService to be used for translations.
     * It will be provided by the methods that require it.
     * This is not injected in the constructor as the locales service class is an abstract class, and we 
     * need the custom implementation of the service to be provided by the application that extends it.
     */
    private _localesService: LocalesBaseService;
    
    
    constructor(private readonly router: Router,
                private readonly titleService: Title) {
                    
        // Initial update in case the service loads after the first NavigationEnd
        this._updateCurrentRoute();
    }


    /**
     * Updates the current route URL in the BehaviorSubject.
     * This is called internally after each navigation event.
     */ 
    private _updateCurrentRoute(): void {
        
        this._currentRoute.next(this.router.url);
    }
    
    
    /**
     * Checks if the current route matches the specified route.
     * 
     * @param route The route to check against the current route.
     * 
     * @returns True if we are actually at the specified route, false otherwise.
     */
    isRouteCurrent(route:string) {
        
        return this.getCurrentRoute() === '/' + route;
    }


    /**
     * Gets the current value of the route URL synchronously.
     * For example, if the current route is `/user/123`, it will return `/user/123`.
     * Notice that the base URL is not included in the returned value.
     */
    getCurrentRoute():string {
        
        return this._currentRoute.getValue();
    }
    
    
    /**
     * The current route title, translated using the LocalesService.
     * This is updated automatically after each navigation event if the title manager is initialized.
     */ 
    getCurrentRouteTitle():string {
        
        return this._currentRouteTitle;
    }
    
    
    /**
     * The current browser title, which may include prefixes or suffixes.
     * This is updated automatically after each navigation event if the title manager is initialized.
     */
    getCurrentBrowserTitle():string {
        
        return this._currentBrowserTitle;
    }


    /**
     * Gets the current value of the route absolute URL synchronously.
     * 
     * For example, if the current route is `/user/123` and the base href is `http://example.com/app/`, it will return `http://example.com/app/user/123`.
     */
    getCurrentRouteAbsolute(){

        return window.location.origin + this.getCurrentRoute();
    }
    
    
    /**
     * Gets the value of a specific route parameter by its key from the current route.
     * 
     * For example, if the current route is `/user/123`, and you call this method with `key` as `id`, it will return `123`.
     * The name of the parameter must match the one defined in the route configuration on your application (e.g., `{ path: 'user/:id', component: UserComponent }`).
     * 
     * @param key The key of the route parameter to retrieve.
     * 
     * @returns The value of the specified route parameter, or undefined if it does not exist.
     */
    getCurrentRouteParamValue(key: string) {
        
        let currentRoute = this.router.routerState.snapshot.root;
        
        while (currentRoute.firstChild) {
            
            currentRoute = currentRoute.firstChild;
        }
        
        if (!(key in currentRoute.params)) {
            
            throw new Error(`Route parameter '${key}' does not exist.`);
        }
        
        return currentRoute.params[key];
    }
    
    
    /**
     * Gets the value of a specific query parameter by its key from the current route.
     * For example, if the current route is `/search?query=angular`, and you call this method with `key` as `query`, it will return `angular`.
     * 
     * @param key The key of the query parameter to retrieve.
     */
    getQueryParamValue(key: string) {
        let currentRoute = this.router.routerState.snapshot.root;

        while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
        }

        return currentRoute.queryParams[key];
    }
    
    
    /**
     * Sets or updates the value of a specific query parameter in the current route.
     * For example, if the current route is `/search?query=angular`, and you call this method with `key` as `page` and `value` as `2`, 
     * it will navigate to `/search?query=angular&page=2`.
     * 
     * @param key The key of the query parameter to set or update.
     * @param value The value to set for the specified query parameter.
     */
    setQueryParamValue(key: string, value: string) {
        
        let currentRoute = this.router.routerState.root;
        
        while (currentRoute.firstChild) {
            
            currentRoute = currentRoute.firstChild;
        }

        this.router.navigate([], {
            relativeTo: currentRoute,
            queryParams: { [key]: value },
            queryParamsHandling: 'merge'
        });
    }
    
    
    /**
     * Removes a specific query parameter from the current route.
     * For example, if the current route is `/search?query=angular&page=2`, and you call this method with `key` as `page`,
     * it will navigate to `/search?query=angular`.
     * 
     * @param key The key of the query parameter to remove.
     */
    removeQueryParam(key: string) {
        
        let currentRoute = this.router.routerState.root;

        while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
        }

        this.router.navigate([], {
            relativeTo: currentRoute,
            queryParams: { [key]: null },
            queryParamsHandling: 'merge'
        });
    }


    /**
     * Initializes the title management feature to automatically refresh the browser title based on the current
     * URL route. It Must be called once, typically at application startup
     * 
     * To correctly translate the route title, We expect the route definitions to have the following properties:
     * 
     * - titleKey: The key to be used to get the title from the translation bundle.
     * - titleBundle: The bundle to be used to get the title from the translation bundle.
     * 
     * (Translations will be done using the LocalesService from this same library).
     * 
     * Example of a Route using this feature:
     *   // Home route
     *   { path: '', component: HomePageComponent, 
     *     data: { titleKey: 'HOME',  titleBundle: 'turbodepot/user-interface'} },
     * 
     * @param localesService An instance of the already initialized LocalesService to be used for translations. 
     * @param prefix A text to be added before the computed title.
     * @param sufix A text to be added after the computed title.
     */
    initializeAutoTranslateTitleByRoute(localesService:LocalesBaseService, prefix:string = '', sufix:string = ''): void {
        
        this._localesService = localesService;
        
        if (this._isTitleManagerInitialized) {
            
            throw new Error('Title refresh from routes has already been initialized. Can only be done once.');
        }

        // Set initial title based on current route data immediately
        this.updateTitleFromCurrentRoute(prefix, sufix);

        // Subscribe to future navigation events
        this._routerSubscription = this.router.events.pipe(
            
            filter(event => event instanceof NavigationEnd)
            
        ).subscribe(() => {
            
            this._updateCurrentRoute();
            this.updateTitleFromCurrentRoute(prefix, sufix);
        });

        this._isTitleManagerInitialized = true;
    }
    

    /**
     * Aux method: Updates the browser title based on the current route's data properties.
     * This is called after each navigation event to ensure the title is always up-to-date.
     * 
     * @param prefix A text to be added before the computed title.
     * @param sufix A text to be added after the computed title.
     */
    private updateTitleFromCurrentRoute(prefix:string, sufix:string): void {
        
        this._currentRouteTitle = '';
        this._currentBrowserTitle = '';
        let currentRoute = this.router.routerState.snapshot.root;
        
        while (currentRoute.firstChild) {
            
            currentRoute = currentRoute.firstChild;
        }
        
        const data = currentRoute.data;
        
        if (data['titleKey'] && data['titleBundle']) {
            
            this._currentRouteTitle = this._localesService.t(data['titleKey'], data['titleBundle']);
        }
        
        this._currentBrowserTitle = prefix + this._currentRouteTitle + sufix;
        
        this.titleService.setTitle(this._currentBrowserTitle);
    }
    
    
    /**
     * Navigates to the specified route.
     * 
     * @param route The route to navigate to.
     */
    navigateTo(route:string){
        
        this.router.navigate(['/' + route]);
    }
    

    /**
     * Automatically called when the service is destroyed.
     * We use it to clean up subscriptions and other resources.
     * 
     * Usially not necessary to call this manually.
     */
    ngOnDestroy(): void {
        
        this._routerSubscription?.unsubscribe();
        
        // Clean up BehaviorSubject
        this._currentRoute.complete();
    }
}