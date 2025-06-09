import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

// Components
import { PartnerListComponent } from './components/partner-list.component';
import { AddPartnerDialogComponent } from './components/add-partner-dialog.component';
import { EditPartnerDialogComponent } from './components/edit-partner-dialog.component';

// Services
import { PartnerService } from './services/partner.service';

@NgModule({
  declarations: [
    PartnerListComponent,
    AddPartnerDialogComponent,
    EditPartnerDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PartnerListComponent
      }
    ]),

    // PrimeNG Modules
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    DynamicDialogModule,
    ToastModule,
    ConfirmDialogModule,
    MenuModule,
    AvatarModule,
    FileUploadModule,
    TooltipModule
  ],
  providers: [
    PartnerService
  ]
})
export class PartnerModule { }
