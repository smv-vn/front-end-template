export interface DemoRecord {
    id?: string;
    code: string;
    unit: string;
    staffCount: string;
    startTime: string;
    endTime: string;
    status: string;
    description?: string;
}

export interface StatusOption {
    label: string;
    value: string;
}