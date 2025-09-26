/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { TranslationManager } from '../managers/TranslationManager';


/**
 * Fully featured translation service to be used with any application that requires text internationalization.
 * It is defined as an abstract service class so it must be extended in our application. This way we can
 * write custom methods to extend the functionality of this class if needed.
 * 
 * @see TranslationBaseManager for more information about the methods and properties available.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class LocalesBaseService extends TranslationManager {


    /**
     * Key used to store the user preferred locales in local storage
     */ 
    private readonly _storageKey = 'turbogui-user-translation-priority';
    

    /**
     * Try to detect the list of locales (sorted by preference) that are defined by the user 
     * at the browser setup and are also available for translation at this class.
     * 
     * First we will check if there is a stored local storage value that was defined on a previous session. 
     * If found, all the locales stored there that are also available on this class will be returned.
     * 
     * If no locales could be found from previous sessions, the method will check the browser default language and the 
     * browser languages list. All matching languages that are also listed on availableLocales will be returned, sorted
     * by the browser preference.
     * 
     * Finally, if nothing is found, the first locale from the class availableLocales will be returned.
     *
     * @returns A list of locales that can be used as a translation priority list
     */  
    getAvailableLocalesFromBrowser(){
        
        if(this._availableLocales.length === 0) {
            
            throw new Error('You must define availableLocales before calling detectBrowserLocales()');
        }

        let foundLocales = [];
        
        // Check for previously stored locales in local storage
        const storedLocales = localStorage.getItem(this._storageKey);
        
        if(storedLocales){
            
            for(const locale of storedLocales.split(',')){
                
                if(this._availableLocales.includes(locale)){
                    
                    foundLocales.push(locale);
                }
            }    
        }
        
        // Check for languages on the current browser setup
        if(foundLocales.length === 0){
        
            const browserLanguages = navigator.languages || [navigator.language];

            for (const lang of browserLanguages) {
                
                const langCode = lang.split(/[-_]/)[0].toLowerCase();
                const allowedLocale = this._availableLocales.find(locale => locale.startsWith(langCode + '_'));

                if (allowedLocale) {
                    
                    foundLocales.push(allowedLocale);
                }
            }    
        }

        // Return the locales found or the first allowed locale as a fallback
        return (foundLocales.length > 0) ? foundLocales : [this._availableLocales[0]];
    }
    
    
    /**
     * Initializes the translation system by loading and parsing bundle files from the specified translations path.
     * After the promise finishes, the class will contain all the translation data and will be ready to translate any 
     * provided key.
     * 
     * @param locales An array of locale codes (['en_US', 'es_ES', 'fr_FR', ...]) to load from the url response.
     *        The order of this array is not important for translation priority.
     * 
     * @param url - Url where the translations are found. The response must be a Json with the expected structure:
     *              { library_name: { bundle_name: { locale_code: { key1: "translation1", key2: "translation2" } } } ... } 
     * 
     * @return A promise that will resolve if the translations get correctly loaded, or reject with an error if load fails 
     */
    async loadLocalesFromUrl(locales: string[], url: string) {
        
        try {
            
            const response = await fetch(url);
            
            if (!response.ok) {
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.loadLocalesFromJson(locales, data);
            
        } catch (error) {
            
            throw new Error(`ERROR LOADING LOCALES FROM: ${url}\n${error}`);
        }
    }
    
    
    override setTranslationPriority(localesOrLanguages:string[]){
        
        const locales = super.setTranslationPriority(localesOrLanguages);  

        // We override this method to store the user preferred locales in local storage
        // for future sessions
        localStorage.setItem(this._storageKey, locales.join(','));
        
        return locales;
    }
         
}
