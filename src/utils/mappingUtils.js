// mappingUtils.js
const getPlanIdFromName = (planName, plans) => {
  const plan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase());
  return plan ? plan.planId : null;
};

const getPlanNameFromId = (planId, plans) => {
  const plan = plans.find(p => p.planId === planId);
  return plan ? plan.planName : null;
};

const getCompanyNameFromInsuranceId = (insuranceId, companies) => {
  const company = companies.find(c => c.companyId === insuranceId);
  return company ? company.name : null;
};

const getInsuranceIdFromCompanyName = (companyName, companies) => {
  const company = companies.find(c => c.name === companyName);
  return company ? company.companyId : null;
};

// Export the functions so they can be imported and used elsewhere
export {
  getPlanIdFromName,
  getPlanNameFromId,
  getCompanyNameFromInsuranceId,
  getInsuranceIdFromCompanyName
};
