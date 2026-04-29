import { useState, useEffect } from 'react';
import { MobileContainer } from '../components/MobileContainer';
import { BottomNav } from '../components/BottomNav';
import { Stats } from './Stats';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { subscriptions, yearlySpendingData, priceHistory, ottSpendingData } from '../data/mockData';
import { useSearchParams } from 'react-router-dom';

export function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeFilter, setTimeFilter] = useState('1Y');
  const [selectedService, setSelectedService] = useState('Netflix');
  const [showServicePicker, setShowServicePicker] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'stats') {
      setActiveTab('stats');
    }
  }, [searchParams]);

  // Calculate category distribution
  const categoryData = subscriptions.reduce((acc: any[], sub) => {
    const existing = acc.find(item => item.name === sub.category);
    const monthlyPrice = sub.billingType === 'Yearly' ? sub.price / 12 : sub.price;
    
    if (existing) {
      existing.value += monthlyPrice;
    } else {
      acc.push({ name: sub.category, value: monthlyPrice, id: sub.category });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  // Top services
  const topServicesData = subscriptions
    .map(sub => ({
      name: sub.serviceName,
      amount: sub.billingType === 'Yearly' ? Math.round(sub.price / 12) : sub.price,
      id: sub.id
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const serviceNames = Array.from(new Set(subscriptions.map(s => s.serviceName)));

  return (
    <MobileContainer>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-semibold">Analytics</h1>
        <p className="text-blue-100 text-sm mt-1">Subscription insights</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-md'
                : 'bg-blue-600 bg-opacity-30 text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-blue-600 shadow-md'
                : 'bg-blue-600 bg-opacity-30 text-white'
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {activeTab === 'analytics' ? (
          <>
            {/* Time Filter */}
            <div className="flex gap-2 justify-center">
              {['1Y', '3Y', '5Y', '10Y'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-5 py-2 rounded-xl font-medium transition-all text-sm ${
                    timeFilter === filter
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

        {/* Chart 1: Category Distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Category Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₹${Math.round(value)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Yearly Spending */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Yearly Spending</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: any) => `₹${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Price Trend */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Price Trend</h2>
          
          {/* Service Selector */}
          <div className="relative mb-4">
            <button
              onClick={() => setShowServicePicker(!showServicePicker)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex items-center justify-between"
            >
              <span className="text-gray-900">{selectedService}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showServicePicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {serviceNames.map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSelectedService(service);
                      setShowServicePicker(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900"
                  >
                    {service}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory[selectedService as keyof typeof priceHistory] || priceHistory.Netflix}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: any) => `₹${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: OTT Spending Spike */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">OTT Spending Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ottSpendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: any) => `₹${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Top Services */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Top Services by Spending</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServicesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
                <Tooltip
                  formatter={(value: any) => `₹${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
          </>
        ) : (
          <Stats />
        )}
      </div>

      <BottomNav />
    </MobileContainer>
  );
}