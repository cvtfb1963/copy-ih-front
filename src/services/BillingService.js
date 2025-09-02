import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getUserBillingData = () =>
  getAxiosInstance().get(`${ENV.server}/billing/my-data`);

export const requestSubscriptionLink = (plan_id) =>
  getAxiosInstance().post(`${ENV.server}/billing/create-subscription`, {
    plan_id,
  });

export const createSubscriptionStripe = (plan_id, payment_method_id, currency) => {
  const payload = {
    plan_id,
    payment_method_id,
  };

  if (currency != "USD") payload.currency = currency;

  return getAxiosInstance().post(
    `${ENV.server}/billing/create-subscription-stripe`,
    payload
  );
};

export const stopSubscription = () =>
  getAxiosInstance().post(`${ENV.server}/billing/stop-subscription`);

export const createSubscriptionPlan = (
  name,
  price,
  frequency,
  includeFreeTrial,
  extraCurrencies,
  totalCycles,
  profileId
) =>
  getAxiosInstance().post(`${ENV.server}/billing/plans`, {
    name,
    billing_frequency: frequency,
    price,
    hasFreeTrial: includeFreeTrial,
    additional_currencies: extraCurrencies,
    totalCycles,
    profileId,
  });

export const publishSubscriptionPlan = (plan_id) =>
  getAxiosInstance().post(`${ENV.server}/billing/plans/publish`, { plan_id });

export const unpublishSubscriptionPlan = (plan_id) =>
  getAxiosInstance().delete(`${ENV.server}/billing/plans/publish`, {
    data: { plan_id },
  });

export const getPublishedSubscriptionPlans = () =>
  getAxiosInstance().get(`${ENV.server}/billing/plans/publish`);

export const activateSubscriptionPlan = (plan_id) =>
  getAxiosInstance().post(`${ENV.server}/billing/plans/${plan_id}/activate`);

export const deactivateSubscriptionPlan = (plan_id) =>
  getAxiosInstance().post(`${ENV.server}/billing/plans/${plan_id}/deactivate`);

export const getSubscriptionPlans = (page) =>
  getAxiosInstance().get(`${ENV.server}/billing/plans?page=${page}`);

export const getSubscriptionPlanDetailsById = (plan_id) =>
  getAxiosInstance().get(`${ENV.server}/billing/plans/${plan_id}`);

export const getAnyUserBillingData = (user_id) =>
  getAxiosInstance().get(`${ENV.server}/billing/user-data/${user_id}`);

export const stopStudentSubscription = (user_id) =>
  getAxiosInstance().post(`${ENV.server}/billing/stop-subscription/${user_id}`);

export const stopAllSubscriptionsByPlan = (plan_id) =>
  getAxiosInstance().post(
    `${ENV.server}/billing/plans/${plan_id}/stop-all-subscriptions`
  );

export const updatePlan = (plan_id, price, additional_currencies, name) =>
  getAxiosInstance().post(`${ENV.server}/billing/plans/${plan_id}/update`, {
    price,
    additional_currencies,
    name,
  });

export const deletePlan = (plan_id) =>
  getAxiosInstance().delete(`${ENV.server}/billing/plans/${plan_id}`);

// Profile API functions
export const getAllProfiles = () =>
  getAxiosInstance().get(`${ENV.server}/billing/profiles`);

export const getProfileById = (profile_id) =>
  getAxiosInstance().get(`${ENV.server}/billing/profiles/${profile_id}`);

export const createProfile = (nombre, units, skills) =>
  getAxiosInstance().post(`${ENV.server}/billing/profiles`, {
    nombre,
    units,
    skills,
  });

export const updateProfile = (profile_id, nombre, units, skills) =>
  getAxiosInstance().post(
    `${ENV.server}/billing/profiles/${profile_id}/update`,
    {
      nombre,
      units,
      skills,
    }
  );

export const deleteProfile = (profile_id) =>
  getAxiosInstance().delete(`${ENV.server}/billing/profiles/${profile_id}`);

export const updatePlanProfile = (plan_id, profile_id) =>
  getAxiosInstance().post(
    `${ENV.server}/billing/plans/${plan_id}/update-profile`,
    {
      profileId: profile_id,
    }
  );
