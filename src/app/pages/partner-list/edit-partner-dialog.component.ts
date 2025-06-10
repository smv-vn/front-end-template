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
  ],  providers: [MessageService],
  templateUrl: './edit-partner-dialog.component.html',
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
