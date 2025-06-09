import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { Partner } from '../../models/partner.model';

@Component({
  selector: 'app-delete-partner-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    AvatarModule,
    DividerModule
  ],
  template: `
    <p-dialog 
      [(visible)]="display" 
      header="Xác nhận xóa đối tác" 
      [modal]="true" 
      [style]="{width: '450px'}"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="delete-partner-dialog"
      (onHide)="onCancel()">
      
      <div class="dialog-content">
        <!-- Warning Icon -->
        <div class="warning-section">
          <i class="pi pi-exclamation-triangle warning-icon"></i>
        </div>

        <!-- Partner Info -->
        <div class="partner-info" *ngIf="partner">
          <div class="partner-details">
            <div class="partner-avatar">
              <p-avatar 
                [image]="partner.avatar" 
                size="large" 
                shape="circle"
                *ngIf="partner.avatar">
              </p-avatar>
              <p-avatar 
                icon="pi pi-user" 
                size="large" 
                shape="circle"
                *ngIf="!partner.avatar">
              </p-avatar>
            </div>
            
            <div class="partner-text">
              <h4 class="partner-name">{{ partner.name }}</h4>
              <p class="partner-code">Mã đối tác: <strong>{{ partner.code }}</strong></p>
              <p class="partner-phone">SĐT: {{ partner.phone }}</p>
            </div>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Confirmation Message -->
        <div class="confirmation-message">
          <p class="message-text">
            Bạn có chắc chắn muốn xóa đối tác này không?
          </p>
          <p class="warning-text">
            <i class="pi pi-info-circle"></i>
            Hành động này không thể hoàn tác!
          </p>
        </div>
      </div>

      <!-- Dialog Footer -->
      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button 
            label="Hủy" 
            icon="pi pi-times" 
            styleClass="p-button-outlined p-button-secondary" 
            (onClick)="onCancel()"
            [disabled]="isDeleting">
          </p-button>
          <p-button 
            label="Xác nhận xóa" 
            icon="pi pi-trash" 
            styleClass="p-button-danger"
            (onClick)="onConfirm()"
            [loading]="isDeleting">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styleUrls: ['./delete-partner-dialog.component.css']
})
export class DeletePartnerDialogComponent {
  @Input() display: boolean = false;
  @Input() partner: Partner | null = null;
  @Input() isDeleting: boolean = false;
  
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() deleteConfirmed = new EventEmitter<Partner>();
  @Output() deleteCancelled = new EventEmitter<void>();

  onConfirm() {
    if (this.partner) {
      this.deleteConfirmed.emit(this.partner);
    }
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(false);
    this.deleteCancelled.emit();
  }
}
