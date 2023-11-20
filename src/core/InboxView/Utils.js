// import Banking from '@assets/banking.svg';
// import Compliance from '@assets/compliance.svg';
// import Employee from '@assets/employee.svg';
// import Estimate from '@assets/estimate.svg';
import ExpenseBill from '@assets/expenseBill.svg';
import Invoice from '@assets/invoice.svg';
import Payment from '@assets/payment.svg';
// import PurchaseOrder from '@assets/purchaseOrder.svg';

const notificationTypes = {
  ExpenseBill: [
    'billing_approved',
    'bill_success_created',
    'bill_file_created',
    'bill_not_created',
  ],
  Invoice: [
    'approve_invoice_notification',
    'invoice_approved_success',
    'invoice_created_success',
    'recurring_invoice_created',
    'invoice_reviewed_success',
    'invoice_dispatched_success',
    'recurring_invoice_pending',
    'recurring_invoice_ended',
    'recurring_invoice_deleted',
  ],
  Payment: [
    'payment_request_created',
    'payment_review_required',
    'payment_request_approved',
  ],
};
const endDate = new Date();
const notificationTime = (startDate) => {
  const hours =
    Math.abs(endDate.getTime() - new Date(startDate).getTime()) / 36e5;
  if (hours < 1) {
    return 'Now';
  }
  if (hours > 1 && hours < 24) {
    return `${Math.round(Math.round(hours))}h`;
  }
  if (hours > 24) {
    return `${Math.round(Math.round(hours) / 24)}d`;
  }
  return '';
};

const notificationImage = (notificationType) => {
  if (notificationTypes.ExpenseBill.includes(notificationType)) {
    return { icon: ExpenseBill, alt: 'ExpenseBill' };
  }
  if (notificationTypes.Invoice.includes(notificationType)) {
    return { icon: Invoice, alt: 'Invoice' };
  }
  if (notificationTypes.Payment.includes(notificationType)) {
    return { icon: Payment, alt: 'Payment' };
  }
  return { icon: '', alt: 'no icon found' };
};
export { notificationTime, notificationImage };
