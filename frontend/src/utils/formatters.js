export function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function formatMonthYear(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateDisplay(dateString) {
  if (!dateString) {
    return '';
  }

  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getDaysUntil(dateString) {
  const today = new Date();
  const dueDate = new Date(dateString);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysText(days) {
  if (days === 0) {
    return 'Today';
  }

  if (days === 1) {
    return 'Tomorrow';
  }

  return `in ${days} days`;
}

export function getYearlyPrice(subscription) {
  if (subscription.billingType === 'Monthly') {
    return subscription.price * 12;
  }

  return subscription.price;
}

export function getMonthlyPrice(subscription) {
  if (subscription.billingType === 'Yearly') {
    return subscription.price / 12;
  }

  return subscription.price;
}
