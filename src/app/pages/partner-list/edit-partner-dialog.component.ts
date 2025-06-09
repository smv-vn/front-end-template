import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { Partner } from '../../models/partner.model';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'app-edit-partner-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule,
    AvatarModule,
    DividerModule
  ],
  providers: [MessageService],
  template: `
    <p-dialog 
      [(visible)]="display" 
      header="Sửa thông tin đối tác" 
      [modal]="true" 
      [style]="{width: '600px'}"
      [closable]="true"
      (onHide)="onCancel()">
      
      <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <!-- Mã đối tác -->
          <div class="form-field">
            <label for="code">Mã đối tác *</label>
            <input 
              type="text" 
              id="code"
              pInputText 
              formControlName="code"
              placeholder="Nhập mã đối tác"
              [class.ng-invalid]="editForm.get('code')?.invalid && editForm.get('code')?.touched"
            />
            <small 
              class="error-message" 
              *ngIf="editForm.get('code')?.invalid && editForm.get('code')?.touched">
              <span *ngIf="editForm.get('code')?.errors?.['required']">Mã đối tác là bắt buộc</span>
              <span *ngIf="editForm.get('code')?.errors?.['minlength']">Mã đối tác phải có ít nhất 3 ký tự</span>
              <span *ngIf="editForm.get('code')?.errors?.['pattern']">Mã đối tác chỉ được chứa chữ cái, số và dấu gạch ngang</span>
              <span *ngIf="editForm.get('code')?.errors?.['codeExists']">Mã đối tác đã tồn tại</span>
            </small>
          </div>

          <!-- Tên đối tác -->
          <div class="form-field">
            <label for="name">Tên đối tác *</label>
            <input 
              type="text" 
              id="name"
              pInputText 
              formControlName="name"
              placeholder="Nhập tên đối tác"
              [class.ng-invalid]="editForm.get('name')?.invalid && editForm.get('name')?.touched"
            />
            <small 
              class="error-message" 
              *ngIf="editForm.get('name')?.invalid && editForm.get('name')?.touched">
              <span *ngIf="editForm.get('name')?.errors?.['required']">Tên đối tác là bắt buộc</span>
              <span *ngIf="editForm.get('name')?.errors?.['minlength']">Tên đối tác phải có ít nhất 2 ký tự</span>
            </small>
          </div>

          <!-- Email -->
          <div class="form-field">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email"
              pInputText 
              formControlName="email"
              placeholder="Nhập email"
              [class.ng-invalid]="editForm.get('email')?.invalid && editForm.get('email')?.touched"
            />
            <small 
              class="error-message" 
              *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched">
              <span *ngIf="editForm.get('email')?.errors?.['required']">Email là bắt buộc</span>
              <span *ngIf="editForm.get('email')?.errors?.['email']">Định dạng email không hợp lệ</span>
            </small>
          </div>

          <!-- Số điện thoại -->
          <div class="form-field">
            <label for="phone">Số điện thoại *</label>
            <input 
              type="tel" 
              id="phone"
              pInputText 
              formControlName="phone"
              placeholder="Nhập số điện thoại"
              [class.ng-invalid]="editForm.get('phone')?.invalid && editForm.get('phone')?.touched"
            />
            <small 
              class="error-message" 
              *ngIf="editForm.get('phone')?.invalid && editForm.get('phone')?.touched">
              <span *ngIf="editForm.get('phone')?.errors?.['required']">Số điện thoại là bắt buộc</span>
              <span *ngIf="editForm.get('phone')?.errors?.['pattern']">Số điện thoại không hợp lệ (10-11 số)</span>
            </small>
          </div>

          <!-- Địa chỉ -->
          <div class="form-field full-width">
            <label for="address">Địa chỉ *</label>
            <input 
              type="text" 
              id="address"
              pInputText 
              formControlName="address"
              placeholder="Nhập địa chỉ"
              [class.ng-invalid]="editForm.get('address')?.invalid && editForm.get('address')?.touched"
            />
            <small 
              class="error-message" 
              *ngIf="editForm.get('address')?.invalid && editForm.get('address')?.touched">
              <span *ngIf="editForm.get('address')?.errors?.['required']">Địa chỉ là bắt buộc</span>
            </small>
          </div>

          <!-- Mô tả -->
          <div class="form-field full-width">
            <label for="description">Mô tả</label>
            <textarea 
              id="description"
              pInputTextarea 
              formControlName="description"
              placeholder="Nhập mô tả về đối tác"
              rows="3">
            </textarea>
          </div>

          <p-divider></p-divider>

          <!-- Avatar -->
          <div class="form-field full-width">
            <label>Avatar</label>
            <div class="avatar-section">
              <div class="current-avatar">
                <label class="avatar-label">Avatar hiện tại:</label>
                <p-avatar 
                  [image]="currentAvatar" 
                  size="large" 
                  shape="circle"
                  *ngIf="currentAvatar">
                </p-avatar>
                <p-avatar 
                  icon="pi pi-user" 
                  size="large" 
                  shape="circle"
                  *ngIf="!currentAvatar">
                </p-avatar>
              </div>
              
              <div class="new-avatar" *ngIf="previewAvatar">
                <label class="avatar-label">Avatar mới:</label>
                <p-avatar 
                  [image]="previewAvatar" 
                  size="large" 
                  shape="circle">
                </p-avatar>
              </div>
            </div>
            
            <p-fileUpload 
              mode="basic" 
              name="avatar"
              accept="image/png,image/jpg,image/jpeg,image/svg+xml"
              [maxFileSize]="5000000"
              chooseLabel="Chọn ảnh mới"
              [auto]="false"
              (onSelect)="onFileSelect($event)"
              (onClear)="onFileClear()"
              [showUploadButton]="false"
              [showCancelButton]="false">
            </p-fileUpload>
            <small class="file-info">Định dạng: PNG, JPG, JPEG, SVG. Kích thước tối đa: 5MB</small>
            
            <button 
              type="button" 
              pButton 
              label="Xóa ảnh mới" 
              class="p-button-text p-button-sm clear-image-btn"
              (click)="clearNewImage()"
              *ngIf="previewAvatar">
            </button>
          </div>
        </div>

        <div class="dialog-footer">
          <p-button 
            label="Hủy" 
            icon="pi pi-times" 
            styleClass="p-button-text" 
            (onClick)="onCancel()">
          </p-button>
          <p-button 
            label="Lưu thay đổi" 
            icon="pi pi-check" 
            type="submit"
            [loading]="isLoading"
            [disabled]="editForm.invalid">
          </p-button>
        </div>
      </form>

      <p-toast></p-toast>
    </p-dialog>
  `,
  styleUrls: ['./edit-partner-dialog.component.css']
})
export class EditPartnerDialogComponent implements OnInit, OnChanges {
  @Input() display: boolean = false;
  @Input() partner: Partner | null = null;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() partnerUpdated = new EventEmitter<Partner>();

  editForm: FormGroup;
  isLoading = false;
  previewAvatar: string | null = null;
  currentAvatar: string | null = null;
  selectedFile: File | null = null;
  originalPartnerCode: string = '';

  constructor(
    private fb: FormBuilder,
    private partnerService: PartnerService,
    private messageService: MessageService
  ) {
    this.editForm = this.createForm();
  }

  ngOnInit() {
    if (this.partner) {
      this.loadPartnerData();
    }
  }

  ngOnChanges() {
    if (this.partner && this.display) {
      this.loadPartnerData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      code: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9-]+$/)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10,11}$/)
      ]],
      address: ['', Validators.required],
      description: ['']
    });
  }

  private loadPartnerData() {
    if (!this.partner) return;

    this.originalPartnerCode = this.partner.code;
    this.currentAvatar = this.partner.avatar || null;
    this.previewAvatar = null;
    this.selectedFile = null;

    this.editForm.patchValue({
      code: this.partner.code,
      name: this.partner.name,
      email: this.partner.email,
      phone: this.partner.phone,
      address: this.partner.address,
      description: this.partner.description || ''
    });

    // Add async validator for code if it's changed
    this.editForm.get('code')?.clearAsyncValidators();
    this.editForm.get('code')?.setAsyncValidators([this.codeExistsValidator.bind(this)]);
    this.editForm.get('code')?.updateValueAndValidity();
  }

  private async codeExistsValidator(control: any) {
    if (!control.value || control.value === this.originalPartnerCode) {
      return null;
    }

    const exists = await this.partnerService.checkPartnerCodeExists(control.value);
    return exists ? { codeExists: true } : null;
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewAvatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileClear() {
    this.selectedFile = null;
    this.previewAvatar = null;
  }

  clearNewImage() {
    this.selectedFile = null;
    this.previewAvatar = null;
  }

  async onSubmit() {
    if (this.editForm.valid && this.partner) {
      this.isLoading = true;

      try {
        const formValue = this.editForm.value;
        
        // Create updated partner object
        const updatedPartner: Partner = {
          ...this.partner,
          code: formValue.code,
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          address: formValue.address,
          description: formValue.description,
          avatar: this.previewAvatar || this.currentAvatar || undefined
        };        const result = await this.partnerService.updatePartner(this.partner.id, updatedPartner).toPromise();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật đối tác thành công!'
        });

        this.partnerUpdated.emit(updatedPartner);
        this.onCancel();
        
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Có lỗi xảy ra khi cập nhật đối tác'
        });
        console.error('Error updating partner:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(false);
    this.editForm.reset();
    this.previewAvatar = null;
    this.currentAvatar = null;
    this.selectedFile = null;
    this.originalPartnerCode = '';
  }
}
