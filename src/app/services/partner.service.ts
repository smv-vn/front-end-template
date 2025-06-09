import { Injectable } from '@angular/core';
import { Partner } from '../models/partner.model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PartnerService {

    private mockPartners: Partner[] = [
        {
            id: '1',
            code: 'PTN001',
            name: 'Công ty TNHH ABC',
            avatar: 'https://i.pravatar.cc/40?img=1',
            customerCount: 120,
            phone: '0901234567',
            address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
            email: 'contact@abc.com',
            createdDate: new Date('2024-01-15'),
            status: 'active'
        },
        {
            id: '2',
            code: 'PTN002',
            name: 'Công ty Cổ phần XYZ',
            avatar: 'https://i.pravatar.cc/40?img=2',
            customerCount: 85,
            phone: '0987654321',
            address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
            email: 'info@xyz.com',
            createdDate: new Date('2024-02-10'),
            status: 'active'
        },
        {
            id: '3',
            code: 'PTN003',
            name: 'Doanh nghiệp DEF',
            avatar: 'https://i.pravatar.cc/40?img=3',
            customerCount: 200,
            phone: '0912345678',
            address: '789 Đường Hai Bà Trưng, Quận 1, TP.HCM',
            email: 'hello@def.com',
            createdDate: new Date('2024-03-05'),
            status: 'active'
        },
        {
            id: '4',
            code: 'PTN004',
            name: 'Công ty TNHH GHI',
            avatar: 'https://i.pravatar.cc/40?img=4',
            customerCount: 50,
            phone: '0934567890',
            address: '321 Đường Lý Tự Trọng, Quận 1, TP.HCM',
            email: 'support@ghi.com',
            createdDate: new Date('2024-04-12'),
            status: 'inactive'
        },
        {
            id: '5',
            code: 'PTN005',
            name: 'Tập đoàn JKL',
            avatar: 'https://i.pravatar.cc/40?img=5',
            customerCount: 300,
            phone: '0945678901',
            address: '654 Đường Võ Văn Tần, Quận 3, TP.HCM',
            email: 'contact@jkl.com',
            createdDate: new Date('2024-05-20'),
            status: 'active'
        },
        {
            id: '6',
            code: 'PTN006',
            name: 'Công ty MNO',
            avatar: 'https://i.pravatar.cc/40?img=6',
            customerCount: 75,
            phone: '0956789012',
            address: '987 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
            email: 'info@mno.com',
            createdDate: new Date('2024-06-01'),
            status: 'active'
        }
    ];

    getPartners(): Observable<Partner[]> {
        return of(this.mockPartners);
    }

    getPartnerById(id: string): Observable<Partner | undefined> {
        const partner = this.mockPartners.find(p => p.id === id);
        return of(partner);
    }

    searchPartners(filters: {
        code?: string;
        name?: string;
        phone?: string;
    }): Observable<Partner[]> {
        let filteredPartners = [...this.mockPartners];

        if (filters.code) {
            filteredPartners = filteredPartners.filter(partner =>
                partner.code.toLowerCase().includes(filters.code!.toLowerCase())
            );
        }

        if (filters.name) {
            filteredPartners = filteredPartners.filter(partner =>
                partner.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters.phone) {
            filteredPartners = filteredPartners.filter(partner =>
                partner.phone.includes(filters.phone!)
            );
        }

        return of(filteredPartners);
    }

    deletePartner(id: string): Observable<boolean> {
        const index = this.mockPartners.findIndex(p => p.id === id);
        if (index > -1) {
            this.mockPartners.splice(index, 1);
            return of(true);
        }
        return of(false);
    }

    addPartner(partner: Omit<Partner, 'id'>): Observable<boolean> {
        const newId = (this.mockPartners.length + 1).toString();
        const newPartner: Partner = {
            ...partner,
            id: newId
        };
        this.mockPartners.push(newPartner);
        return of(true);
    }

    checkPartnerCodeExists(code: string): Observable<boolean> {
        const exists = this.mockPartners.some(p => 
            p.code.toLowerCase() === code.toLowerCase()
        );
        return of(exists);
    }

    updatePartner(id: string, partner: Partial<Partner>): Observable<boolean> {
        const index = this.mockPartners.findIndex(p => p.id === id);
        if (index > -1) {
            this.mockPartners[index] = { ...this.mockPartners[index], ...partner };
            return of(true);
        }
        return of(false);
    }
}
