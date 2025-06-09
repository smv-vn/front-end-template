import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

export class AppModule { }

@Component({
    selector: 'app-demo-component',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        TagModule
    ],
    templateUrl: './demo-component.component.html',
    styleUrl: './demo-component.component.css'
})
export class DemoComponentComponent {

    searchText = '';
    selectedStatus: any = null;

    statusOptions = [
        { label: 'Đã ký', value: 'Đã ký' },
        { label: 'Đã trình ký', value: 'Đã trình ký' },
        { label: 'Bị từ chối', value: 'Bị từ chối' },
        { label: 'Chưa trình ký', value: 'Chưa trình ký' },
        { label: 'Đã đóng', value: 'Đã đóng' },
    ];

    records = [
        {
            code: 'SMV123456',
            unit: 'Smart Việt',
            staffCount: '02',
            startTime: '30/08/2024 - 09:00:00',
            endTime: '30/08/2024 - 17:00:00',
            status: 'Đã ký',
        },
        {
            code: 'SMV123456',
            unit: 'Smart Việt',
            staffCount: '02',
            startTime: '30/08/2024 - 09:00:00',
            endTime: '30/08/2024 - 17:00:00',
            status: 'Đã trình ký',
        },
        {
            code: 'SMV123456',
            unit: 'Smart Việt',
            staffCount: '02',
            startTime: '30/08/2024 - 09:00:00',
            endTime: '30/08/2024 - 17:00:00',
            status: 'Bị từ chối',
        },
        {
            code: 'SMV123456',
            unit: 'Smart Việt',
            staffCount: '02',
            startTime: '30/08/2024 - 09:00:00',
            endTime: '30/08/2024 - 17:00:00',
            status: 'Chưa trình ký',
        },
        {
            code: 'SMV123456',
            unit: 'Smart Việt',
            staffCount: '02',
            startTime: '30/08/2024 - 09:00:00',
            endTime: '30/08/2024 - 17:00:00',
            status: 'Đã đóng',
        },
    ];

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
