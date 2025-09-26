/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */


/**
 * Fully featured translation manager to be used with any application that requires text internationalization.
 * 
 * It is designed to load translation bundles from several sources, and then provide methods to translate
 * any key on any bundle to the desired locale.
 * 
 * - Provides methods to format the translated text to several case formats like start case, all upper case,
 * all lower case, first upper rest lower, etc...
 * 
 * - Provides a way to define wildcards on the translated texts that can be replaced at runtime with custom values.
 * 
 * The class is designed to be as fast as possible when requesting translations, so it includes an internal memory cache
 * that will store the results of previous translations and return them directly when the same key is requested again.
 * 
 * It also includes several configuration options to define how missing keys are handled, what locales are available,
 * what locales are loaded into memory, what locales are used for translation priority, etc...
 * 
 * The class does not include any method to load translation bundles from external sources like files or APIs. This is
 * done on purpose to keep the class as generic as possible and avoid any dependency with external libraries or frameworks.
 * 
 * It is recommended to use this class as a singleton service in your application, so you can easily access it from
 * any component or service that requires translation functionalities.
 */
export class TranslationManager {

    
    /**
     * This flag defines if the class will allow loading locales that are not defined on the availableLocales list.
     * 
     * By default this is set to false, so only locales that are defined on the availableLocales list can be loaded.
     * 
     * If set to true, any locale can be loaded, even if it is not defined on the availableLocales list. In this case,
     * the locale will be added at the end of the availableLocales list when loaded.
     * 
     * It is recommended to keep this set to false and always define the availableLocales list before loading any locale,
     * so we can avoid loading locales that are not supported by our application.
     * 
     * Notice that this flag does not affect the translation priority list, which must always contain locales that are
     * defined on the availableLocales list.
     * 
     * @see setAvailableLocales()
     * @see setTranslationPriority()
     */
    public isLoadingNonAvaliableLocalesAllowed = false;
    
    
    /**
     * @see setAvailableLocales()
     */
    protected _availableLocales:string[];
    
    
    /**
     * @see setTranslationPriority()
     */
    protected _translationPriority:string[] = [];
        

    /**
     * @see getLoadedLocales()
     */
    protected _loadedLocales:string[] = [];
        
    
    /**
     * Stores all the raw localization data that is loaded into memory on this service for all locales.
     * It is organized like: { library_name: { bundle_name: { locale_code: { key1: "translation1", key2: "translation2" } } } ... }  
     */
    protected _loadedRawTranslationData:any = {};


    /**
     * @see setWildCardsFormat()
     */
    protected _wildCardsFormat = '{N}';


    /**
     * @see setMissingKeyBehaviour()
     */
    protected _missingKeyBehaviour = '$exception';


    /**
     * Stores a memory cache to improve performance when outputing translations
     */
    protected _keyValuesCache:any = {};


    /**
     * Stores a hash value that is used to improve the performance for translation t() methods.
     * 
     * This is computed based on _wildCardsFormat + _missingKeyBehaviour + _translationPriority
     * 
     * Methods that change these values will recalculate the hash string, so when calling translation methods, the
     * performance will be as fast as possible.
     */
    protected _cacheHashBaseString = '';
    
    
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
     * Notice that N is mandatory on the wildcards format and the first index value is 0.
     *
     * @param value The wildcards format we want to set
     * 
     * @returns The value that's been set
     */
    setWildCardsFormat(value:string) {

        if(!value.includes('N')){
        
            throw new Error("N is mandatory to replace wildcards");
        }

        this._cacheHashBaseString = value + this._missingKeyBehaviour + this._translationPriority.join('');

        this._wildCardsFormat = value;
        
        return value;
    }
    
    
    /**
     * Defines the behaviour for t(), tStartCase(), etc... methods when a key is not found on
     * a bundle or the bundle does not exist
     *
     * If missingKeyBehaviour is an empty string, all missing keys will return an empty value (not recommended)
     *
     * If missingKeyBehaviour contains a string, that string will be always returned for missing keys
     *
     * If missingKeyBehaviour contains a string with one of the following predefined wildcards:<br>
     *    - $key will be replaced with key name. Example: get("NAME") will output [NAME] if key is not found and missingKeyBehaviour = '[$key]'<br>
     *    - $exception (default value) will throw an exception with the problem cause description.
     *
     * @param value The missing key format we want to set
     * 
     * @returns The value that's been set
     */
    setMissingKeyBehaviour(value:string) {

        this._cacheHashBaseString = this._wildCardsFormat + value + this._translationPriority.join('');

        this._missingKeyBehaviour = value;
        
        return value;
    }
    
    
    /**
     * @see setMissingKeyBehaviour()
     */
    getMissingKeyBehaviour() {

        return this._missingKeyBehaviour;
    }
    
    
    /**
     * Adds translations to the class by loading and parsing bundles from the provided JSON object.
     * After the method finishes, the class will contain in memory all the translation data and will be ready to translate 
     * any provided key to any of the specified locales.
     * 
     * This method can be called multiple times. New translation data will be merged with any existing data. 
     * If a translation key already exists for a specific library, bundle, and locale, its value will be overwritten by the new data.
     *
     * @param locales An array of locale codes (e.g., ['en_US', 'es_ES', 'fr_FR']) to load from the json data into this class.
     *        The order of this array is not important for translation priority.
     * 
     * @param json A JSON object containing the translation data. The structure must be as follows:
     *       { library_name: { bundle_name: { locale_code: { key1: "translation1", key2: "translation2" } } } ... }  
     * 
     * @throws Error If any of the provided locales is not correctly formatted or not defined on the availableLocales 
     *         list or json data does not follow the expected structure.
     * 
     * @return void
     */
    loadLocalesFromJson(locales:string[], json:any){

        // Cache must be cleared when loading new translations to ensure all keys are re-evaluated.
        this._keyValuesCache = {};
        
        // Validate received locales are correct
        for(const locale of locales) {

            this._validateLocaleString(locale);
            
            if(!this.isLoadingNonAvaliableLocalesAllowed &&
               (!this._availableLocales || !this._availableLocales.includes(locale))) {
                
                throw new Error(locale + ' not defined as available for translation');
            }              
        }
        
        // Validate the translations object follows the right structure
        let isTranslationsValid = false;
        
        if (json && typeof json === 'object' && Object.keys(json).length > 0) {
            
            for (const library in json) {
                
                for (const bundle in json[library]) {
                    
                    for (const locale in json[library][bundle]) {
                        
                        this._validateLocaleString(locale);
                        isTranslationsValid = true;
                    }
                }
            }
        }
        
        if (!isTranslationsValid) {
            
            throw new Error('translations must be a non empty object with the structure: { library: { bundle: { xx_XX: { key: translation } } } }');
        }
        
        // Deep merge the new translation data with the existing data.
        for (const library in json) {
            
            if (!this._loadedRawTranslationData[library]) {
                
                this._loadedRawTranslationData[library] = {};
            }

            for (const bundle in json[library]) {
                
                if (!this._loadedRawTranslationData[library][bundle]) {
                    
                    this._loadedRawTranslationData[library][bundle] = {};
                }

                for (const locale in json[library][bundle]) {
                    
                    if (!this._loadedRawTranslationData[library][bundle][locale]) {
                        
                        this._loadedRawTranslationData[library][bundle][locale] = {};
                    }
                    
                    // Merge the new keys for the locale, overwriting any existing ones.
                    Object.assign(this._loadedRawTranslationData[library][bundle][locale], json[library][bundle][locale]);
                }
            }
        }

        // Update the list of loaded locales, ensuring no duplicates.
        this._loadedLocales = Array.from(new Set([...this._loadedLocales, ...locales]));

        // Add loaded locales to the end of the availableLocales list if they are not already there
        for(const locale of locales) {
            
            if(!this._availableLocales.includes(locale)){
                
                this._availableLocales.push(locale);
            }
        }
    }
    
    
    /**
     * Checks if the specified locale is currently loaded into memory on this service.
     *
     * @param locale A locale to check. For example 'en_US'
     *
     * @return True if the locale is currently loaded on the class, false if not.
     */
    isLocaleLoaded(locale:string){

        this._validateLocaleString(locale);

        return this._loadedLocales.includes(locale);
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

        return this.getLoadedLanguages().includes(language);
    }
    
    
    /**
     * @see setAvailableLocales()
     */
    getAvailableLocales(){

        return this._availableLocales;
    }
    
    
    /**
     * Define the list of locales that are allowed to be loaded by this class (sorted by preference!).
     * Each string must be formatted as a standard locale code with language and country joined by an 
     * underscore, like: en_US, fr_FR. The order of this list does matter, so it is better to sort by priority.
     * 
     * IMPORTANT: This method does not load any locale by itself, it just defines what locales are available for translation.
     * You also need to load the translation data for the locales to translate texts.
     * 
     * Before performing any translation, available locales and translation priority must be set, and also translation
     * data must be loaded for all the locales that are defined on the translation priority list.
     *
     * @param locales A list of locales to be set as available for loading
     */ 
    setAvailableLocales(locales:string[]){
        
        for(const locale of locales) {

            this._validateLocaleString(locale);
        }

        this._availableLocales = locales;
    }
    
    
    /**
     * A list containing the locales that have been loaded into memory and ready to be used for translation.
     * Each string is formatted as a standard locale code with language and country joined by an underscore, like: en_US, fr_FR
     *
     * The order on this list does not matter for translation priority, as that is defined by the translationPriority list.
     * 
     * @see getLoadedLanguages()
     */
    getLoadedLocales(){

        return this._loadedLocales;
    }
    
    
    /**
     * A list of strings containing the languages have been loaded into memory and ready to be used for translation.
     * Each string is formatted as a 2 digit language code, like: en, fr
     *
     * This list is the same as the locales() one, but containing only the language part of each locale (the first two digits)
     *
     * @see getLoadedLocales()
     */
    getLoadedLanguages(){

        return this._loadedLocales.map((l: string) => l.substring(0, 2));
    }
    
    
    /**
     * Define the list of locales that will be used for translation priority.
     * The first locale on the list will be the primary to be used when trying to get a translation, rest will be used 
     * as fallback in the same order as they are defined on this list.
     * 
     * - The list must contain at least one locale and no duplicate elements.
     * - All locales provided here must exist on the availableLocales list, otherwise an exception will happen.
     * - When requesting a translation all the locales on this list should be loaded into memory or an exception may happen.
     * - IMPORTANT: Translation behaviour depends heavily on the missingKeyBehaviour property value.
     * 
     * @example: After loading the following list of locales ['en_US', 'es_ES', 'fr_FR'] if we call t('HELLO', 'lib1/greetings')
     *           the localization manager will try to locate the en_US value for the HELLO tag on the greetings bundle for the library lib1.
     *           If the tag is not found for the specified locale and bundle, the same search will be performed for the es_ES locale, and so, till a
     *           value is found or no more locales are defined. 
     *
     * @param localesOrLanguages:string A list of locales (xx_XX) or languages (xx) to be used for translation priority.
     *
     * @returns The list of locales that has been set for translation priority
     */
    setTranslationPriority(localesOrLanguages:string[]){
        
        // Validate received list is correct
        if(!Array.isArray(localesOrLanguages) ||
            (new Set(localesOrLanguages).size !== localesOrLanguages.length) ||
            localesOrLanguages.length === 0){

            throw new Error('locales must be non empty string array with no duplicate elements');
        }

        const resolvedLocales: string[] = [];

        // Validate all requested locales are available for translation
        for(const item of localesOrLanguages) {

            let resolvedLocale = '';

            if(/^[a-z]{2}$/.test(item)){
                
                resolvedLocale = this._availableLocales.find(l => l.startsWith(item + '_')) ?? '';

                if(resolvedLocale === ''){
                    
                    throw new Error(`Language ${item} could not be resolved to any available locale.`);
                }

            } else {

                this._validateLocaleString(item);
                resolvedLocale = item;
            }

            if(!this._availableLocales.includes(resolvedLocale)){

                throw new Error(resolvedLocale + ' not defined as available for translation');
            }

            resolvedLocales.push(resolvedLocale);
        }

        this._translationPriority = resolvedLocales;
        this._cacheHashBaseString = this._wildCardsFormat + this._missingKeyBehaviour + this._translationPriority.join('');
        
        return this._translationPriority;
    }
    
    
    /**
     * @see setTranslationPriority()
     */
    getTranslationPriority(){

        return this._translationPriority;
    }


    /**
     * Get a translation based on the current locales translation priority for the given key, library and bundle
     *
     * @param string key The key we want to read from the specified resource bundle
     * @param string bundlePath A string with the format 'library_name/bundle_name' that is used to locate the bundle were the key to translate is found
     * @param array replaceWildcards A list of values that will replace wildcards that may be found on the translated text. Each wildcard
     *        will be replaced with the element whose index on replaceWildcards matches it. Check the documentation for setWildCardsFormat
     *        property to know more about how to setup wildcards on your translations.
     *
     * @see setWildCardsFormat()
     *
     * @return The translated text
     */
    t(key:string, bundlePath:string, replaceWildcards:string[] = []) {

        // Create a cache key to improve performance when requesting the same key translation several times
        const cacheKey = `${this._cacheHashBaseString}${key}${bundlePath}${replaceWildcards.join('')}`;

        if (!this._keyValuesCache[cacheKey]) {

            const [library, bundle] = bundlePath.split('/');
            
            this._forceNonEmptyString(key, '', 'key must be non empty string');
            this._forceNonEmptyString(bundlePath, '', 'bundlePath must be non empty string');
            this._forceNonEmptyString(library, '', 'no library specified on bundlePath');
            this._forceNonEmptyString(bundle, '', 'no bundle specified on bundlePath');
            
            if(this._translationPriority.length === 0){

                throw new Error(`No translation priority specified`);
            }
            
            const replacementsCount = replaceWildcards.length;
            
            // Loop all the translation priority locales to find the first one with a value for the specified key
            for (const locale of this._translationPriority) {
                
                if(!this.isLocaleLoaded(locale)){

                    throw new Error(`Locale ${locale} must be loaded before requesting translations`);                    
                }

                if (this._loadedRawTranslationData[library]?.[bundle]?.[locale]?.[key]) {

                    let result = this._loadedRawTranslationData[library][bundle][locale][key];

                    // Replace all wildcards on the text with the specified replacements if any
                    for (let i = 0; i < replacementsCount; i++) {

                        result = this._replace(result, this._replace(this._wildCardsFormat, 'N', i.toString()), replaceWildcards[i]);
                    }

                    this._keyValuesCache[cacheKey] = result;
                    
                    return result;
                }
            }

            // Check if an exception needs to be thrown if the specified key is not found on this bundle
            if (this._missingKeyBehaviour.includes('$exception')) {
                
                throw new Error(`Translation key <${key}> not found on <${bundlePath}>`);
            }

            this._keyValuesCache[cacheKey] = this._replace(this._missingKeyBehaviour, '$key', key);
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
     * TODO - If we move this class to TurboCommons, we can remove this method
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
