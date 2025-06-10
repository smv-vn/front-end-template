import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DemoRecord } from '../../models/demo.model';

@Component({    selector: 'app-delete-demo-dialog',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './delete-demo-dialog.component.html',
    styleUrl: './delete-demo-dialog.component.css'
})
export class DeleteDemoDialogComponent {
    @Input() display: boolean = false;
    @Input() record: DemoRecord | null = null;
    @Input() isDeleting: boolean = false;
    @Output() deleteConfirmed = new EventEmitter<void>();
    @Output() deleteCancelled = new EventEmitter<void>();

    onOverlayClick(event: Event): void {
        if (event.target === event.currentTarget) {
            this.onCancel();
        }
    }

    onConfirm(): void {
        this.deleteConfirmed.emit();
    }

    onCancel(): void {
        this.deleteCancelled.emit();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Đã ký':
                return 'status-success';
            case 'Đã trình ký':
                return 'status-info';
            case 'Bị từ chối':
                return 'status-danger';
            case 'Chưa trình ký':
                return 'status-warning';
            case 'Đã đóng':
                return 'status-secondary';
            default:
                return 'status-default';
        }
    }
}
