import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DemoRecord } from '../models/demo.model';

@Injectable({
    providedIn: 'root'
})
export class DemoService {
    private records: DemoRecord[] = [
        {
            id: '1',
            code: 'SMV123456',
            unit: 'Smart Việt',
            staffCount: '02',
            startTime: '30/08/2024 - 09:00:00',
            endTime: '30/08/2024 - 17:00:00',
            status: 'Đã ký',
            description: 'Biên bản làm việc với Smart Việt'
        },
        {
            id: '2',
            code: 'SMV123457',
            unit: 'Smart Việt',
            staffCount: '03',
            startTime: '31/08/2024 - 10:00:00',
            endTime: '31/08/2024 - 18:00:00',
            status: 'Đã trình ký',
            description: 'Biên bản họp phòng ban'
        },
        {
            id: '3',
            code: 'SMV123458',
            unit: 'Smart Việt',
            staffCount: '05',
            startTime: '01/09/2024 - 08:30:00',
            endTime: '01/09/2024 - 16:30:00',
            status: 'Bị từ chối',
            description: 'Biên bản kiểm tra chất lượng'
        },
        {
            id: '4',
            code: 'SMV123459',
            unit: 'Smart Việt',
            staffCount: '04',
            startTime: '02/09/2024 - 14:00:00',
            endTime: '02/09/2024 - 22:00:00',
            status: 'Chưa trình ký',
            description: 'Biên bản đào tạo nhân viên'
        },
        {
            id: '5',
            code: 'SMV123460',
            unit: 'Smart Việt',
            staffCount: '01',
            startTime: '03/09/2024 - 09:15:00',
            endTime: '03/09/2024 - 17:15:00',
            status: 'Đã đóng',
            description: 'Biên bản bảo trì hệ thống'
        }
    ];

    constructor() { }

    // Get all records
    getRecords(): Observable<DemoRecord[]> {
        return of([...this.records]).pipe(delay(500));
    }

    // Get record by ID
    getRecordById(id: string): Observable<DemoRecord | null> {
        const record = this.records.find(r => r.id === id) || null;
        return of(record).pipe(delay(300));
    }

    // Add new record
    addRecord(record: DemoRecord): Observable<boolean> {
        try {
            const newRecord = {
                ...record,
                id: record.id || Date.now().toString()
            };
            this.records.unshift(newRecord);
            return of(true).pipe(delay(1000));
        } catch (error) {
            return of(false).pipe(delay(1000));
        }
    }

    // Update record
    updateRecord(record: DemoRecord): Observable<boolean> {
        try {
            const index = this.records.findIndex(r => r.id === record.id);
            if (index !== -1) {
                this.records[index] = { ...record };
                return of(true).pipe(delay(1000));
            }
            return of(false).pipe(delay(1000));
        } catch (error) {
            return of(false).pipe(delay(1000));
        }
    }

    // Delete record
    deleteRecord(id: string): Observable<boolean> {
        try {
            const index = this.records.findIndex(r => r.id === id);
            if (index !== -1) {
                this.records.splice(index, 1);
                return of(true).pipe(delay(1000));
            }
            return of(false).pipe(delay(1000));
        } catch (error) {
            return of(false).pipe(delay(1000));
        }
    }

    // Search records
    searchRecords(searchTerm: string, status?: string): Observable<DemoRecord[]> {
        let filteredRecords = [...this.records];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredRecords = filteredRecords.filter(record => 
                record.code.toLowerCase().includes(term) ||
                record.unit.toLowerCase().includes(term) ||
                record.staffCount.includes(term)
            );
        }

        if (status) {
            filteredRecords = filteredRecords.filter(record => record.status === status);
        }

        return of(filteredRecords).pipe(delay(500));
    }
}