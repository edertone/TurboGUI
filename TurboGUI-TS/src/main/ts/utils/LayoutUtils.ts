/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */


/**
 * Utilities to operate with the visual layout of elements
 */
export class LayoutUtils {
    
    
    /**
     * Calculates the maximum z-index value for all the document elements 
     * IMPORTANT: this method may be a bit heavy, as it loops on a lot of elements, so use it carefully
     * 
     * @param plusOne (true by default), Enable it to add 1 to the result. Useful it we want to get the z index for a new element to be placed
              on top of all the others
     * 
     * @returns The maximum z-index value found 
     */
    public static getMaxZIndex(plusOne = true){

        let highest = 0;
        let elements = document.querySelectorAll('body *');
        
        for (let i = 0; i < elements.length; i++){
            
            let zindex = parseFloat(window.getComputedStyle(elements[i]).zIndex);
        
            if (zindex > highest){
                
                highest = zindex;
            }
        }
        
        return highest + (plusOne ? 1 : 0);
    }


    /**
     * Centers an element in relation to a specified reference (main viewport, another element or a coordinate) 
     * 
     * @param element An html element to be centered. Notice that its position value must be "absolute" or "fixed"
     *
     * @param reference (Null by default). The element will be centered based on this value:<br>
     *      - Null: The element will be centered relative to the viewport<br>
     *      - HTMLElement: The element will be centered relative to that other element<br>
     *      - Array with 4 values: The element will be centered relative to an imaginary object with coordinates and size: [x, y, width, height]
     * @param options An object that may contain any of the following option values:<br>
 *          - horizontalMode: (center by default)<br>
 *              none: To avoid modifying the horizontal layout of the element<br>
 *              left: To layout the element outside the left border of the reference<br>
     *          leftIn: To layout the element attached to the left border of the reference, but from the inside<br>
     *          center: To layout the element at the horizontal center of the reference<br>
     *          right: To layout the element outside the right border of the reference<br>
     *          rightIn: To layout the element attached to the right border of the reference, but from the inside<br>
     *      - verticalMode: (center by default)<br>
     *          none: To avoid modifying the vertical layout of the element<br>
     *          top: To layout the element above the top border of the reference<br>
     *          topIn: To layout the element attached to the top border of the reference, but from the inside<br>
     *          center: To layout the element at the vertical center of the reference<br>
     *          bottom: To layout the element below the lower border of the reference<br>
     *          bottomIn: To layout the element attached to the lower border of the reference, but from the inside<br>
     *      - offsetX: (0 by default). Used to displace the horizontal center by the specified amount<br>
     *      - offsetY: (0 by default). Used to displace the vertical center by the specified amount<br>
     *      - keepInViewPort: (True by default). Is used to force the element inside the main browser window area in case the centering process makes it partially invisible outside the browser window.
     * 
     * @return void
     */
    public static centerElementTo(element:HTMLElement, reference:HTMLElement|null|number[] = null, options: {horizontalMode?: string, verticalMode?:string, 
                                  offsetX?:number, offsetY?:number, keepInViewPort?:boolean} = {}) {

        options.horizontalMode = options.hasOwnProperty('horizontalMode') ? options.horizontalMode : "center";
        options.verticalMode = options.hasOwnProperty('verticalMode') ? options.verticalMode : "center";
        options.offsetX = (options.hasOwnProperty('offsetX') && options.offsetX !== undefined) ? options.offsetX : 0;
        options.offsetY = (options.hasOwnProperty('offsetY') && options.offsetY !== undefined) ? options.offsetY : 0;
        options.keepInViewPort = options.hasOwnProperty('keepInViewPort') ? options.keepInViewPort : true;
                
        // Check if the elements exists
        if(element.parentNode === null || ((reference instanceof HTMLElement) && reference.parentNode === null)){

            throw new Error("Element and reference must exist in the DOM");
        }

        // Element to center must be absolte or fixed position, otherwise centering it is nonsense
        if(element.style.position !== 'absolute' && element.style.position !== 'fixed'){

            throw new Error("Element to center must have absolute or fixed css position, but is " + element.style.position);
        }

        // Margins must be removed on the element to center
        element.style.margin = '0';

        // Get the element size
        let elementWidth = element.offsetWidth;
        let elementHeight = element.offsetHeight;

        // If the element position is fixed, window references are simply 0
        let windowLeftForFixed = (element.style.position === 'fixed') ? 0 : document.documentElement.scrollLeft;
        let windowTopForFixed = (element.style.position === 'fixed') ? 0 : document.documentElement.scrollTop;

        // Get the reference element size (or the main window if no reference element specified)
        let referenceWidth = reference instanceof Array ? reference[2] : (reference === null) ? window.innerWidth : reference.offsetWidth;
        let referenceHeight = reference instanceof Array ? reference[3] : (reference === null) ? window.innerHeight : reference.offsetHeight;

        // Get the reference element coordinates (or the main window ones)
        let referenceLeft = reference instanceof Array ? reference[0] : (reference === null) ? windowLeftForFixed : reference.offsetLeft;
        let referenceTop = reference instanceof Array ? reference[1] : (reference === null) ? windowTopForFixed : reference.offsetTop;

        // These variables will store the final calculated element coordiantes
        let elementLeft = 0;
        let elementTop = 0;

        // Perform the horizontal centering of the element
        switch(options.horizontalMode){

            case 'none':
                elementLeft = -1;
                break;

            case 'left':
                elementLeft = options.offsetX + referenceLeft - elementWidth;
                break;

            case 'leftIn':
                elementLeft = options.offsetX + referenceLeft;
                break;

            case 'center':
                elementLeft = options.offsetX + referenceLeft + (referenceWidth - elementWidth) / 2;
                break;

            case 'right':
                elementLeft = options.offsetX + referenceLeft + referenceWidth;
                break;
            
            case 'rightIn':
                elementLeft = options.offsetX + referenceLeft + referenceWidth - elementWidth;
                break;
            
            default:
                throw new Error("horizontalMode value is wrong");
        }

        // Perform the vertical centering of the element
        switch(options.verticalMode){

            case 'none':
                elementTop = -1;
                break;

            case 'top':
                elementTop = options.offsetY + referenceTop - elementHeight;
                break;

            case 'topIn':
                elementTop = options.offsetY + referenceTop;
                break;

            case 'center':
                elementTop = options.offsetY + referenceTop + (referenceHeight - elementHeight) / 2;
                break;

            case 'bottom':
                elementTop = options.offsetY + referenceTop + referenceHeight;
                break;
            
            case 'bottomIn':
                elementTop = options.offsetY + referenceTop + referenceHeight - elementHeight;
                break;
            
            default:
                throw new Error("mode parameter value is wrong");
        }

        // Check that the element does not fall outside the screen
        if(options.keepInViewPort){

            if(elementLeft < windowLeftForFixed){

                elementLeft = windowLeftForFixed;
            }

            if(elementLeft + elementWidth > windowLeftForFixed + window.innerWidth){

                elementLeft = windowLeftForFixed + window.innerWidth - elementWidth;
            }

            if(elementTop < windowTopForFixed){

                elementTop = windowTopForFixed;
            }

            if(elementTop + elementHeight > windowTopForFixed + window.innerHeight){

                elementTop = windowTopForFixed + window.innerHeight - elementHeight;
            }
        }

        // Position the element where it's been calculated
        if(elementLeft >= 0){

            element.style.left = elementLeft + "px";
        }

        if(elementTop >= 0){

            element.style.top = elementTop + "px";
        }
    }
}