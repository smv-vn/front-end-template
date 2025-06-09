export interface Partner {
    id: string;
    code: string;
    name: string;
    avatar?: string;
    customerCount: number;
    phone: string;
    address: string;
    email?: string;
    description?: string;
    createdDate: Date;
    status: 'active' | 'inactive';
}
