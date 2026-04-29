export interface Subscription {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  billingType: 'Monthly' | 'Yearly' | 'Custom';
  startDate: string;
  nextDueDate: string;
  remark?: string;
  reminderEnabled: boolean;
  reminderDays: number;
  status?: 'Active' | 'Cancelled' | 'Paused';
  endDate?: string;
}

export interface Payment {
  id: string;
  serviceName: string;
  amount: number;
  date: string;
  category: string;
}

export const subscriptions: Subscription[] = [
  {
    id: '1',
    serviceName: 'Netflix',
    category: 'OTT',
    price: 649,
    billingType: 'Monthly',
    startDate: '2024-01-15',
    nextDueDate: '2026-04-20',
    remark: 'Premium Plan',
    reminderEnabled: true,
    reminderDays: 3,
    status: 'Active',
  },
  {
    id: '2',
    serviceName: 'Airtel',
    category: 'Mobile',
    price: 399,
    billingType: 'Monthly',
    startDate: '2024-03-01',
    nextDueDate: '2026-05-01',
    remark: 'Unlimited 5G',
    reminderEnabled: true,
    reminderDays: 5,
    status: 'Active',
  },
  {
    id: '3',
    serviceName: 'WiFi',
    category: 'Internet',
    price: 799,
    billingType: 'Monthly',
    startDate: '2024-02-10',
    nextDueDate: '2026-05-10',
    reminderEnabled: true,
    reminderDays: 7,
    status: 'Active',
  },
  {
    id: '4',
    serviceName: 'Spotify',
    category: 'OTT',
    price: 119,
    billingType: 'Monthly',
    startDate: '2024-01-01',
    nextDueDate: '2026-05-01',
    remark: 'Premium',
    reminderEnabled: false,
    reminderDays: 3,
    status: 'Active',
  },
  {
    id: '5',
    serviceName: 'Amazon Prime',
    category: 'OTT',
    price: 1499,
    billingType: 'Yearly',
    startDate: '2024-06-01',
    nextDueDate: '2026-06-01',
    reminderEnabled: true,
    reminderDays: 7,
    status: 'Active',
  },
];

export const payments: Payment[] = [
  { id: '1', serviceName: 'Netflix', amount: 649, date: '2026-03-20', category: 'OTT' },
  { id: '2', serviceName: 'Airtel', amount: 399, date: '2026-04-01', category: 'Mobile' },
  { id: '3', serviceName: 'WiFi', amount: 799, date: '2026-04-10', category: 'Internet' },
  { id: '4', serviceName: 'Spotify', amount: 119, date: '2026-04-01', category: 'OTT' },
  { id: '5', serviceName: 'Netflix', amount: 649, date: '2026-02-20', category: 'OTT' },
  { id: '6', serviceName: 'Airtel', amount: 399, date: '2026-03-01', category: 'Mobile' },
  { id: '7', serviceName: 'WiFi', amount: 799, date: '2026-03-10', category: 'Internet' },
  { id: '8', serviceName: 'Spotify', amount: 119, date: '2026-03-01', category: 'OTT' },
  { id: '9', serviceName: 'Netflix', amount: 649, date: '2026-01-20', category: 'OTT' },
  { id: '10', serviceName: 'Airtel', amount: 399, date: '2026-02-01', category: 'Mobile' },
  { id: '11', serviceName: 'WiFi', amount: 799, date: '2026-02-10', category: 'Internet' },
  { id: '12', serviceName: 'Spotify', amount: 119, date: '2026-02-01', category: 'OTT' },
  { id: '13', serviceName: 'Netflix', amount: 649, date: '2025-12-20', category: 'OTT' },
  { id: '14', serviceName: 'Airtel', amount: 399, date: '2026-01-01', category: 'Mobile' },
  { id: '15', serviceName: 'WiFi', amount: 799, date: '2026-01-10', category: 'Internet' },
];

export const categories = ['OTT', 'Mobile', 'Internet', 'Software', 'Cloud Storage', 'Gaming'];

export const yearlySpendingData = [
  { year: '2024', amount: 45000 },
  { year: '2025', amount: 52000 },
  { year: '2026', amount: 28000 },
];

export const priceHistory = {
  Netflix: [
    { month: 'Jan', price: 649 },
    { month: 'Feb', price: 649 },
    { month: 'Mar', price: 649 },
    { month: 'Apr', price: 649 },
    { month: 'May', price: 649 },
    { month: 'Jun', price: 649 },
  ],
  Airtel: [
    { month: 'Jan', price: 299 },
    { month: 'Feb', price: 299 },
    { month: 'Mar', price: 399 },
    { month: 'Apr', price: 399 },
    { month: 'May', price: 399 },
    { month: 'Jun', price: 399 },
  ],
  WiFi: [
    { month: 'Jan', price: 699 },
    { month: 'Feb', price: 699 },
    { month: 'Mar', price: 799 },
    { month: 'Apr', price: 799 },
    { month: 'May', price: 799 },
    { month: 'Jun', price: 799 },
  ],
  Spotify: [
    { month: 'Jan', price: 119 },
    { month: 'Feb', price: 119 },
    { month: 'Mar', price: 119 },
    { month: 'Apr', price: 119 },
    { month: 'May', price: 119 },
    { month: 'Jun', price: 119 },
  ],
};

export const ottSpendingData = [
  { month: 'Jan', amount: 768 },
  { month: 'Feb', amount: 768 },
  { month: 'Mar', amount: 768 },
  { month: 'Apr', amount: 768 },
  { month: 'May', amount: 2267 },
  { month: 'Jun', amount: 768 },
];
