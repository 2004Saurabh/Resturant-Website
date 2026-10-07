// Invoice number and formatting utilities
export const generateInvoiceNumber = (orderId) => {
  const timestamp = Date.now().toString().slice(-4);
  const cleanId = (orderId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  return `NOC-INV-${cleanId || timestamp}`;
};

export const printInvoice = () => {
  window.print();
};

export const downloadInvoiceData = (order) => {
  const invoiceData = JSON.stringify(order, null, 2);
  const blob = new Blob([invoiceData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order.id || 'order'}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
