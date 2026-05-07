import { useState } from 'react';
import { MobileContainer } from '../components/MobileContainer';
import { BottomNav } from '../components/BottomNav';
import { payments, categories, subscriptions } from '../data/mockData';
import { Filter, Search } from 'lucide-react';

export function History() {
  const [yearFilter, setYearFilter] = useState('2026');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2024', '2025', '2026'];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesYear = payment.date.startsWith(yearFilter);
    const matchesCategory = categoryFilter === 'All' || payment.category === categoryFilter;
    const matchesSearch = payment.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  });

  // Get subscription details for status
  const getSubscriptionStatus = (serviceName: string) => {
    const sub = subscriptions.find(s => s.serviceName === serviceName);
    return sub?.status || 'Active';
  };

  const getSubscriptionDates = (serviceName: string) => {
    const sub = subscriptions.find(s => s.serviceName === serviceName);
    return {
      startDate: sub?.startDate || '',
      endDate: sub?.endDate || 'Present',
    };
  };

  // Sort by date (most recent first)
  const sortedPayments = [...filteredPayments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by month
  const groupedByMonth = sortedPayments.reduce((acc: any, payment) => {
    const month = new Date(payment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(payment);
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <MobileContainer>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-semibold">Payment History</h1>
        <p className="text-blue-100 text-sm mt-1">Track all your payments</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {/* Year Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowYearPicker(!showYearPicker);
                setShowCategoryPicker(false);
              }}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm"
            >
              <span className="text-gray-900 font-medium">{yearFilter}</span>
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
            
            {showYearPicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setYearFilter(year);
                      setShowYearPicker(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      yearFilter === year ? 'text-blue-600 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowCategoryPicker(!showCategoryPicker);
                setShowYearPicker(false);
              }}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm"
            >
              <span className="text-gray-900 font-medium">{categoryFilter}</span>
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
            
            {showCategoryPicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    setShowCategoryPicker(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                    categoryFilter === 'All' ? 'text-blue-600 font-medium' : 'text-gray-900'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setShowCategoryPicker(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      categoryFilter === cat ? 'text-blue-600 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment List */}
        <div className="space-y-6">
          {Object.entries(groupedByMonth).length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500">No payments found</p>
            </div>
          ) : (
            Object.entries(groupedByMonth).map(([month, monthPayments]: [string, any]) => (
              <div key={month}>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">{month}</h3>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
                  {monthPayments.map((payment: any) => {
                    const status = getSubscriptionStatus(payment.serviceName);
                    const dates = getSubscriptionDates(payment.serviceName);
                    const statusColors = {
                      Active: 'bg-green-50 text-green-600 border-green-200',
                      Cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
                      Paused: 'bg-orange-50 text-orange-600 border-orange-200',
                    };

                    return (
                      <div key={payment.id} className="px-5 py-5 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-semibold mb-1.5">{payment.serviceName}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">{formatDate(payment.date)}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                              {payment.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500">
                              {formatDate(dates.startDate)} - {dates.endDate === 'Present' ? dates.endDate : formatDate(dates.endDate)}
                            </span>
                            <span className={`text-xs px-2.5 py-1 border rounded-full font-semibold ${statusColors[status as keyof typeof statusColors]}`}>
                              {status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-bold text-gray-900">₹{payment.amount}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Card */}
        {sortedPayments.length > 0 && (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-blue-100 text-sm mb-2">Total Spent ({yearFilter})</p>
            <p className="text-3xl font-bold">
              ₹{sortedPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </p>
            <p className="text-blue-100 text-sm mt-2">
              {sortedPayments.length} payment{sortedPayments.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileContainer>
  );
}
