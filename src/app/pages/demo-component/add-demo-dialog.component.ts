import { Component, EventEmitter, Input, Output } from '@angular/core';
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

import { DemoRecord, StatusOption } from '../../models/demo.model';
import { DemoService } from '../../services/demo.service';

@Component({
    selector: 'app-add-demo-dialog',
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
    templateUrl: './add-demo-dialog.component.html',
    styleUrl: './add-demo-dialog.component.css'
})
export class AddDemoDialogComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() recordAdded = new EventEmitter<void>();

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
    }    onSubmit(): void {
        if (this.demoForm.valid) {
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

            const newRecord: DemoRecord = {
                id: Date.now().toString(),
                code: formData.code,
                unit: formData.unit,
                staffCount: formData.staffCount,
                status: formData.status,
                startTime: formatDateTime(formData.startTime),
                endTime: formatDateTime(formData.endTime),
                description: formData.description
            };

            this.demoService.addRecord(newRecord).subscribe(success => {
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm biên bản mới'
                    });
                    this.recordAdded.emit();
                    this.resetForm();
                    this.closeDialog();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể thêm biên bản'
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
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    private resetForm(): void {
        this.demoForm.reset();
        this.isSubmitting = false;
    }

    onDialogHide(): void {
        this.resetForm();
    }
}
