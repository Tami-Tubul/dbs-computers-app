function updatePaymentsOnPriceChange(payments, priceDifference) {
  if (priceDifference === 0) return payments;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const updatedPayments = [...payments];
  const lastPayment = updatedPayments[updatedPayments.length - 1];

  const sameMonth =
    lastPayment &&
    new Date(lastPayment.date).getMonth() === currentMonth &&
    new Date(lastPayment.date).getFullYear() === currentYear;

  if (sameMonth) {
    lastPayment.amount += priceDifference;
  } else {
    updatedPayments.push({
      amount: priceDifference,
      date: now,
    });
  }

  return updatedPayments;
}

module.exports = { updatePaymentsOnPriceChange };
