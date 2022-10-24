/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */
 
   
import { CSSUtils } from '../utils/CSSUtils';
import { LayoutUtils } from '../utils/LayoutUtils';


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
     * Show an animated tooltip
     *
     * @param text The text to show
     * @param element The element to which the tooltip will be aligned
     * @param options An optional object with all the customizations we want to apply to the generated tooltip:
     *        - horizontalPos ('center' by default). The horizontal tooltip position relative to the element. Allowed values: center, left, right
     *        - verticalPos ('top' by default). The vertical tooltip position relative to the element. Allowed values: top, bottom, center
     *        - offsetX (0 by default). Used to displace the horizontal center by the specified amount
     *        - offsetY (0 by default). Used to displace the vertical center by the specified amount
     *        - class: The name of a css class to apply to the tooltip so we can customize it
     *        - timeout: The miliseconds it will take for the tooltip to close automatically after being shown
     *        - closeOnClick: (true by default). Set it to true if the tooltip has to be closed by a user click on it, false otherwise
     *        - showTime: The duration of the fade show and hide animations in miliseconds
     * 
     * @return void
     */
    addToolTip(text:string, element:HTMLElement, options:{ horizontalPos?:string, verticalPos?:string, offsetX?:number, offsetY?:number,
               class?:string, timeout?:number, closeOnClick?:boolean, showTime?:number } = {}) {

        if (!this._isEnabled) {

            return;
        }
        
        options.horizontalPos = options.hasOwnProperty('horizontalPos') ? options.horizontalPos : "center";
        options.verticalPos = options.hasOwnProperty('verticalPos') ? options.verticalPos : "top";
        options.offsetX = options.hasOwnProperty('offsetX') ? options.offsetX : 0;
        options.offsetY = options.hasOwnProperty('offsetY') ? options.offsetY : 0;
        options.timeout = options.hasOwnProperty('timeout') ? options.timeout : 2500;
        options.closeOnClick = options.hasOwnProperty('closeOnClick') ? options.closeOnClick : true;
        options.showTime = options.showTime ? options.showTime : 400;
        
        // Create the tool tip body
        let toolTipBody = document.createElement('div');
        
        let cssClass:any = {}; 
        
        if(options.class){
            
            toolTipBody.className = options.class;
            cssClass = CSSUtils.getStylesFromClass(options.class);
        }
        
        let cssBorderColor = cssClass.borderColor ? cssClass.borderColor : '#222';
        let cssBorderWidth = cssClass.borderWidth ? parseInt(cssClass.borderWidth).toString() : '2';
               
        toolTipBody.style.border = cssClass.border ? cssClass.border : 'solid ' + cssBorderWidth + 'px ' + cssBorderColor;     
        toolTipBody.style.borderColor = cssClass.borderColor ? cssClass.borderColor : toolTipBody.style.borderColor;     
        toolTipBody.style.borderRadius = cssClass.borderRadius ? cssClass.borderRadius : '10px';     
        toolTipBody.style.backgroundColor = cssClass.backgroundColor ? cssClass.backgroundColor : '#707070';
        toolTipBody.style.boxShadow = cssClass.boxShadow ? cssClass.boxShadow : '#999999 0px 0px 6px 3px';
        toolTipBody.style.padding = '0px 20px';
        
        // Create the tool tip text element
        let toolTipText = document.createElement('p');
        toolTipText.innerText = text;
        toolTipText.style.color = cssClass.color ? cssClass.color : '#fff';
        toolTipText.style.fontWeight = cssClass.fontWeight ? cssClass.fontWeight : 'normal';
        toolTipText.style.fontSize = cssClass.fontSize ? cssClass.fontSize : toolTipText.style.fontSize;
                
        // Create the tool tip arrow
        let toolTipArrow = document.createElement('div');
        toolTipArrow.style.margin = 'auto';
        toolTipArrow.style.width = toolTipArrow.style.height = '0';
        toolTipArrow.style.borderLeft = toolTipArrow.style.borderRight = '8px solid transparent';
        toolTipArrow.style.zIndex = cssClass.zIndex ? cssClass.zIndex : '40000001';
        
        // Create the tool tip container
        let toolTipContainer = document.createElement('div');      
        toolTipContainer.style.opacity = '0';
        toolTipContainer.style.position = 'absolute';
        toolTipContainer.style.display = 'flex';
        toolTipContainer.style.transition = 'opacity ' + options.showTime + 'ms ease-out, top ease-out 500ms';
        toolTipContainer.style.zIndex = cssClass.zIndex ? cssClass.zIndex : '40000000';
        
        switch(options.verticalPos){
            
            case 'bottom': case 'bottomIn':
                toolTipContainer.style.flexDirection = 'column-reverse';
                toolTipArrow.style.borderBottom = '8px solid ' + cssBorderColor;
                break;
                
            default:
                toolTipContainer.style.flexDirection = 'column';
                toolTipArrow.style.borderTop = '8px solid ' + cssBorderColor;
        }
                
        toolTipBody.appendChild(toolTipText);      
        toolTipContainer.appendChild(toolTipBody);
        toolTipContainer.appendChild(toolTipArrow);        
        document.body.appendChild(toolTipContainer);
        
        function positionToolTip(){
            
            LayoutUtils.centerElementTo(toolTipContainer, element, { horizontalMode: options.horizontalPos,
                verticalMode: options.verticalPos, offsetX: options.offsetX, offsetY: options.offsetY });
        }
        
        positionToolTip();
        
        // Trigger the element animation by changing the animated styles     
        toolTipContainer.style.top = (parseInt(toolTipContainer.style.top) + 10) + "px";
        window.getComputedStyle(toolTipContainer).opacity;
        window.getComputedStyle(toolTipContainer).top;
        
        toolTipContainer.style.opacity = "1";
        toolTipContainer.style.top = (parseInt(toolTipContainer.style.top) - 10) + "px";
                
        window.addEventListener('resize', positionToolTip);
        
        function removeToolTip() {
            
            toolTipContainer.style.opacity = "0";
             
            setTimeout(() => {
                
                toolTipContainer.remove();            
                window.removeEventListener('resize', positionToolTip);
                
            }, options.showTime);
        }
        
        if(options.closeOnClick){
            
            toolTipBody.addEventListener('click', removeToolTip);
        }
        
        setTimeout(removeToolTip, options.timeout);
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
        
        let cssClass:any = {}; 
        
        if(options.class){
            
            sideNavContainer.className = options.class;
            cssClass = CSSUtils.getStylesFromClass(options.class);
        }
          
        sideNavContainer.style.opacity = '0';
        sideNavContainer.style.position = 'fixed';
        sideNavContainer.style.overflowX = 'hidden'
        sideNavContainer.style.top = sideNavContainer.style.bottom = sideNavContainer.style.width = '0';
        sideNavContainer.style.transition = 'opacity ' + (options.showTime * 0.7) + 'ms ease-out, width ' + options.showTime + 'ms ease-out';
        sideNavContainer.style.backgroundColor = cssClass.backgroundColor ? sideNavContainer.style.backgroundColor : '#111';
        sideNavContainer.style.zIndex = cssClass.zIndex ? sideNavContainer.style.zIndex : '500000000';
        sideNavContainer.dataset.showTime = String(options.showTime);
        
        if(options.dropShadow > 0){
            
            sideNavContainer.style.boxShadow = '-4px 0px 14px 8px #00000061';
            sideNavContainer.dataset.dropShadow = String(options.dropShadow);
            this._addShadowLayer(options.dropShadow, options.showTime);  
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
                
            this._activeShadowLayer.style.opacity = '0';
            this._activeShadowLayer.style.position = 'fixed';
            this._activeShadowLayer.style.left = this._activeShadowLayer.style.right = '0';
            this._activeShadowLayer.style.top = this._activeShadowLayer.style.bottom = '0';
            this._activeShadowLayer.style.backgroundColor = '#000';           
            this._activeShadowLayer.style.transition = 'opacity ' + time + 'ms ease-out';
            this._activeShadowLayer.style.zIndex = '400000000';
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