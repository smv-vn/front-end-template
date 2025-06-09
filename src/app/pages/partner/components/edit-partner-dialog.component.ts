import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { PartnerService } from '../services/partner.service';
import { Partner, UpdatePartnerRequest } from '../models/partner.model';

@Component({
    selector: 'app-edit-partner-dialog',
    templateUrl: './edit-partner-dialog.component.html',
    styleUrls: ['./edit-partner-dialog.component.scss']
})
export class EditPartnerDialogComponent implements OnInit, OnDestroy {
    partnerForm: FormGroup;
    loading = false;
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    maxFileSize = 5 * 1024 * 1024; // 5MB
    allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
    partner: Partner;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private partnerService: PartnerService,
        private messageService: MessageService,
        private dialogRef: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        this.partner = this.config.data.partner;
        this.partnerForm = this.createForm();
    }

    ngOnInit() {
        this.initializeForm();
        this.setupFormValidation();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private createForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]+$/)]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
            address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
            description: ['', [Validators.maxLength(500)]]
        });
    }

    private initializeForm() {
        this.partnerForm.patchValue({
            name: this.partner.name,
            code: this.partner.code,
            phone: this.partner.phone,
            address: this.partner.address,
            description: this.partner.description || ''
        });

        if (this.partner.avatar) {
            this.imagePreview = this.partner.avatar;
        }
    }

    private setupFormValidation() {
        // Custom async validator for partner code uniqueness (excluding current partner)
        this.partnerForm.get('code')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(code => {
            if (code && code.length >= 2 && code !== this.partner.code) {
                this.checkCodeExists(code);
            }
        });
    }

    private checkCodeExists(code: string) {
        this.partnerService.checkCodeExists(code, this.partner.id).subscribe(exists => {
            if (exists) {
                this.partnerForm.get('code')?.setErrors({ codeExists: true });
            }
        });
    }

    onFileSelect(event: any) {
        const file = event.files[0];
        if (!file) return;

        // Validate file type
        if (!this.allowedFileTypes.includes(file.type)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Chỉ chấp nhận file PNG, JPG, JPEG, SVG'
            });
            return;
        }

        // Validate file size
        if (file.size > this.maxFileSize) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Kích thước file không được vượt quá 5MB'
            });
            return;
        }

        this.selectedFile = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    onFileRemove() {
        this.selectedFile = null;
        this.imagePreview = null;
    }

    getFieldError(fieldName: string): string {
        const field = this.partnerForm.get(fieldName);
        if (field?.errors && field.touched) {
            const errors = field.errors;

            if (errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc`;
            if (errors['minlength']) return `${this.getFieldLabel(fieldName)} phải có ít nhất ${errors['minlength'].requiredLength} ký tự`;
            if (errors['maxlength']) return `${this.getFieldLabel(fieldName)} không được vượt quá ${errors['maxlength'].requiredLength} ký tự`;
            if (errors['pattern']) {
                if (fieldName === 'code') return 'Mã đối tác chỉ được chứa chữ cái viết hoa và số';
                if (fieldName === 'phone') return 'Số điện thoại phải có 10-11 chữ số';
            }
            if (errors['codeExists']) return 'Mã đối tác đã tồn tại';
        }
        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            name: 'Tên đối tác',
            code: 'Mã đối tác',
            phone: 'Số điện thoại',
            address: 'Địa chỉ',
            description: 'Mô tả'
        };
        return labels[fieldName] || fieldName;
    }

    hasFieldError(fieldName: string): boolean {
        const field = this.partnerForm.get(fieldName);
        return !!(field?.errors && field.touched);
    }

    onSubmit() {
        if (this.partnerForm.invalid) {
            // Mark all fields as touched to show validation errors
            Object.keys(this.partnerForm.controls).forEach(key => {
                this.partnerForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.loading = true;

        const formValue = this.partnerForm.value;
        const request: UpdatePartnerRequest = {
            id: this.partner.id,
            name: formValue.name.trim(),
            code: formValue.code.trim().toUpperCase(),
            phone: formValue.phone.trim(),
            address: formValue.address.trim(),
            description: formValue.description?.trim(),
            avatar: this.imagePreview || undefined
        };

        this.partnerService.updatePartner(request)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (partner) => {
                    this.loading = false;
                    this.dialogRef.close(partner);
                },
                error: (error) => {
                    console.error('Error updating partner:', error);
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Có lỗi xảy ra khi cập nhật đối tác'
                    });
                }
            });
    }

    onCancel() {
        this.dialogRef.close();
    }
}
