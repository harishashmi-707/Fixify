// Fixify Pakistan — Application Constants

export const ROLES = {
  USER: 'user',
  TECHNICIAN: 'technician',
  ADMIN: 'admin',
};

export const BOOKING_STATUSES = {
  pending:           { label: 'Pending',           color: 'warning',   icon: 'Clock' },
  accepted:          { label: 'Accepted',           color: 'info',      icon: 'CheckCircle' },
  technician_on_way: { label: 'Technician On Way',  color: 'primary',   icon: 'MapPin' },
  in_progress:       { label: 'In Progress',        color: 'primary',   icon: 'Settings' },
  completed:         { label: 'Completed',          color: 'success',   icon: 'CheckCheck' },
  cancelled:         { label: 'Cancelled',          color: 'danger',    icon: 'XCircle' },
  refunded:          { label: 'Refunded',           color: 'secondary', icon: 'RotateCcw' },
  disputed:          { label: 'Disputed',           color: 'dark',      icon: 'AlertTriangle' },
};

export const BOOKING_TRANSITIONS = {
  pending:           ['accepted', 'cancelled'],
  accepted:          ['technician_on_way', 'cancelled'],
  technician_on_way: ['in_progress', 'cancelled'],
  in_progress:       ['completed', 'disputed'],
  completed:         ['refunded', 'disputed'],
  cancelled:         ['refunded'],
  refunded:          [],
  disputed:          ['refunded', 'completed'],
};

export const TECHNICIAN_STATUSES = ['pending', 'approved', 'rejected', 'suspended'];

export const PAYMENT_METHODS = {
  cash:          'Cash on Delivery',
  jazzcash:      'JazzCash',
  easypaisa:     'EasyPaisa',
  bank_transfer: 'Bank Transfer',
  card:          'Credit/Debit Card',
};

export const NOTIFICATION_TYPES = ['booking', 'review', 'payment', 'system', 'message'];

export const CITIES = ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Multan', 'Quetta'];

export const CURRENCY = { symbol: 'Rs.', code: 'PKR' };

export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;
export const BOOKING_PREFIX = 'AF';
