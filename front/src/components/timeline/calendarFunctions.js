const calculateDaysQuantity = (currentYear, quantityYears) => {
  if (quantityYears <= 0) return 0;
  let totalDays = 0;
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    for (let month = 0; month < 12; month++) {
      totalDays += new Date(year, month + 1, 0).getDate();
    }
  }
  return totalDays;
};

const calculateQuantityMonths = (currentYear, quantityYears) => {
  if (quantityYears <= 0) return 0;
  let totalMonths = 0;
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    totalMonths += 12;
  }
  return totalMonths;
};

export { calculateDaysQuantity, calculateQuantityMonths };
