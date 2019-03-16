/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusyStateBaseComponent } from '../../view/components/busy-state-base/busy-state-base.component';
import { DialogService } from '../../controller/dialog.service';
import { LocalizationService } from '../../controller/localization.service';
import { HTTPService } from '../../controller/http.service';
import { NotificationService } from '../../controller/notification.service';
import { UserService } from '../../controller/user.service';
import { ViewsService } from '../../controller/views.service';
import { ViewsContainerComponent } from '../../view/components/views-container/views-container.component';
import { ButtonImageComponent } from '../../view/components/button-image/button-image.component';
import { ButtonContainerComponent } from '../../view/components/button-container/button-container.component';
import { DialogSingleOptionComponent } from '../../view/components/dialog-single-option/dialog-single-option.component';


/**
 * This file contains the root module that contains all the library declarations and exports.
 */
@NgModule({

    imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        BrowserAnimationsModule
    ],

    declarations: [
        BusyStateBaseComponent,
        DialogSingleOptionComponent,
        ViewsContainerComponent,
        ButtonImageComponent,
        ButtonContainerComponent
    ],

    // Add here components that must be dynamically created at runtime
    entryComponents: [
        BusyStateBaseComponent,
        DialogSingleOptionComponent
    ],

    // Globally available singleton services are added here
    providers: [
        DialogService,
        LocalizationService,
        HTTPService,
        NotificationService,
        UserService,
        ViewsService
    ],

    exports: [
        BusyStateBaseComponent,
        ViewsContainerComponent,
        ButtonImageComponent,
        ButtonContainerComponent,
        DialogSingleOptionComponent
    ]
})

export class TurboGuiAngularModule { }
