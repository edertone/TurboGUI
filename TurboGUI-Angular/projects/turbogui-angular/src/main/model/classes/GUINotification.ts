/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

/**
 * Defines the data that is contained inside a GUI notification
 */
export class GUINotification {


    constructor(name: string, type = '', data: any = null) {

        this.name = name;
        this.type = type;
        this.data = data;
    }


    /**
     * The name for this notification
     */
    name = '';


    /**
     * An optional type to categorize this notification in case the name is not enough
     * to uniquely identify it
     */
    type = '';


    /**
     * Additional data to send with the notification
     */
    data: any = null;
}
