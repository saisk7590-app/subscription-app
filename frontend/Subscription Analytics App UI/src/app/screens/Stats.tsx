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
    <div className="space-y-6">
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

      {/* Year Selector */}
      <div className="relative">
        <button
          onClick={() => setShowYearPicker(!showYearPicker)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm"
        >
          <span className="text-gray-900 font-medium">{selectedYear}</span>
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
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm mb-2">Total Spending</p>
        <p className="text-4xl font-bold text-gray-900">
          ₹{currentYearData ? currentYearData.amount.toLocaleString() : Math.round(totalYearlySpending).toLocaleString()}
        </p>
        {percentageChange !== 0 && (
          <div className={`flex items-center gap-2 mt-3 ${
            percentageChange > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {percentageChange > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {Math.abs(Math.round(percentageChange))}% vs {Number(selectedYear) - 1}
            </span>
          </div>
        )}
      </div>

      {/* Category Totals Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-gray-900 font-semibold mb-4">Category Breakdown</h2>
        <div className="space-y-3">
          {categoriesWithPercentage.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{cat.category}</p>
                <p className="text-sm text-gray-500">{Math.round(cat.percentage)}%</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                ₹{Math.round(cat.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Insights */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-gray-900 font-semibold mb-3">Insights</h2>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2 text-blue-900">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Service List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-gray-900 font-semibold mb-4">All Services</h2>
        <div className="space-y-3">
          {serviceTotals.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
              onClick={() => navigate(`/service/${service.serviceName}`)}
            >
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{service.serviceName}</p>
                <p className="text-sm text-gray-500">{service.billingType}</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                ₹{Math.round(service.yearlyTotal).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
