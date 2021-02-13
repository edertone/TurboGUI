/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */
 
   
import { CSSUtils } from '../utils/CSSUtils';


/**
 * TODO
 */
export class DialogManager{

    
    /**
     * Check public getter for docs
     */
    private _isEnabled = true;
    
    
    /**
     * Contains the sidenav instance that is currently visible to the user or null if none added
     */
    private _activeSideNav: HTMLElement|undefined = undefined;
    
    
    /**
     * Contains the shadow layer instance that is currently visible to the user or null if none added
     */
    private _activeShadowLayer: HTMLElement|undefined = undefined;


    /**
     * Tells if this dialog service is enabled or not. If dialog service is disabled, none of it's features will work
     * This is used to block all dialog features normally when shutting down the application
     *
     * Use with caution. When this is set to false, dialog service stops working.
     */
    set isEnabled(v: boolean) {

        if (v === this._isEnabled) {

            return;
        }

        this._isEnabled = v;
    }


    /**
     * Enables a warning that will be shown to the user when he/she tries to close the application.
     * This warning will prompt the user to continue with the exit process or cancel it.
     * The specific texts of this message are a generic ones and cannot be changed.
     *
     * IMPORTANT: This method must be called after the document has been loaded in order to work,
     * otherwise it will do nothing.
     */
    addCloseApplicationWarning() {

        window.onbeforeunload = function() {
        
            return true;
        }
    }


    /**
     * Remove the close application warning message if previously assigned
     */
    removeCloseApplicationWarning() {

        window.onbeforeunload = null;
    }


    /**
     * TODO - translate from angular version
     */
    addModalBusyState() {

        // TODO - translate from angular version
    }


    /**
     * TODO - translate from angular version
     */
    get isShowingBusyState() {

        // TODO - translate from angular version
        return false;
    }


    /**
     * TODO - translate from angular version
     */
    removeModalBusyState() {

        // TODO - translate from angular version
    }


    /**
     * TODO - translate from angular version
     */
    addSnackBar() {

        // TODO - translate from angular version
    }


    /**
     * TODO - translate from angular version
     */
    get isShowingSnackBar() {

        // TODO - translate from angular version
        return false;
    }


    /**
     * TODO - translate from angular version
     */
    removeSnackBar() {

        // TODO - translate from angular version
    }


    /**
     * TODO - translate from angular version
     */
    addDialog() {

        // TODO - translate from angular version
    }
    
    
    /**
     * TODO - translate from angular version
     */
    removeAllDialogs() {

        // TODO - translate from angular version
    }
    
    
    /**
     * Show a sidenav layer with the specified contents.
     *
     * @param content html content that will be placed inside the sidenav layer to be shown
     * @param options An optional object with all the customizations we want to apply to the generated sidenav layer:
     *        - side ('LEFT' by default): To define from which side of the screen will the sidenav appear. Accepted values: 'LEFT', 'RIGHT'
     *        - width ('50%' by default): A css value to specify the sidenav horizontal size (percentual values are also accepted).
     *        - modal (true by default): Specifies if everything below the sidenav gets locked
     *        - dropShadow (0.4 by default): Specifies the opacity for the shadow that will be shown below the sidenav. If set to 0, no shadow will be shown.
     *        - closeOnClickOutside (true by default): Specifies if the sidenav will be closed when the user clicks outside it.
     *        - class: Specifies the css class that will be applied to the sidenav element
     *        - fullHeight: TODO - analyze this feature
     *        - showTime (300 by default): The amount of miliseconds that will take the sidenav animation to complete
     */
    addSideNav(content:HTMLElement, options:{ side?: string, width?: string, modal?: boolean, dropShadow?: number,
               closeOnClickOutside?:boolean, class?: string, fullHeight?: boolean, showTime?: number} = {}){        
        
        // TODO - modal, fullHeight
        
        if (!this._isEnabled) {

            return;
        }

        if (this._activeSideNav !== undefined) {

            throw new Error('Trying to show a side nav while another one is still visible');
        }
        
        options.modal = options.hasOwnProperty('modal') ? options.modal : true;
        options.dropShadow = options.dropShadow ? options.dropShadow : .4;
        options.closeOnClickOutside = options.hasOwnProperty('closeOnClickOutside') ? options.closeOnClickOutside : true;
        options.showTime = options.showTime ? options.showTime : 300;
        
        if(options.modal){
            
            // TODO - lock everything  below the dialog
        }
        
        let sideNavContainer = document.createElement('div');      
        
        let classStyles:any = {}; 
        
        if(options.class){
            
            sideNavContainer.className = options.class;
            classStyles = CSSUtils.getStylesFromClass(options.class);
        }
          
        sideNavContainer.style.top = '0';
        sideNavContainer.style.width = '0';
        sideNavContainer.style.opacity = '0';
        sideNavContainer.style.position = 'fixed';
        sideNavContainer.style.overflowX = 'hidden'
        sideNavContainer.style.height = '100%';
        sideNavContainer.style.transition = 'opacity ' + (options.showTime * 0.7) + 'ms ease-out, width ' + options.showTime + 'ms ease-out';
        sideNavContainer.dataset.showTime = String(options.showTime);
        
        if(options.dropShadow > 0){
            
            sideNavContainer.style.boxShadow = '-4px 0px 14px 8px #00000061';
            sideNavContainer.dataset.dropShadow = String(options.dropShadow);
            this._addShadowLayer(options.dropShadow, options.showTime);  
        }
        
        // Set a default background color if not specified by the provided css class
        if(!classStyles.backgroundColor){
        
            sideNavContainer.style.backgroundColor = '#111';    
        }
        
        // Set a default z index if not specified by the provided css class
        if(!classStyles.zIndex){
        
            sideNavContainer.style.zIndex = '50000000';
        }
        
        // Place the side nav at the left or right as requested
        if(options.side && options.side === 'RIGHT'){

            sideNavContainer.style.right = '0px';
                        
        }else{
            
            sideNavContainer.style.left = '0px';
        }
                
        // Add the contents to the sidenav container
        sideNavContainer.appendChild(content.cloneNode(true));

        // Add the container to the body and trigger the element animation by changing the width and opacity      
        document.body.appendChild(sideNavContainer);
        window.getComputedStyle(sideNavContainer).width;
        window.getComputedStyle(sideNavContainer).opacity;
        
        sideNavContainer.style.opacity = "1";
        sideNavContainer.style.width = options.width ? options.width : '50%';
         
        // Wait for the show time before adding the click outside detection
        setTimeout(() => {
            
            if(options.closeOnClickOutside){
                
                document.addEventListener('mouseup', this.sideNavOutsideClickListener);
            }
        
            this._activeSideNav = sideNavContainer;
            
        }, options.showTime);  
    }
    
    
    /**
     * Aux method to listen for a click outside the sidenav container, to close it
     */
    sideNavOutsideClickListener = (event:any) => {
        
        if (this._activeSideNav && !this._activeSideNav.contains(event.target)) {
            
          this.removeSideNav();
        }
    }
    
    
    /**
     * Tells if the application is currently showing a sidenav element or not
     */
    get isShowingSideNav() {

        return this._activeSideNav !== undefined;
    }
    
    
    /**
     * Force the removal of the side nav if it exists.
     *
     * If no side nav is currently visible, this method will do nothing
     */
    removeSideNav() {

        if (!this._isEnabled || !this._activeSideNav) {

            return; 
        }
        
        // Animate the sidenav element
        this._activeSideNav.style.width = "0px";
        this._activeSideNav.style.opacity = "0";
        
        if(this._activeSideNav.dataset.dropShadow){
                
            this._removeShadowLayer();  
        }
            
        setTimeout(() => {
            
            document.removeEventListener('mouseup', this.sideNavOutsideClickListener);
            document.body.removeChild(this._activeSideNav as HTMLElement);
            
            this._activeSideNav = undefined;
            
        }, Number(this._activeSideNav.dataset.showTime));    
    }
    
    
    /**
     * Auxiliary method to add a shadow layer that covers the entire view and return it's html element instance
     */
    private _addShadowLayer(opacity:number, time:number){
        
        if(this._activeShadowLayer === undefined){
            
            this._activeShadowLayer = document.createElement('div');
                
            this._activeShadowLayer.style.position = 'fixed';
            this._activeShadowLayer.style.left = '0';
            this._activeShadowLayer.style.right = '0';
            this._activeShadowLayer.style.top = '0';
            this._activeShadowLayer.style.bottom = '0';
            this._activeShadowLayer.style.backgroundColor = '#000';           
            this._activeShadowLayer.style.opacity = '0';
            this._activeShadowLayer.style.transition = 'opacity ' + time + 'ms ease-out';
            this._activeShadowLayer.dataset.time = String(time);
        
            document.body.appendChild(this._activeShadowLayer);
            
            window.getComputedStyle(this._activeShadowLayer).opacity;
            this._activeShadowLayer.style.opacity = String(opacity);
        }
        
        return this._activeShadowLayer; 
    }
    
    
    /**
     * Auxiliary method to remove a previously added shadow layer
     */
    private _removeShadowLayer(){
        
        if(this._activeShadowLayer !== undefined){
            
            this._activeShadowLayer.style.opacity = '0';
            
            setTimeout(() => {
            
                document.body.removeChild(this._activeShadowLayer as HTMLElement);
                this._activeShadowLayer = undefined;
            
            }, Number(this._activeShadowLayer.dataset.time));   
        }
    }
}