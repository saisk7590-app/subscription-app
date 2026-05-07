import { MobileContainer } from '../components/MobileContainer';
import { BottomNav } from '../components/BottomNav';
import { subscriptions } from '../data/mockData';
import { Bell, AlertCircle } from 'lucide-react';

export function Reminders() {
  // Calculate days until next due
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get reminders (only enabled ones with upcoming due dates)
  const reminders = subscriptions
    .filter(sub => sub.reminderEnabled)
    .map(sub => ({
      ...sub,
      daysUntil: getDaysUntil(sub.nextDueDate),
    }))
    .filter(sub => sub.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // Separate urgent (3 days or less) from upcoming
  const urgentReminders = reminders.filter(r => r.daysUntil <= 3);
  const upcomingReminders = reminders.filter(r => r.daysUntil > 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysText = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `in ${days} days`;
  };

  return (
    <MobileContainer>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-semibold">Reminders</h1>
        <p className="text-blue-100 text-sm mt-1">Upcoming bill payments</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              <p className="text-sm text-gray-500">Active reminders</p>
            </div>
          </div>
        </div>

        {/* Urgent Reminders */}
        {urgentReminders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide">Urgent</h2>
            </div>
            <div className="space-y-4">
              {urgentReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-5 shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg">{reminder.serviceName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reminder.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700">₹{reminder.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-red-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-red-700">
                        Due {getDaysText(reminder.daysUntil)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{formatDate(reminder.nextDueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 mb-4 px-1 uppercase tracking-wide">Upcoming</h2>
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg">{reminder.serviceName}</h3>
                      <p className="text-sm text-gray-500 mt-1">{reminder.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{reminder.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-semibold text-blue-600">
                        Due {getDaysText(reminder.daysUntil)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{formatDate(reminder.nextDueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Reminders */}
        {reminders.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">No upcoming reminders</h3>
            <p className="text-gray-500 text-sm">
              All your bills are up to date or reminders are disabled
            </p>
          </div>
        )}

        {/* Total Upcoming Amount */}
        {reminders.length > 0 && (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-blue-100 text-sm mb-2">Total Upcoming Payments</p>
            <p className="text-3xl font-bold">
              ₹{reminders.reduce((sum, r) => sum + r.price, 0).toLocaleString()}
            </p>
            <p className="text-blue-100 text-sm mt-2">
              Next 30 days
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileContainer>
  );
}
