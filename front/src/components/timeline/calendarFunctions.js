const calculateDaysQuantity = (currentYear, quantityYears) => {
  let totalDays = 0;
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    for (let month = 0; month < 12; month++) {
      totalDays += new Date(year, month + 1, 0).getDate();
    }
  }
  return totalDays;
};

const calculateQuantityMonths = (currentYear, quantityYears) => {
  let totalMonths = 0;
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    for (let month = 0; month < 12; month++) {
      totalMonths++;
    }
  }
  return totalMonths;
};

export { calculateDaysQuantity, calculateQuantityMonths };
