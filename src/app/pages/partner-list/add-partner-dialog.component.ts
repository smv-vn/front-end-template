import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { Partner } from '../../models/partner.model';
import { PartnerService } from '../../services/partner.service';

@Component({
    selector: 'app-add-partner-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,        FileUploadModule,
        AvatarModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './add-partner-dialog.component.html',
    styleUrl: './add-partner-dialog.component.css'
})
export class AddPartnerDialogComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() partnerAdded = new EventEmitter<void>();
    
    @ViewChild('fileUpload') fileUpload: any;

    partnerForm: FormGroup;
    isSubmitting = false;
    previewAvatar: string | null = null;
    selectedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private partnerService: PartnerService,
        private messageService: MessageService
    ) {
        this.partnerForm = this.createForm();
    }

    private createForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{3,10}$/)]],
            phone: ['', [Validators.required, Validators.pattern(/^(0[3|5|7|8|9])+([0-9]{8})$/)]],
            address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
            description: ['', [Validators.maxLength(500)]]
        });
    }

    get formControls() {
        return this.partnerForm.controls;
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
            if (errors['maxlength']) {
                return `${this.getFieldDisplayName(fieldName)} không được vượt quá ${errors['maxlength'].requiredLength} ký tự`;
            }
            if (errors['pattern']) {
                return this.getPatternMessage(fieldName);
            }
        }
        return '';
    }

    private getRequiredMessage(fieldName: string): string {
        const displayName = this.getFieldDisplayName(fieldName);
        return `${displayName} là bắt buộc`;
    }

    private getFieldDisplayName(fieldName: string): string {
        const names: { [key: string]: string } = {
            'name': 'Tên đối tác',
            'code': 'Mã đối tác',
            'phone': 'Số điện thoại',
            'address': 'Địa chỉ',
            'description': 'Mô tả'
        };
        return names[fieldName] || fieldName;
    }

    private getPatternMessage(fieldName: string): string {
        if (fieldName === 'code') {
            return 'Mã đối tác chỉ được chứa chữ cái in hoa và số, từ 3-10 ký tự';
        }
        if (fieldName === 'phone') {
            return 'Số điện thoại không hợp lệ (định dạng: 0XXXXXXXXX)';
        }
        return 'Định dạng không hợp lệ';
    }

    onFileSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
            if (!allowedTypes.includes(file.type)) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Chỉ chấp nhận file PNG, JPG, JPEG, SVG'
                });
                this.clearFile();
                return;
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Kích thước file không được vượt quá 5MB'
                });
                this.clearFile();
                return;
            }

            this.selectedFile = file;
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewAvatar = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onFileRemove(): void {
        this.clearFile();
    }

    private clearFile(): void {
        this.selectedFile = null;
        this.previewAvatar = null;
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    onSubmit(): void {
        if (this.partnerForm.valid) {
            this.isSubmitting = true;

            const formData = this.partnerForm.value;
            
            // Check if partner code already exists
            this.partnerService.checkPartnerCodeExists(formData.code).subscribe(exists => {
                if (exists) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Mã đối tác đã tồn tại'
                    });
                    this.isSubmitting = false;
                    return;
                }

                // Create new partner
                const newPartner: Omit<Partner, 'id'> = {
                    code: formData.code.toUpperCase(),
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim(),
                    customerCount: 0,
                    email: '', // Can be added later
                    createdDate: new Date(),
                    status: 'active',
                    avatar: this.previewAvatar || undefined
                };

                this.partnerService.addPartner(newPartner).subscribe({
                    next: (success) => {
                        if (success) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Đã thêm đối tác mới thành công'
                            });
                            this.closeDialog();
                            this.partnerAdded.emit();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Lỗi',
                                detail: 'Không thể thêm đối tác'
                            });
                        }
                        this.isSubmitting = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Lỗi',
                            detail: 'Đã xảy ra lỗi khi thêm đối tác'
                        });
                        this.isSubmitting = false;
                    }
                });
            });
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.formControls).forEach(key => {
                this.formControls[key].markAsTouched();
            });
            
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }
    }

    closeDialog(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.resetForm();
    }

    private resetForm(): void {
        this.partnerForm.reset();
        this.clearFile();
        this.isSubmitting = false;
        
        // Reset form validation state
        Object.keys(this.formControls).forEach(key => {
            this.formControls[key].markAsUntouched();
            this.formControls[key].markAsPristine();
        });
    }

    onDialogHide(): void {
        this.resetForm();
    }
}
