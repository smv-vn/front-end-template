import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { DemoRecord, StatusOption } from '../../../models/demo.model';
import { DemoService } from '../../../services/demo.service';

@Component({
    selector: 'app-edit-demo-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        ToastModule
    ],    providers: [MessageService, DemoService],
    templateUrl: './edit-demo-dialog.component.html',
    styleUrl: './edit-demo-dialog.component.css'
})

export class EditDemoDialogComponent implements OnInit, OnChanges {
    @Input() display = false;
    @Input() record: DemoRecord | null = null;
    @Output() displayChange = new EventEmitter<boolean>();
    @Output() recordUpdated = new EventEmitter<void>();

    demoForm: FormGroup;
    isSubmitting = false;

    statusOptions: StatusOption[] = [
        { label: 'Đã ký', value: 'Đã ký' },
        { label: 'Đã trình ký', value: 'Đã trình ký' },
        { label: 'Bị từ chối', value: 'Bị từ chối' },
        { label: 'Chưa trình ký', value: 'Chưa trình ký' },
        { label: 'Đã đóng', value: 'Đã đóng' }
    ];

    constructor(
        private fb: FormBuilder,
        private demoService: DemoService,
        private messageService: MessageService
    ) {
        this.demoForm = this.createForm();
    }

    ngOnInit(): void {
        this.populateForm();
    }

    ngOnChanges(): void {
        if (this.record) {
            this.populateForm();
        }
    }

    private createForm(): FormGroup {
        return this.fb.group({
            code: ['', [Validators.required, Validators.minLength(3)]],
            unit: ['', [Validators.required, Validators.minLength(2)]],
            staffCount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            status: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            description: ['']
        });
    } private populateForm(): void {
        if (this.record) {
            // Parse datetime strings back to Date objects
            const parseDateTime = (dateTimeStr: string): Date => {
                try {
                    // Handle various datetime formats
                    if (dateTimeStr.includes(' - ')) {
                        // Format: "dd/mm/yyyy - hh:mm:ss"
                        const [datePart, timePart] = dateTimeStr.split(' - ');
                        const [day, month, year] = datePart.split('/');
                        const [hour, minute, second] = timePart.split(':');
                        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
                    } else if (dateTimeStr.includes('T') || dateTimeStr.includes('Z')) {
                        // ISO format (2025-06-18T18:29:55.000Z)
                        const isoDate = new Date(dateTimeStr);
                        // Convert to local timezone
                        return new Date(isoDate.getTime() - (isoDate.getTimezoneOffset() * 60000));
                    } else {
                        // Try direct parsing
                        return new Date(dateTimeStr);
                    }
                } catch (error) {
                    console.warn('Failed to parse datetime:', dateTimeStr, error);
                    return new Date(); // fallback to current date
                }
            };

            this.demoForm.patchValue({
                code: this.record.code,
                unit: this.record.unit,
                staffCount: this.record.staffCount,
                status: this.record.status,
                startTime: parseDateTime(this.record.startTime),
                endTime: parseDateTime(this.record.endTime),
                description: this.record.description || ''
            });
        }
    }

    get formControls() {
        return this.demoForm.controls;
    }

    getFieldError(fieldName: string): string {
        const field = this.formControls[fieldName];
        if (field?.errors && field?.touched) {
            const errors = field.errors;

            if (errors['required']) {
                return this.getRequiredMessage(fieldName);
            }
            if (errors['minlength']) {
                return `${this.getFieldDisplayName(fieldName)} phải có ít nhất ${errors['minlength'].requiredLength} ký tự`;
            }
            if (errors['pattern']) {
                return this.getPatternMessage(fieldName);
            }
        }
        return '';
    }

    private getRequiredMessage(fieldName: string): string {
        return `${this.getFieldDisplayName(fieldName)} không được để trống`;
    }

    private getFieldDisplayName(fieldName: string): string {
        const fieldNames: { [key: string]: string } = {
            'code': 'Mã biên bản',
            'unit': 'Đơn vị',
            'staffCount': 'Số nhân viên',
            'status': 'Trạng thái',
            'startTime': 'Thời gian có hiệu lực',
            'endTime': 'Thời gian hết hiệu lực'
        };
        return fieldNames[fieldName] || fieldName;
    }

    private getPatternMessage(fieldName: string): string {
        if (fieldName === 'staffCount') {
            return 'Số nhân viên phải là số';
        }
        return 'Định dạng không hợp lệ';
    } onSubmit(): void {
        if (this.demoForm.valid && this.record) {
            this.isSubmitting = true;
            const formData = this.demoForm.value;

            // Format datetime to consistent format
            const formatDateTime = (date: Date) => {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const hour = date.getHours().toString().padStart(2, '0');
                const minute = date.getMinutes().toString().padStart(2, '0');
                const second = date.getSeconds().toString().padStart(2, '0');

                return `${day}/${month}/${year} - ${hour}:${minute}:${second}`;
            };

            const updatedRecord: DemoRecord = {
                ...this.record,
                code: formData.code,
                unit: formData.unit,
                staffCount: formData.staffCount,
                status: formData.status,
                startTime: formatDateTime(formData.startTime),
                endTime: formatDateTime(formData.endTime),
                description: formData.description
            };

            this.demoService.updateRecord(updatedRecord).subscribe(success => {
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã cập nhật biên bản'
                    });
                    this.recordUpdated.emit();
                    this.closeDialog();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể cập nhật biên bản'
                    });
                }
                this.isSubmitting = false;
            });
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.formControls).forEach(key => {
                this.formControls[key].markAsTouched();
            });
        }
    }

    closeDialog(): void {
        this.display = false;
        this.displayChange.emit(this.display);
    }

    private resetForm(): void {
        this.demoForm.reset();
        this.isSubmitting = false;
    }

    onDialogHide(): void {
        this.resetForm();
    }
}
