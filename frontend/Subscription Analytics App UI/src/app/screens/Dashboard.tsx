import { AlertCircle, Tv, Smartphone, Wifi, Satellite, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MobileContainer } from '../components/MobileContainer';
import { BottomNav } from '../components/BottomNav';
import { subscriptions, yearlySpendingData } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const currentYear = new Date().getFullYear();

  // Calculate total yearly spending
  const totalYearlySpending = subscriptions.reduce((sum, sub) => {
    if (sub.billingType === 'Monthly') {
      return sum + (sub.price * 12);
    } else if (sub.billingType === 'Yearly') {
      return sum + sub.price;
    }
    return sum + sub.price;
  }, 0);

  // Calculate percentage change vs previous year
  const currentYearData = yearlySpendingData.find(d => d.year === String(currentYear));
  const previousYearData = yearlySpendingData.find(d => d.year === String(currentYear - 1));

  let percentageChange = 0;
  if (currentYearData && previousYearData && previousYearData.amount > 0) {
    percentageChange = ((currentYearData.amount - previousYearData.amount) / previousYearData.amount) * 100;
  }

  // Calculate category totals (yearly)
  const categoryTotalsMap = subscriptions.reduce((acc: any, sub) => {
    const yearlyPrice = sub.billingType === 'Monthly' ? sub.price * 12 : sub.price;
    const category = sub.category;
    acc[category] = (acc[category] || 0) + yearlyPrice;
    return acc;
  }, {});

  // Convert to array and sort by value
  const topCategories = Object.entries(categoryTotalsMap)
    .map(([category, amount]) => ({ category, amount: amount as number }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Map categories to icons and colors
  const categoryIcons: any = {
    'OTT': { icon: Tv, color: 'blue' },
    'Mobile': { icon: Smartphone, color: 'purple' },
    'Internet': { icon: Wifi, color: 'cyan' },
    'DTH': { icon: Satellite, color: 'green' },
  };

  const getIconConfig = (category: string) => {
    return categoryIcons[category] || { icon: Tv, color: 'blue' };
  };

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

  // Top 5 categories
  const topCategories = categoryData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  // Top services
  const topServices = subscriptions
    .map(sub => ({
      ...sub,
      monthlyPrice: sub.billingType === 'Yearly' ? sub.price / 12 : sub.price
    }))
    .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
    .slice(0, 3);

  // Calculate days until next due
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingDue = subscriptions.find(sub => {
    const days = getDaysUntil(sub.nextDueDate);
    return days > 0 && days <= 7;
  });

  return (
    <MobileContainer>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-semibold">Hello, Sai</h1>
        <p className="text-blue-100 text-sm mt-1">{currentMonth}</p>
      </div>

      <div className="px-4 -mt-4 space-y-6">
        {/* Total Yearly Spending Card - Main KPI */}
        <div
          className="bg-white rounded-2xl p-8 shadow-md cursor-pointer active:scale-98 transition-transform"
          onClick={() => navigate('/analytics')}
        >
          <p className="text-gray-500 text-sm mb-2">Total Yearly Spending</p>
          <p className="text-5xl font-bold text-gray-900">₹{currentYearData ? currentYearData.amount.toLocaleString() : Math.round(totalYearlySpending).toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-gray-600 font-medium">{currentYear}</span>
            {percentageChange !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                percentageChange > 0
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {percentageChange > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-semibold">
                  {Math.abs(Math.round(percentageChange))}% vs {currentYear - 1}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category KPI Cards Row */}
        <div className="grid grid-cols-3 gap-3">
          {topCategories.map((cat) => {
            const config = getIconConfig(cat.category);
            const Icon = config.icon;

            const iconBgClass = config.color === 'blue' ? 'bg-blue-100' :
                               config.color === 'purple' ? 'bg-purple-100' :
                               config.color === 'cyan' ? 'bg-cyan-100' : 'bg-green-100';

            const iconColorClass = config.color === 'blue' ? 'text-blue-600' :
                                  config.color === 'purple' ? 'text-purple-600' :
                                  config.color === 'cyan' ? 'text-cyan-600' : 'text-green-600';

            return (
              <div
                key={cat.category}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer active:scale-95 transition-transform"
                onClick={() => navigate('/analytics?tab=stats&category=' + cat.category)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${iconBgClass} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${iconColorClass}`} />
                  </div>
                  <p className="text-xs text-gray-500">{cat.category}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{Math.round(cat.amount).toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Insight Card */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 shadow-sm">
          <p className="text-purple-900 font-medium">
            {topCategories.length > 0 && `${topCategories[0].category} is your highest spending category at ₹${Math.round(topCategories[0].amount).toLocaleString()} this year`}
          </p>
        </div>

        {/* Alert Card */}
        {upcomingDue && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-900 font-medium">{upcomingDue.serviceName} due in {getDaysUntil(upcomingDue.nextDueDate)} days</p>
              <p className="text-red-700 text-sm mt-0.5">₹{upcomingDue.price} • {upcomingDue.nextDueDate}</p>
            </div>
          </div>
        )}

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-3">Category Distribution</h2>
          <div className="h-40 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {topCategories.slice(0, 4).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ₹{Math.round(category.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Top Services</h2>
          <div className="space-y-3">
            {topServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                onClick={() => navigate(`/service/${service.serviceName}`)}
              >
                <div>
                  <p className="text-gray-900 font-medium">{service.serviceName}</p>
                  <p className="text-gray-500 text-sm">{service.category}</p>
                </div>
                <p className="text-gray-900 font-semibold">
                  ₹{service.billingType === 'Yearly' ? Math.round(service.price / 12) : service.price}
                  <span className="text-gray-500 text-xs font-normal">/mo</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}