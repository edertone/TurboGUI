/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { DialogErrorComponent } from '../../view/components/dialog-error/dialog-error.component';
import { DialogSingleOptionComponent } from '../../view/components/dialog-single-option/dialog-single-option.component';
import { DialogTwoOptionComponent } from '../../view/components/dialog-two-option/dialog-two-option.component';
import { DialogSingleSelectionListComponent } from '../../view/components/dialog-single-selection-list/dialog-single-selection-list.component';
import { DialogMultipleOptionComponent } from '../../view/components/dialog-multiple-option/dialog-multiple-option.component';
import { BrowserService } from '../../controller/browser.service';
import { ElementCreatedDirective } from '../../view/directives/ElementCreatedDirective';
import { ElementDestroyedDirective } from '../../view/directives/ElementDestroyedDirective';
import { AutoFocusOnDisplayDirective } from '../../view/directives/AutoFocusOnDisplayDirective';
import { AutoSelectTextOnFocusDirective } from '../../view/directives/AutoSelectTextOnFocusDirective';


/**
 * This file contains the root module that contains all the library declarations and exports.
 */
@NgModule({

    imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        BrowserAnimationsModule
    ],

    declarations: [
        BusyStateBaseComponent,
        DialogErrorComponent,
        DialogSingleOptionComponent,
        DialogTwoOptionComponent,
        DialogMultipleOptionComponent,
        DialogSingleSelectionListComponent,
        ViewsContainerComponent,
        ButtonImageComponent,
        ButtonContainerComponent,
        ElementCreatedDirective,
        ElementDestroyedDirective,
        AutoFocusOnDisplayDirective,
        AutoSelectTextOnFocusDirective
    ],

    // Globally available singleton services are added here
    providers: [
        DialogService,
        LocalizationService,
        HTTPService,
        NotificationService,
        UserService,
        ViewsService,
        BrowserService
    ],

    exports: [
        BusyStateBaseComponent,
        ViewsContainerComponent,
        ButtonImageComponent,
        ButtonContainerComponent,
        DialogErrorComponent,
        DialogSingleOptionComponent,
        DialogTwoOptionComponent,
        DialogMultipleOptionComponent,
        DialogSingleSelectionListComponent,
        ElementCreatedDirective,
        ElementDestroyedDirective,
        AutoFocusOnDisplayDirective,
        AutoSelectTextOnFocusDirective
    ]
})

export class TurboGuiAngularModule { }
