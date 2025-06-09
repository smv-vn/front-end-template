import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';

import { Partner } from '../../models/partner.model';
import { PartnerService } from '../../services/partner.service';
import { AddPartnerDialogComponent } from './add-partner-dialog.component';
import { EditPartnerDialogComponent } from './edit-partner-dialog.component';
import { DeletePartnerDialogComponent } from './delete-partner-dialog.component';

@Component({
    selector: 'app-partner-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        MenuModule,
        AvatarModule,
        TagModule,
        TooltipModule,
        ToastModule,
        AddPartnerDialogComponent,
        EditPartnerDialogComponent,
        DeletePartnerDialogComponent
    ],
    providers: [MessageService],
    templateUrl: './partner-list.component.html',
    styleUrl: './partner-list.component.css'
})
export class PartnerListComponent implements OnInit {

    partners: Partner[] = [];
    filteredPartners: Partner[] = [];
    
    // Search filters
    searchCode = '';
    searchName = '';
    searchPhone = '';    // Dialog visibility
    showAddDialog = false;
    showEditDialog = false;
    showDeleteDialog = false;
    selectedPartnerForEdit: Partner | null = null;
    selectedPartnerForDelete: Partner | null = null;
    isDeleting = false;
    
    // Menu items for actions
    menuItems: MenuItem[] = [
        {
            label: 'Sửa',
            icon: 'pi pi-pencil',
            command: () => this.editPartner()
        },
        {
            label: 'Xóa',
            icon: 'pi pi-trash',
            command: () => this.confirmDelete()
        }
    ];
    
    selectedPartner: Partner | null = null;    constructor(
        private partnerService: PartnerService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadPartners();
    }

    loadPartners(): void {
        this.partnerService.getPartners().subscribe(partners => {
            this.partners = partners;
            this.filteredPartners = [...partners];
        });
    }

    onSearch(): void {
        const filters = {
            code: this.searchCode.trim(),
            name: this.searchName.trim(),
            phone: this.searchPhone.trim()
        };

        // If all filters are empty, show all partners
        if (!filters.code && !filters.name && !filters.phone) {
            this.filteredPartners = [...this.partners];
            return;
        }

        this.partnerService.searchPartners(filters).subscribe(partners => {
            this.filteredPartners = partners;
        });
    }

    clearSearch(): void {
        this.searchCode = '';
        this.searchName = '';
        this.searchPhone = '';
        this.filteredPartners = [...this.partners];
    }

    viewPartnerDetail(partner: Partner): void {
        // Navigate to partner detail page
        console.log('View partner detail:', partner);
        this.messageService.add({
            severity: 'info',
            summary: 'Thông báo',
            detail: `Xem chi tiết đối tác: ${partner.name}`
        });
    }    editPartner(): void {
        if (this.selectedPartner) {
            this.selectedPartnerForEdit = this.selectedPartner;
            this.showEditDialog = true;
        }
    }    confirmDelete(): void {
        if (this.selectedPartner) {
            this.selectedPartnerForDelete = this.selectedPartner;
            this.showDeleteDialog = true;
        }
    }    onDeleteConfirmed(): void {
        if (!this.selectedPartnerForDelete) return;
        
        this.isDeleting = true;
        const partner = this.selectedPartnerForDelete;
        
        this.partnerService.deletePartner(partner.id).subscribe(success => {
            if (success) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: `Đã xóa đối tác: ${partner.name}`
                });
                this.loadPartners();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể xóa đối tác'
                });
            }
            this.isDeleting = false;
            this.showDeleteDialog = false;
            this.selectedPartnerForDelete = null;
        });
    }    onDeleteCancelled(): void {
        this.showDeleteDialog = false;
        this.selectedPartnerForDelete = null;
        this.isDeleting = false;
    }

    onMenuShow(partner: Partner): void {
        this.selectedPartner = partner;
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'danger';
            default:
                return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'active':
                return 'Hoạt động';
            case 'inactive':
                return 'Ngừng hoạt động';
            default:
                return status;
        }
    }

    formatPhoneNumber(phone: string): string {
        // Format phone number: 0901234567 -> 090 123 4567
        if (phone.length === 10) {
            return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
        }
        return phone;
    }

    openAddDialog(): void {
        this.showAddDialog = true;
    }    onPartnerAdded(): void {
        this.showAddDialog = false;
        this.loadPartners(); // Refresh the list
    }

    onPartnerUpdated(): void {
        this.showEditDialog = false;
        this.selectedPartnerForEdit = null;
        this.loadPartners(); // Refresh the list
    }
}
