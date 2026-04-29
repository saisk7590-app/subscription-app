import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MobileContainer } from '../components/MobileContainer';
import { BottomNav } from '../components/BottomNav';
import { subscriptions, priceHistory, payments } from '../data/mockData';

export function ServiceDetails() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();

  const service = subscriptions.find(s => s.serviceName === serviceName);

  if (!service) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Service not found</p>
        </div>
      </MobileContainer>
    );
  }

  // Get price history for this service
  const servicePriceHistory = priceHistory[serviceName as keyof typeof priceHistory] || [];

  // Calculate total spent
  const totalSpent = payments
    .filter(p => p.serviceName === serviceName)
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate price trend
  const priceChange = servicePriceHistory.length >= 2
    ? servicePriceHistory[servicePriceHistory.length - 1].price - servicePriceHistory[0].price
    : 0;

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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white text-2xl font-semibold">{service.serviceName}</h1>
        <p className="text-blue-100 text-sm mt-1">{service.category}</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Service Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Current Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{service.price}</p>
              <p className="text-xs text-gray-500 mt-1">{service.billingType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Start Date</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(service.startDate)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Next Due</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(service.nextDueDate)}</p>
            </div>
          </div>

          {service.remark && (
            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-gray-500 text-sm mb-1">Plan Details</p>
              <p className="text-sm text-gray-900">{service.remark}</p>
            </div>
          )}
        </div>

        {/* Price Trend */}
        {priceChange !== 0 && (
          <div className={`rounded-2xl p-4 ${
            priceChange > 0 ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'
          }`}>
            <p className={`text-sm font-medium ${
              priceChange > 0 ? 'text-red-900' : 'text-green-900'
            }`}>
              Price {priceChange > 0 ? 'increased' : 'decreased'} by ₹{Math.abs(priceChange)} since start
            </p>
          </div>
        )}

        {/* Price Timeline Chart */}
        {servicePriceHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-gray-900 font-semibold mb-4">Price Timeline</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={servicePriceHistory}>
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
        )}

        {/* Payment History */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {payments
              .filter(p => p.serviceName === serviceName)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{formatDate(payment.date)}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">₹{payment.amount}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}
