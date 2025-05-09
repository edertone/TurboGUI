/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';


/**
 * Fully featured translation manager to be used with any application that requires text internationalization.
 * It is defined as an abstract class so it must be extended in our application. This way we can
 * write custom methods to extend the functionality of this class if needed.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class LocalesBaseService {


    /**
     * if the class has been correctly initialized and translations have been correctly loaded
     */
    private _isInitialized = false;
        

    /**
     * @see getLocales()
     */
    private _locales:string[] = [];
    
    
    /**
     * @see getLanguages()
     */
    private _languages:string[] = [];
        
    
    /**
     * Stores all the loaded localization data by library name, bundle name, key and locales
     */
    private _loadedTranslations:any = {};
    
    
    /**
     * Stores a memory cache to improve performance when outputing translations
     */
    private _keyValuesCache:any = {};


    /**
     * @see setWildCardsFormat()
     */
    private _wildCardsFormat = '{N}';


    /**
     * @see setMissingKeyFormat()
     */
    private _missingKeyFormat = '$exception';


    /**
     * Stores a hash value that is used to improve the performance for translation t() methods.
     * This is computed based on _wildCardsFormat plus _missingKeyFormat plus the current primary locale
     * Methods that change these values will recalculate the hash string, so when calling translation methods, the
     * performance will be as fast as possible.
     */
    private _cacheHashBaseString = '';
    
    
    /**
     * Wildcards are string fragments that are placed inside the translated texts. Their main purpose is to be replaced at
     * runtime by custom values like for example a user name, a date, a numeric value, etc..
     *
     * This class helps with this process by including a parameter called 'toReplace' on all ->t methods which allows us
     * to specify a string or list of strings that will replace the respective wildcards on the translated text. Each wildcard
     * must follow the format specified here, and contain a numeric digit that will be used to find the replacement text at the
     * 'toReplace' list. For example, if we define $N as the wildcard format, and we have a translation that contains $0, $1, $2,
     * $0 will be replaced with the first element on toReplace, $1 with the second and so.
     *
     * We usually set this before initializing the class translation data
     *
     * Notice that N is mandayory on the wildcards format and the first index value is 0.
     *
     * @param value The wildcards format we want to set
     * 
     * @returns The value that's been set
     */
    setWildCardsFormat(value:string) {

        if(!value.includes('N')){
        
            throw new Error("N is mandatory to replace wildcards");
        }

        this._cacheHashBaseString = value + this._missingKeyFormat + ((this._locales.length > 0) ? this._locales[0] : '');

        this._wildCardsFormat = value;
        
        return value;
    }
    
    
    /**
     * Defines the behaviour for t(), tStartCase(), etc... methods when a key is not found on
     * a bundle or the bundle does not exist
     *
     * If missingKeyFormat is an empty string, all missing keys will return an empty value (not recommended)
     *
     * If missingKeyFormat contains a string, that string will be always returned for missing keys
     *
     * If missingKeyFormat contains a string with one of the following predefined wildcards:<br>
     *    - $key will be replaced with key name. Example: get("NAME") will output [NAME] if key is not found and missingKeyFormat = '[$key]'<br>
     *    - $exception (default value) will throw an exception with the problem cause description.
     *
     * @param value The missing key format we want to set
     * 
     * @returns The value that's been set
     */
    setMissingKeyFormat(value:string) {

        this._cacheHashBaseString = this._wildCardsFormat + value + ((this._locales.length > 0) ? this._locales[0] : '');

        this._missingKeyFormat = value;
        
        return value;
    }
    
    
    /**
     * @see setMissingKeyFormat()
     */
    getMissingKeyFormat() {

        return this._missingKeyFormat;
    }
    
    
    /**
     * Adds translations to the class by loading and parsing bundles from the provided JSON object.
     * After the method finishes, the class will contain all the translation data and will be ready to translate 
     * any provided key to any of the specified locales.
     *
     * @param locales An array of locale codes (e.g., ['en_US', 'es_ES', 'fr_FR']) to load from the json data into this class.
     *        The order of this array will determine the priority when looking for translations.
     * 
     * @param json A JSON object containing the translation data. The structure must be as follows:
     *       { library_name: { bundle_name: { locale_code: { key1: "translation1", key2: "translation2" } } } ... }  
     * 
     * @return True if the translations get correctly loaded. Any unsuccessful initialization will throw an exception
     */
    loadLocalesFromJson(locales:string[], json:any){

        this._isInitialized = false;
        
        // Validate received locales are correct
        for(const locale of locales) {

            this._validateLocaleString(locale);
        }
        
        // Validate the translations object follows the right structure
        let isTranslationsValid = false;
          
        for (const library in json) {

            for (const bundle in json[library]) {

                for (const locale in json[library][bundle]) {

                    this._validateLocaleString(locale);
                    
                    isTranslationsValid = true;
                }
            }
        }
        
        if (!isTranslationsValid) {
                
            throw new Error('translations must be a non empty object with the structure: { library: { bundle: { xx_XX: { key: translation } } } }');
        }
          
        this._loadedTranslations = json;
        this._locales = locales;
        this._languages = locales.map((l: string) => l.substring(0, 2));
        this._cacheHashBaseString = this._wildCardsFormat + this._missingKeyFormat + this._locales[0];
        
        this._isInitialized = true;
        
        return true;
    }
    
    
    /**
     * Initializes the translation system by loading and parsing bundle files from the specified translations path.
     * After the promise finishes, the class will contain all the translation data and will be ready to translate any 
     * provided key.
     * 
     * @param locales An array of locale codes (['en_US', 'es_ES', 'fr_FR', ...]) to load from the url response.
     *        The order of this array will determine the translation priority
     * @param url - Url where the translations are found. The response must be a Json with the expected structure:
     *              { library_name: { bundle_name: { locale_code: { key1: "translation1", key2: "translation2" } } } ... } 
     * 
     * @return A promise that will resolve if the translations get correctly loaded, or reject with an error if load fails 
     */
    loadLocalesFromUrl(locales:string[], url:string){

        this._isInitialized = false;
        
        return new Promise((resolve, reject) => {
        
            fetch(url).then(response => {
                
                if (!response.ok) {
                    
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response.json();
          
            }).then(data => {
                
                this.loadLocalesFromJson(locales, data);
                                
                resolve(undefined);
          
            }).catch(error => {
            
                reject(new Error(`ERROR LOADING LOCALES FROM: ${url}\n` + error));
            });
        });
    }

    
    /**
     * Check if the class has been correctly initialized and translations have been correctly loaded
     */
    isInitialized(){

        return this._isInitialized;
    }


    /**
     * Aux method to verify that this class is correctly initialized with translation data
     */
    private _validateInitialized(){

        if(!this._isInitialized){

            throw new Error('Translation service not initialized');
        }
    }
    
    
    /**
     * Checks if the specified locale is currently loaded for the currently defined bundles and paths.
     *
     * @param locale A locale to check. For example 'en_US'
     *
     * @return True if the locale is currently loaded on the class, false if not.
     */
    isLocaleLoaded(locale:string){

        this._validateLocaleString(locale);

        return this._locales.includes(locale);
    }
    
    
    /**
     * Aux method to validate that a locale string is correctly formatted
     *
     * @param string $locale A locale string
     */
    private _validateLocaleString(locale:string){
        
        if(!/^[a-z]{2}_[A-Z]{2}$/.test(locale)) {

            throw new Error('locale must be a valid xx_XX value');
        }
    }
    
    
    /**
     * Checks if the specified 2 digit language is currently loaded for the currently defined bundles and paths.
     *
     * @param language A language to check. For example 'en'
     *
     * @return True if the language is currently loaded on the class, false if not.
     */
    isLanguageLoaded(language:string){

        this._validateLanguageString(language);

        return this._languages.includes(language);
    }
    
    
    /**
     * Aux method to validate that a language string is correctly formatted
     *
     * @param language A 2 digit language string
     */
    _validateLanguageString(language:string){

        if (!/^[a-z]{2}$/.test(language)) {

            throw new Error('language must be a valid 2 digit value');
        }
    }
    
    
    /**
     * Get the translation to the current primary locale for the given key, library and bundle
     *
     * @param string key The key we want to read from the specified resource bundle
     * @param string bundlePath A string with the format 'library_name/bundle_name' that is used to locate the bundle were the key to translate is found
     * @param array replaceWildcards A list of values that will replace wildcards that may be found on the translated text. Each wildcard
     *        will be replaced with the element whose index on replaceWildcards matches it. Check the documentation for this.wildCardsFormat
     *        property to know more about how to setup wildcards on your translations.
     *
     * @see setWildCardsFormat()
     *
     * @return The translated text
     */
    t(key:string, bundlePath:string, replaceWildcards:string[] = []) {

        this._validateInitialized();

        // Create a cache key to improve performance when requesting the same key translation several times
        const cacheKey = `${this._cacheHashBaseString}${key}${bundlePath}${replaceWildcards.join('')}`;

        if (!this._keyValuesCache[cacheKey]) {

            this._forceNonEmptyString(key, '', 'key must be non empty string');
            this._forceNonEmptyString(bundlePath, '', 'bundlePath must be non empty string');
            
            const [library, bundle] = bundlePath.split('/');

            this._forceNonEmptyString(library, '', 'no library specified on bundlePath');
            this._forceNonEmptyString(bundle, '', 'no bundle specified on bundlePath');
            
            const replacementsCount = replaceWildcards.length;

            // Loop all the locales to find the first one with a value for the specified key
            for (const locale of this._locales) {

                if (this._loadedTranslations[library]?.[bundle]?.[locale]?.[key]) {

                    let result = this._loadedTranslations[library][bundle][locale][key];

                    // Replace all wildcards on the text with the specified replacements if any
                    for (let i = 0; i < replacementsCount; i++) {

                        result = this._replace(result, this._replace(this._wildCardsFormat, 'N', i.toString()), replaceWildcards[i]);
                    }

                    this._keyValuesCache[cacheKey] = result;
                    
                    return result;
                }
            }

            // Check if an exception needs to be thrown if the specified key is not found on this bundle
            if (this._missingKeyFormat.includes('$exception')) {
                
                throw new Error(`Translation key <${key}> not found on <${bundlePath}>`);
            }

            this._keyValuesCache[cacheKey] = this._replace(this._missingKeyFormat, '$key', key);
        }

        return this._keyValuesCache[cacheKey];
    }
    
    
    /**
     * Get the translation for the given key and bundle as a string with all words first character capitalized
     * and all the rest of the word with lower case
     *
     * @see t()
     *
     * @returns The localized and case formatted text
     */
    tStartCase(key:string, bundlePath:string, replaceWildcards:string[] = []) {

        return this.t(key, bundlePath, replaceWildcards).split(' ')
                .map((word:any) => word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '').join(' ');
    }
    
    
    /**
     * Get the translation for the given key and bundle as an all upper case string
     *
     * @see t()
     *
     * @returns The localized and case formatted text
     */
    tAllUpperCase(key:string, bundlePath:string, replaceWildcards:string[] = []) {

        return this.t(key, bundlePath, replaceWildcards).toUpperCase();
    }
    
    
    /**
     * Get the translation for the given key and bundle as an all lower case string
     *
     * @see t()
     *
     * @returns The localized and case formatted text
     */
    tAllLowerCase(key:string, bundlePath:string, replaceWildcards:string[] = []) {

        return this.t(key, bundlePath, replaceWildcards).toLowerCase();
    }
    
    
    /**
     * Get the translation for the given key and bundle as a string with the first character as Upper case
     * and all the rest as lower case
     *
     * @see t()
     *
     * @returns The localized and case formatted text
     */
    tFirstUpperRestLower(key:string, bundlePath:string, replaceWildcards:string[] = []){

        const string = this.t(key, bundlePath, replaceWildcards);
        
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
    
    /**
     * A list of strings containing the locales that are used by this class to translate the given keys, sorted by preference.
     * Each string is formatted as a standard locale code with language and country joined by an underscore, like: en_US, fr_FR
     *
     * When a key and bundle are requested for translation, the class will check on the first language of this
     * list for a translated text. If missing, the next one will be used, and so. This list is constructed after initialize
     * methods is called.
     *
     * @example: After loading the following list of locales ['en_US', 'es_ES', 'fr_FR'] if we call t('HELLO', 'lib1/greetings')
     * the localization manager will try to locate the en_US value for the HELLO tag on the greetings bundle for the library lib1.
     * If the tag is not found for the specified locale and bundle, the same search will be performed for the es_ES locale, and so, till a
     * value is found or no more locales are defined.
     */
    getLocales(){

        return this._locales;
    }
    
    
    /**
     * A list of strings containing the languages that are used by this class to translate the given keys, sorted by preference.
     * Each string is formatted as a 2 digit language code, like: en, fr
     *
     * This list is the same as the locales() one, but containing only the language part of each locale (the first two digits)
     *
     * @see getLocales()
     */
    getLanguages(){

        return this._languages;
    }
    
    
    /**
     * Get the first locale from the list of loaded locales, which is the currently used to search for translated texts.
     *
     * @returns The locale that is defined as the primary one. For example: en_US, es_ES, ..
     */
    getPrimaryLocale(){

        this._validateInitialized();

        return this._locales[0];
    }
    
    
    /**
     * Get the first language from the list of loaded locales, which is the currently used to search for translated texts.
     *
     * @returns The 2 digit language code that is defined as the primary one. For example: en, es, ..
     */
    getPrimaryLanguage(){

        this._validateInitialized();

        return this._languages[0];
    }
    
    
    /**
     * Define the locale that will be placed at the front of the currently loaded locales list (moving all the others one position to the right).
     *
     * This will be the first locale to use when trying to get a translation.
     *
     * @param locale A currently loaded locale that will be moved to the first position of the loaded locales list. If the specified locale
     *        is not currently loaded, an exception will happen.
     *
     * @returns void
     */
    setPrimaryLocale(locale:string){

        this._validateInitialized();

        if(!this.isLocaleLoaded(locale)){

            throw new Error(locale + ' not loaded');
        }

        let result = [locale];

        for (let l of this._locales){
        
            if(l !== locale){

                result.push(l);
            }
        }

        this._locales = result;
        this._languages = this._locales.map((l: string) => l.substring(0, 2));
        this._cacheHashBaseString = this._wildCardsFormat + this._missingKeyFormat + this._locales[0];
    }
    
    
    /**
     * Moves the specified locales to the beginning of the locales list. This also alters the translation priority by setting the first
     * provided locale as the most prioritary, the second as the next one and so.
     *
     * This method basically works exactly the same way as setPrimaryLocale but letting us add many locales at once.
     *
     * @see setPrimaryLocale()
     *
     * @param locales A list of locales to be moved to the beginning of the translation priority. First locales item will be the prefered
     *        locale for translation, second will be the next one in case some key is not translated for the first one and so. If any of the
     *        specified locales is not currently loaded, an exception will happen.
     *
     * @returns void
     */
    setPrimaryLocales(locales:string[]){

        if(!Array.isArray(locales) ||
            (new Set(locales).size !== locales.length) ||
            locales.length === 0){

                throw new Error('locales must be non empty string array with no duplicate elements');
        }

        for (let i = locales.length - 1; i >= 0; i--) {

            this.setPrimaryLocale(locales[i]);
        }
    }
    
    
    /**
     * Define the 2 digit language that will be placed at the front of the currently loaded locales list (moving all the others one position to the right).
     *
     * This will be the first language to use when trying to get a translation.
     *
     * @param language A 2 digit language code that matches with any of the currently loaded locales, which will
     *        be moved to the first position of the loaded locales list. If the specified language does not match with
     *        a locale that is currently loaded, an exception will happen.
     *
     * @returns void
     */
    setPrimaryLanguage(language:string){

        for(let locale of this._locales){
        
            if(locale.substring(0, 2) === language){

                this.setPrimaryLocale(locale);

                return;
            }
        }

        throw new Error(language + ' not loaded');
    }
    
    
    /**
     * Moves the locales that match the specified languages to the beginning of the locales list.
     * Works the same as setPrimaryLocales() but with a list of the 2 digit language codes that match the respective locales.
     *
     * @see setPrimaryLocale()
     * @see setPrimaryLanguage()
     *
     * @param languages A list of 2 digit language codes to be moved to the beginning of the translation priority. If any of the
     *        specified languages does not match with a locale that is currently loaded, an exception will happen.
     *
     * @returns void
     */
    setPrimaryLanguages(languages:string[]){

        if(!Array.isArray(languages) ||
           (new Set(languages).size !== languages.length) ||
            languages.length === 0){

            throw new Error('languages must be non empty string array with no duplicate elements');
        }

        for (let i = languages.length - 1; i >= 0; i--) {

            this.setPrimaryLanguage(languages[i]);
        }
    }
    
    
    /**
     * Change the loaded locales translation preference order. The same locales that are currently loaded must be passed
     * but with a different order to change the translation priority.
     *
     * @param locales A list with the new locales translation priority
     *
     * @returns void
     */
    setLocalesOrder(locales:string[]){

        if(locales.length !== this._locales.length){

            throw new Error('locales must contain all the currently loaded locales');
        }

        this._validateInitialized();

        for(let locale of locales){
        
            if(!this.isLocaleLoaded(locale)){

                throw new Error(locale + ' not loaded');
            }
        }

        this._locales = locales;
        this._languages = this._locales.map((l: string) => l.substring(0, 2));
        this._cacheHashBaseString = this._wildCardsFormat + this._missingKeyFormat + this._locales[0];
    }
    
    
    /**
     * This is an aux method to implement the TurboCommons StringUtils replace method.
     * It is exactly the same as the one on the library, but we implement it here to avoid having a dependency with TurboCommons
     */
    private _replace(string: string, search:string, replacement: string) {
        
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
           
        return string.replace(new RegExp(escapedSearch, 'g'), replacement);
    }
    
    
    /**
     * This is an aux method to implement the TurboCommons StringUtils isEmpty method.
     * It is exactly the same as the one on the library, but we implement it here to avoid having a dependency with TurboCommons
     */
    private _isEmpty(string:string) {
        
        let isString = (typeof string === 'string' || (string as any) instanceof String);
                
        // Throw exception if non string value was received
        if(!isString){

            // Empty or null value is considered empty
            if(string == null || string == ''){
    
                return true;
            }
            
            throw new Error("value is not a string");
        }

        return string.replace(/[ \n\r\t]/g, '') === '';
    }
    
    
    /**
     * This is an aux method to implement the TurboCommons StringUtils forceNonEmptyString method.
     * It is exactly the same as the one on the library, but we implement it here to avoid having a dependency with TurboCommons
     */
    private _forceNonEmptyString(value:any, valueName = '', errorMessage = 'must be a non empty string'){

        let isString = (typeof value === 'string' || value instanceof String);
        
        if(!isString || this._isEmpty(value)){

            throw new Error(valueName + ' ' + errorMessage);
        }
    }
}
