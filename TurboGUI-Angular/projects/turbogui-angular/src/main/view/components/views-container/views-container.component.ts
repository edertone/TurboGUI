/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, ViewContainerRef, Input, OnInit } from '@angular/core';
import { ViewsService } from '../../../controller/views.service';


/**
 * Component that is used as a container for application views.
 * We must create only one views container in our application and pass to it a reference to our main
 * viewsService instance. For example:
 *
 * <tg-views-container [viewsService]="viewsService"></tg-views-container>
 */
@Component({
  selector: 'tg-views-container',
  templateUrl: './views-container.component.html',
  styleUrls: ['./views-container.component.scss']
})


export class ViewsContainerComponent implements OnInit {


    /**
     * A reference to the views service that is used to operate with this views container.
     */
    @Input() viewsService: ViewsService | null = null;


    constructor(private readonly viewContainerRef: ViewContainerRef) {

    }


    /**
     * Check that the service reference has been correctly passed
     */
    ngOnInit() {

        if (!(this.viewsService instanceof ViewsService)) {

            throw new Error('ViewService instance must be referenced on a views container');

        } else {

            this.viewsService.viewContainerRef = this.viewContainerRef;
        }
    }
}
