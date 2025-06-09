import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Partner } from '../models/partner.model';
import { PartnerService } from '../services/partner.service';
import { AddPartnerDialogComponent } from './add-partner-dialog.component';
import { EditPartnerDialogComponent } from './edit-partner-dialog.component';

@Component({
    selector: 'app-partner-list',
    templateUrl: './partner-list.component.html',
    styleUrls: ['./partner-list.component.scss'],
    providers: [ConfirmationService, MessageService, DialogService]
})
export class PartnerListComponent implements OnInit, OnDestroy {
    partners: Partner[] = [];
    loading = false;
    searchTerm = '';
    totalRecords = 0;

    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    private dialogRef: DynamicDialogRef | undefined;

    constructor(
        private partnerService: PartnerService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private router: Router
    ) {
        // Setup search with debounce
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(searchTerm => {
            this.performSearch(searchTerm);
        });
    }

    ngOnInit() {
        this.loadPartners();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    loadPartners() {
        this.loading = true;
        this.partnerService.getPartners()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (partners) => {
                    this.partners = partners;
                    this.totalRecords = partners.length;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading partners:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể tải danh sách đối tác'
                    });
                    this.loading = false;
                }
            });
    }

    onSearchChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value;
        this.searchSubject.next(this.searchTerm);
    }

    performSearch(searchTerm: string) {
        this.loading = true;
        this.partnerService.searchPartners(searchTerm)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (partners) => {
                    this.partners = partners;
                    this.totalRecords = partners.length;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error searching partners:', error);
                    this.loading = false;
                }
            });
    }

    clearSearch() {
        this.searchTerm = '';
        this.loadPartners();
    }

    openAddDialog() {
        this.dialogRef = this.dialogService.open(AddPartnerDialogComponent, {
            header: 'Thêm mới đối tác',
            width: '500px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false
        });

        this.dialogRef.onClose.subscribe((result) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm đối tác thành công'
                });
                this.loadPartners();
            }
        });
    }

    openEditDialog(partner: Partner) {
        this.dialogRef = this.dialogService.open(EditPartnerDialogComponent, {
            header: 'Cập nhật đối tác',
            width: '500px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false,
            data: { partner }
        });

        this.dialogRef.onClose.subscribe((result) => {
            if (result) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật đối tác thành công'
                });
                this.loadPartners();
            }
        });
    }

    viewPartnerDetail(partner: Partner) {
        // Navigate to partner detail page or open detail dialog
        this.messageService.add({
            severity: 'info',
            summary: 'Xem chi tiết',
            detail: `Xem chi tiết đối tác: ${partner.name}`
        });
    }

    confirmDelete(partner: Partner) {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa đối tác "${partner.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deletePartner(partner);
            }
        });
    }

    deletePartner(partner: Partner) {
        this.partnerService.deletePartner(partner.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Xóa đối tác thành công'
                        });
                        this.loadPartners();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Lỗi',
                            detail: 'Không thể xóa đối tác'
                        });
                    }
                },
                error: (error) => {
                    console.error('Error deleting partner:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Có lỗi xảy ra khi xóa đối tác'
                    });
                }
            });
    }

    getDefaultAvatar(): string {
        return 'assets/demo/images/avatar/circle-image.png';
    }

    getMenuItems(partner: Partner) {
        return [
            {
                label: 'Xem chi tiết',
                icon: 'pi pi-eye',
                command: () => this.viewPartnerDetail(partner)
            },
            {
                label: 'Chỉnh sửa',
                icon: 'pi pi-pencil',
                command: () => this.openEditDialog(partner)
            }
        ];
    }

}
