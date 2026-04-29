import { useState } from 'react';
import { MobileContainer } from '../components/MobileContainer';
import { BottomNav } from '../components/BottomNav';
import { categories } from '../data/mockData';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AddSubscription() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    billingType: 'Monthly',
    duration: '',
    startDate: '',
    nextDueDate: '',
    remark: '',
    reminderEnabled: true,
    reminderDays: '3',
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    navigate('/');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate next due date based on start date, billing type, and duration
      if (field === 'startDate' || field === 'billingType' || field === 'duration') {
        const startDate = field === 'startDate' ? value : prev.startDate;
        const billingType = field === 'billingType' ? value : prev.billingType;
        const duration = field === 'duration' ? value : prev.duration;
        
        if (startDate) {
          const date = new Date(startDate);
          
          // Check if date is valid
          if (!isNaN(date.getTime())) {
            if (billingType === 'Monthly') {
              date.setMonth(date.getMonth() + 1);
            } else if (billingType === 'Yearly') {
              date.setFullYear(date.getFullYear() + 1);
            } else if (billingType === 'Custom' && duration) {
              date.setDate(date.getDate() + parseInt(duration));
            }
            
            newData.nextDueDate = date.toISOString().split('T')[0];
          }
        } else {
          // Clear next due date if start date is cleared
          newData.nextDueDate = '';
        }
      }
      
      return newData;
    });
  };

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <MobileContainer>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Add Subscription</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Section 1: Basic */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => handleChange('serviceName', e.target.value)}
                placeholder="e.g. Netflix"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="add_new">+ Add new category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Billing */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Billing Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Type
              </label>
              <select
                value={formData.billingType}
                onChange={(e) => handleChange('billingType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {formData.billingType === 'Custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Date */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Date Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Next Due Date
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-6 top-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      Calculated automatically
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nextDueDate ? formatDateDisplay(formData.nextDueDate) : ''}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                  placeholder="Select start date and billing type"
                  readOnly
                  disabled
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Auto-calculated based on billing type and duration
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Extra */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Additional Info</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark
            </label>
            <textarea
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
              placeholder="e.g. Premium Plan, Includes Ads, Family Plan..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Section 5: Reminder */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-gray-900 font-semibold mb-4">Reminder Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Reminder
              </label>
              <button
                type="button"
                onClick={() => handleChange('reminderEnabled', !formData.reminderEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.reminderEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {formData.reminderEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remind me before (days)
                </label>
                <select
                  value={formData.reminderDays}
                  onChange={(e) => handleChange('reminderDays', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          Save Subscription
        </button>
      </form>

      <BottomNav />
    </MobileContainer>
  );
}