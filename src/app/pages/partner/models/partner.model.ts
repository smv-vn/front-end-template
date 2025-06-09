export interface Partner {
  id: string;
  code: string;
  name: string;
  customerCount: number;
  phone: string;
  address: string;
  description?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePartnerRequest {
  code: string;
  name: string;
  phone: string;
  address: string;
  description?: string;
  avatar?: string;
}

export interface UpdatePartnerRequest extends CreatePartnerRequest {
  id: string;
}
