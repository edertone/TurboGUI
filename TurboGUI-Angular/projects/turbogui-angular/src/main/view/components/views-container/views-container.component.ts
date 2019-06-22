/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, ViewContainerRef, Input, ViewChild, OnInit, Type, OnDestroy } from '@angular/core';
import { ViewsService } from '../../../controller/views.service';
import { View } from '../../../model/classes/View';


/**
 * Component that is used as a container for application views.
 * We must create only one views container in our application and pass to it a reference to our main
 * viewsService instance. For example:
 *
 * <tg-views-container [viewsService]="viewsService" [initialView]="HomeViewComponent"></tg-views-container>
 */
@Component({
  selector: 'tg-views-container',
  templateUrl: './views-container.component.html',
  styleUrls: ['./views-container.component.scss']
})


export class ViewsContainerComponent implements OnInit, OnDestroy {


    /**
     * If we want to load a view by default when this component is loaded for the first time, we can
     * set here the respective class view and it will be automatically added.
     */
    @Input() initialView: Type<View> | null = null;


    /**
     * A reference to the views service that is used to operate with this views container.
     * This must be specified when this component is added to the application
     */
    @Input() viewsService: ViewsService | null = null;


    /**
     * A reference to the ng-template inside this component that is used as the anchor point to load views
     */
    @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;


    /**
     * Check that the service reference has been correctly passed
     */
    ngOnInit() {

        if (!(this.viewsService instanceof ViewsService)) {

            throw new Error('ViewService instance must be referenced on a views container');

        } else {

            this.viewsService.viewContainerRef = this.viewContainerRef;
        }

        // Set the initial view if defined
        if (this.initialView !== null) {

            this.viewsService.pushView(this.initialView);
        }
    }


    /**
     * Clear the current view from the service when this component is deleted
     */
    ngOnDestroy() {

        if (this.viewsService instanceof ViewsService) {

            this.viewsService.popView();
            this.viewsService.viewContainerRef = null;
        }
    }
}
