import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { subscriptions, yearlySpendingData } from '../data/mockData';

export function Stats() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2024', '2025', '2026'];

  // Get current and previous year data
  const currentYearData = yearlySpendingData.find(d => d.year === selectedYear);
  const previousYearData = yearlySpendingData.find(d => d.year === String(Number(selectedYear) - 1));

  // Calculate percentage change
  let percentageChange = 0;
  if (currentYearData && previousYearData && previousYearData.amount > 0) {
    percentageChange = ((currentYearData.amount - previousYearData.amount) / previousYearData.amount) * 100;
  }

  // Calculate category totals for selected year
  const categoryTotals = subscriptions.reduce((acc: any, sub) => {
    const yearlyPrice = sub.billingType === 'Monthly' ? sub.price * 12 : sub.price;
    const category = sub.category;
    acc[category] = (acc[category] || 0) + yearlyPrice;
    return acc;
  }, {});

  const totalYearlySpending = Object.values(categoryTotals).reduce((sum: number, val: any) => sum + val, 0);

  // Convert to array with percentages
  const categoriesWithPercentage = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount: amount as number,
      percentage: ((amount as number) / totalYearlySpending) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate service totals
  const serviceTotals = subscriptions
    .map(sub => ({
      ...sub,
      yearlyTotal: sub.billingType === 'Monthly' ? sub.price * 12 : sub.price,
    }))
    .filter(sub => sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.yearlyTotal - a.yearlyTotal);

  // Generate insights
  const insights = [];
  if (categoriesWithPercentage.length > 0) {
    const topCategory = categoriesWithPercentage[0];
    if (percentageChange > 0) {
      insights.push(`${topCategory.category} increased by ${Math.abs(Math.round(percentageChange))}% this year`);
    }
    insights.push(`${topCategory.category} is your highest spending category`);
  }

  const ottTotal3Years = subscriptions
    .filter(sub => sub.category === 'OTT')
    .reduce((sum, sub) => {
      const yearlyPrice = sub.billingType === 'Monthly' ? sub.price * 12 : sub.price;
      return sum + (yearlyPrice * 3);
    }, 0);
  insights.push(`You spent ₹${Math.round(ottTotal3Years).toLocaleString()} on OTT in last 3 years`);

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Year Selector */}
      <div className="relative">
        <button
          onClick={() => setShowYearPicker(!showYearPicker)}
          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm hover:border-gray-300 transition-colors"
        >
          <span className="text-gray-900 font-semibold">{selectedYear}</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>

        {showYearPicker && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setShowYearPicker(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                  selectedYear === year ? 'text-blue-600 font-medium' : 'text-gray-900'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year Summary Card */}
      <div className="bg-white rounded-2xl p-7 shadow-sm">
        <p className="text-gray-500 text-sm mb-3">Total Spending</p>
        <p className="text-5xl font-bold text-gray-900 mb-3">
          ₹{currentYearData ? currentYearData.amount.toLocaleString() : Math.round(totalYearlySpending).toLocaleString()}
        </p>
        {percentageChange !== 0 && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            percentageChange > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {percentageChange > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {Math.abs(Math.round(percentageChange))}% vs {Number(selectedYear) - 1}
            </span>
          </div>
        )}
      </div>

      {/* Category Totals Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-gray-900 font-semibold text-lg mb-5">Category Breakdown</h2>
        <div className="space-y-4">
          {categoriesWithPercentage.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="text-gray-900 font-semibold">{cat.category}</p>
                <p className="text-sm text-gray-500 mt-0.5">{Math.round(cat.percentage)}% of total</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                ₹{Math.round(cat.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-gray-900 font-semibold text-lg mb-4">Insights</h2>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3 text-blue-900">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Service List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-gray-900 font-semibold text-lg mb-5">All Services</h2>
        {serviceTotals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No data available</p>
            <p className="text-sm text-gray-400">Add subscription to get insights</p>
          </div>
        ) : (
          <div className="space-y-1">
            {serviceTotals.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between py-3 px-3 -mx-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => navigate(`/service/${service.serviceName}`)}
              >
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">{service.serviceName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{service.billingType}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{Math.round(service.yearlyTotal).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">yearly</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
