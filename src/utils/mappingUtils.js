// mappingUtils.js

const getPlanIdFromName = (planName, plans) => {
  const plan = plans.find(p => p.plan_name === planName);
  return plan ? plan.magic_pill_plan_id : null;
};

const getPlanNameFromId = (planId, plans) => {
  const plan = plans.find(p => p.magic_pill_plan_id === planId);
  return plan ? plan.plan_name : null;
};

const getCompanyNameFromInsuranceId = (insuranceId, companies) => {
  const company = companies.find(c => c.insurance_company_id === insuranceId);
  return company ? company.admin_username : null;
};

const getInsuranceIdFromCompanyName = (companyName, companies) => {
  const company = companies.find(c => c.admin_username === companyName);
  return company ? company.insurance_company_id : null;
};

// Export the functions so they can be imported and used elsewhere
export {
  getPlanIdFromName,
  getPlanNameFromId,
  getCompanyNameFromInsuranceId,
  getInsuranceIdFromCompanyName
};
