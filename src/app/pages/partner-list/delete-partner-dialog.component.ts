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
  ],  templateUrl: './delete-partner-dialog.component.html',
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
