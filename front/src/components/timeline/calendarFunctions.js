import { quantityYears } from "../../components/timeline/params";

const calculateDaysQuantity = () => {
  const currentYear = new Date().getFullYear();
  let totalDays = 0;
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    for (let month = 0; month < 12; month++) {
      totalDays += new Date(year, month + 1, 0).getDate();
    }
  }
  return totalDays;
};

const calculateQuantityMonths = () => {
  const currentYear = new Date().getFullYear();
  let totalMonths = 0;
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    for (let month = 0; month < 12; month++) {
      totalMonths++;
    }
  }
  return totalMonths;
};

export { calculateDaysQuantity, calculateQuantityMonths };
