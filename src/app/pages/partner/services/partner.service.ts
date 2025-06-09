import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private partners: Partner[] = [
    {
      id: '1',
      code: 'SMC',
      name: 'Star Media Center',
      customerCount: 1,
      phone: '0987654321',
      address: '86 Linh Dam, Hoàng Mai, Hà Nội',
      description: 'Công ty chuyên sản xuất phim mãng',
      avatar: 'assets/demo/images/avatar/amyelsner.png',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    },
    {
      id: '2',
      code: 'SMV',
      name: 'Smart Viet',
      customerCount: 5,
      phone: '0971231231',
      address: 'Số 30 Kim Giang, Hoàng Mai, Hà Nội',
      description: 'Công ty công nghệ thông tin',
      avatar: 'assets/demo/images/avatar/annafali.png',
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2023-02-20')
    },
    {
      id: '3',
      code: 'TEC',
      name: 'Tech Solutions',
      customerCount: 3,
      phone: '0912345678',
      address: 'Số 15 Cầu Giấy, Hà Nội',
      description: 'Giải pháp công nghệ toàn diện',
      avatar: 'assets/demo/images/avatar/asiyajavayant.png',
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2023-03-10')
    },
    {
      id: '4',
      code: 'DIG',
      name: 'Digital Agency',
      customerCount: 8,
      phone: '0909876543',
      address: 'Số 25 Thanh Xuân, Hà Nội',
      description: 'Dịch vụ marketing số',
      avatar: 'assets/demo/images/avatar/bernardodominic.png',
      createdAt: new Date('2023-04-05'),
      updatedAt: new Date('2023-04-05')
    },
    {
      id: '5',
      code: 'INN',
      name: 'Innovation Hub',
      customerCount: 12,
      phone: '0898765432',
      address: 'Số 40 Đống Đa, Hà Nội',
      description: 'Trung tâm đổi mới sáng tạo',
      avatar: 'assets/demo/images/avatar/elvisjones.png',
      createdAt: new Date('2023-05-12'),
      updatedAt: new Date('2023-05-12')
    }
  ];

  private partnersSubject = new BehaviorSubject<Partner[]>(this.partners);
  public partners$ = this.partnersSubject.asObservable();

  getPartners(): Observable<Partner[]> {
    return of(this.partners).pipe(delay(300));
  }

  getPartnerById(id: string): Observable<Partner | undefined> {
    return of(this.partners.find(p => p.id === id)).pipe(delay(200));
  }

  searchPartners(searchTerm: string): Observable<Partner[]> {
    if (!searchTerm.trim()) {
      return this.getPartners();
    }

    const filtered = this.partners.filter(partner =>
      partner.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.includes(searchTerm) ||
      partner.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filtered).pipe(delay(300));
  }

  createPartner(request: CreatePartnerRequest): Observable<Partner> {
    const newPartner: Partner = {
      id: (this.partners.length + 1).toString(),
      ...request,
      customerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.partners.unshift(newPartner);
    this.partnersSubject.next([...this.partners]);

    return of(newPartner).pipe(delay(500));
  }

  updatePartner(request: UpdatePartnerRequest): Observable<Partner> {
    const index = this.partners.findIndex(p => p.id === request.id);
    if (index === -1) {
      throw new Error('Partner not found');
    }

    const updatedPartner: Partner = {
      ...this.partners[index],
      ...request,
      updatedAt: new Date()
    };

    this.partners[index] = updatedPartner;
    this.partnersSubject.next([...this.partners]);

    return of(updatedPartner).pipe(delay(500));
  }

  deletePartner(id: string): Observable<boolean> {
    const index = this.partners.findIndex(p => p.id === id);
    if (index === -1) {
      return of(false).pipe(delay(300));
    }

    this.partners.splice(index, 1);
    this.partnersSubject.next([...this.partners]);

    return of(true).pipe(delay(300));
  }

  checkCodeExists(code: string, excludeId?: string): Observable<boolean> {
    const exists = this.partners.some(p =>
      p.code.toLowerCase() === code.toLowerCase() && p.id !== excludeId
    );
    return of(exists).pipe(delay(200));
  }
}
