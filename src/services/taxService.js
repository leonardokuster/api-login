const convertSalary = (salary, frequency) => {
    switch (frequency) {
      case 'annual':
        return salary / 12;
      case 'semi-monthly':
        return salary * 2;
      case 'weekly':
        return salary * 4.33;
      case 'daily':
        return salary * 21.67;
      case 'hourly':
        return salary * 173.33;
      default:
        return salary;
    }
};

const IRRF_RATES = [
    { limit: 2259.20, rate: 0, deduction: 0 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 }
];
  
const INSS_RATES = [
    { limit: 1412.00, rate: 0.075, deduction: 0 },
    { limit: 2666.68, rate: 0.09, deduction: 21.18 },
    { limit: 4000.03, rate: 0.12, deduction: 101.18 },
    { limit: 7786.02, rate: 0.14, deduction: 181.18 },
    { limit: Infinity, rate: 0, deduction: 908.85 }
];
  
const COMPANY_INSS_RATE = 0.20;
  
const calculateINSS = (salary) => {
    let inss = 0;

    for (const bracket of INSS_RATES) {
        if (salary > bracket.limit) {
            inss += bracket.deduction;
        } else {
            inss += (salary * bracket.rate) - bracket.deduction;
            break;
        }
    }
    return inss;
};
 
const calculateIRRF = (salary) => {
    let irrf = 0;

    for (const bracket of IRRF_RATES) {
      if (salary > bracket.limit) {
        irrf += salary - bracket.deduction;
      } else {
        irrf += (salary * bracket.rate) - bracket.deduction;
      }
    }
    return irrf;
};
   
class TaxService {
    async calculateTax(dto) {
      const { salary, frequency } = dto;
      const monthlySalary = convertSalary(parseFloat(salary), frequency);
  
      const inss = calculateINSS(monthlySalary);
      const irrf = calculateIRRF(monthlySalary - inss);
      const totalTax = inss + irrf;
      const netSalary = monthlySalary - totalTax;
  
      const marginalTaxRate = (irrf / monthlySalary) * 100;
      const averageTaxRate = (totalTax / monthlySalary) * 100;
      const totalCost = monthlySalary + (monthlySalary * COMPANY_INSS_RATE);
  
      return {
        inss: inss.toFixed(2),
        irrf: irrf.toFixed(2),
        totalTax: totalTax.toFixed(2),
        netSalary: netSalary.toFixed(2),
        marginalTaxRate: marginalTaxRate.toFixed(2),
        averageTaxRate: averageTaxRate.toFixed(2),
        totalCost: totalCost.toFixed(2)
      };
    }
}
  
module.exports = new TaxService();
  