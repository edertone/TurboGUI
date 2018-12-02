import { NgModule } from '@angular/core';
import { DialogService } from '../../controller/dialog.service';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    
  declarations: [
  ],
  
  imports: [
      MatDialogModule,
      MatSnackBarModule,
      BrowserAnimationsModule
  ],
  
  // Globally available singleton services are added here
  providers: [
      DialogService
  ],

  exports: [
  ]
})

export class TurboguiAngularModule { }
