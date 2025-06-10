import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';

import { DemoRecord, StatusOption } from '../../../models/demo.model';
import { DemoService } from '../../../services/demo.service';

@Component({
    selector: 'app-demo-component',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        TagModule,
        ToastModule,
        MenuModule,
        DialogModule,
        InputTextareaModule,
        CalendarModule
    ],
    providers: [MessageService],
    templateUrl: './demo-component.component.html',
    styleUrl: './demo-component.component.css'
})
export class DemoComponentComponent implements OnInit {

    records: DemoRecord[] = [];
    filteredRecords: DemoRecord[] = [];
    searchText = '';
    selectedStatus: StatusOption | null = null;
    
    // Dialog states
    showAddDialog = false;
    showEditDialog = false;
    showDeleteDialog = false;
    selectedRecordForEdit: DemoRecord | null = null;
    selectedRecordForDelete: DemoRecord | null = null;
    isDeleting = false;
    isSubmitting = false;
    
    // Forms
    addForm!: FormGroup;
    editForm!: FormGroup;

    // Menu items
    menuItems: MenuItem[] = [];

    statusOptions: StatusOption[] = [
        { label: 'Tất cả', value: '' },
        { label: 'Đã ký', value: 'Đã ký' },
        { label: 'Đã trình ký', value: 'Đã trình ký' },
        { label: 'Bị từ chối', value: 'Bị từ chối' },
        { label: 'Chưa trình ký', value: 'Chưa trình ký' },
        { label: 'Đã đóng', value: 'Đã đóng' },
    ];    constructor(
        private demoService: DemoService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        this.initializeMenuItems();
        this.initializeForms();
    }    ngOnInit(): void {
        this.loadRecords();
    }

    private initializeForms(): void {
        this.addForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(3)]],
            unit: ['', [Validators.required]],
            staffCount: [null, [Validators.required, Validators.min(1)]],
            startTime: [null, [Validators.required]],
            endTime: [null, [Validators.required]],
            status: ['', [Validators.required]],
            description: ['']
        });

        this.editForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(3)]],
            unit: ['', [Validators.required]],
            staffCount: [null, [Validators.required, Validators.min(1)]],
            startTime: [null, [Validators.required]],
            endTime: [null, [Validators.required]],
            status: ['', [Validators.required]],
            description: ['']
        });
    }

    private initializeMenuItems(): void {
        this.menuItems = [
            {
                label: 'Sửa',
                icon: 'pi pi-pencil',
                command: () => this.editRecord()
            },
            {
                label: 'Xóa',
                icon: 'pi pi-trash',
                command: () => this.confirmDelete()
            }
        ];
    }

    loadRecords(): void {
        this.demoService.getRecords().subscribe(records => {
            this.records = records;
            this.applyFilters();
        });
    }

    onSearch(): void {
        this.applyFilters();
    }

    clearSearch(): void {
        this.searchText = '';
        this.selectedStatus = null;
        this.applyFilters();
    }

    private applyFilters(): void {
        const searchTerm = this.searchText.trim();
        const statusValue = this.selectedStatus?.value || '';
        
        this.demoService.searchRecords(searchTerm, statusValue).subscribe(filteredRecords => {
            this.filteredRecords = filteredRecords;
        });
    }    // Dialog actions
    openAddDialog(): void {
        this.addForm.reset();
        this.showAddDialog = true;
    }

    editRecord(): void {
        if (this.selectedRecordForEdit) {
            this.populateEditForm(this.selectedRecordForEdit);
            this.showEditDialog = true;
        }
    }    private populateEditForm(record: DemoRecord): void {
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

        this.editForm.patchValue({
            code: record.code,
            unit: record.unit,
            staffCount: record.staffCount,
            startTime: parseDateTime(record.startTime),
            endTime: parseDateTime(record.endTime),
            status: record.status,
            description: record.description
        });
    }

    confirmDelete(): void {
        if (this.selectedRecordForEdit) {
            this.selectedRecordForDelete = this.selectedRecordForEdit;
            this.showDeleteDialog = true;
        }
    }    // Form submission methods
    onAddSubmit(): void {
        if (this.addForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const formValue = this.addForm.value;
            
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
            
            const newRecord: Omit<DemoRecord, 'id'> = {
                code: formValue.code,
                unit: formValue.unit,
                staffCount: formValue.staffCount,
                startTime: formatDateTime(formValue.startTime),
                endTime: formatDateTime(formValue.endTime),
                status: formValue.status,
                description: formValue.description
            };

            this.demoService.addRecord(newRecord).subscribe(success => {
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã thêm biên bản mới'
                    });
                    this.loadRecords();
                    this.showAddDialog = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể thêm biên bản'
                    });
                }
                this.isSubmitting = false;
            });
        }
    }    onEditSubmit(): void {
        if (this.editForm.valid && !this.isSubmitting && this.selectedRecordForEdit) {
            this.isSubmitting = true;
            const formValue = this.editForm.value;
            
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
                ...this.selectedRecordForEdit,
                code: formValue.code,
                unit: formValue.unit,
                staffCount: formValue.staffCount,
                startTime: formatDateTime(formValue.startTime),
                endTime: formatDateTime(formValue.endTime),
                status: formValue.status,
                description: formValue.description
            };

            this.demoService.updateRecord(updatedRecord).subscribe(success => {
                if (success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đã cập nhật biên bản'
                    });
                    this.loadRecords();
                    this.showEditDialog = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể cập nhật biên bản'
                    });
                }
                this.isSubmitting = false;
            });
        }
    }onRecordAdded(): void {
        // This method is now replaced by onAddSubmit
        this.loadRecords();
    }

    onRecordUpdated(): void {
        // This method is now replaced by onEditSubmit  
        this.loadRecords();
    }

    onDeleteConfirmed(): void {
        if (!this.selectedRecordForDelete) return;
        
        this.isDeleting = true;
        const record = this.selectedRecordForDelete;
        
        this.demoService.deleteRecord(record.id!).subscribe(success => {
            if (success) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: `Đã xóa biên bản: ${record.code}`
                });
                this.loadRecords();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể xóa biên bản'
                });
            }
            this.isDeleting = false;
            this.showDeleteDialog = false;
            this.selectedRecordForDelete = null;
        });
    }

    onDeleteCancelled(): void {
        this.showDeleteDialog = false;
        this.selectedRecordForDelete = null;
        this.isDeleting = false;
    }

    onMenuShow(record: DemoRecord): void {
        this.selectedRecordForEdit = record;
        
        // Update menu items based on record status
        this.menuItems = [
            {
                label: 'Sửa',
                icon: 'pi pi-pencil',
                command: () => this.editRecord(),
                disabled: record.status === 'Đã đóng'
            },
            {
                label: 'Xóa',
                icon: 'pi pi-trash',
                command: () => this.confirmDelete(),
                disabled: record.status === 'Đã ký' || record.status === 'Đã đóng'
            }
        ];
    }

    viewRecordDetail(record: DemoRecord): void {
        // Implement view detail functionality
        this.messageService.add({
            severity: 'info',
            summary: 'Thông tin',
            detail: `Xem chi tiết biên bản: ${record.code}`
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Đã ký':
                return 'p-tag-success';
            case 'Đã trình ký':
                return 'p-tag-info';
            case 'Bị từ chối':
                return 'p-tag-danger';
            case 'Chưa trình ký':
                return 'p-tag-warning';
            case 'Đã đóng':
                return 'p-tag-secondary';
            default:
                return '';
        }
    }

}
