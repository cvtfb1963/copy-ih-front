import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getUsers = (search = "", page) =>
  getAxiosInstance().get(`${ENV.server}/users?search=${search}&page=${page}`);

export const getInstitutions = (search = "") =>
  getAxiosInstance().get(`${ENV.server}/users/institutions?search=${search}`);

export const convertAlumno = (userId) =>
  getAxiosInstance().post(`${ENV.server}/users/convert-alumno`, {
    userId,
  });

export const convertInstitution = (userId) =>
  getAxiosInstance().post(`${ENV.server}/users/convert-institution`, {
    userId,
  });

export const updateSuspendState = (userId, state) =>
  getAxiosInstance().put(`${ENV.server}/users/update-suspend-state`, {
    userId,
    state,
  });

export const deleteUser = (userId) =>
  getAxiosInstance().delete(`${ENV.server}/users/delete-user`, {
    data: {
      userId,
    },
  });

export const updateFreeNavigation = (userId, state) =>
  getAxiosInstance().put(`${ENV.server}/users/update-free-navigation`, {
    userId,
    state,
  });

export const updateSVU = (userId, subscriptionValidUntil) =>
  getAxiosInstance().put(`${ENV.server}/users/update-svu`, {
    userId,
    subscriptionValidUntil,
  });

export const updateBUT = (userId, boughtUpTo) =>
  getAxiosInstance().put(`${ENV.server}/users/update-but`, {
    userId,
    boughtUpTo,
  });

export const updateSubscriptionID = (userId, subscriptionID) =>
  getAxiosInstance().put(`${ENV.server}/users/update-subscriptionID`, {
    userId,
    subscriptionID,
  });

export const updateInstitution = (
  instituionId,
  institutionCapacity,
  institutionLicenseDate
) =>
  getAxiosInstance().put(`${ENV.server}/users/update-institution`, {
    instituionId,
    institutionCapacity,
    institutionLicenseDate,
  });

export const getOwnUsers = (search = "") =>
  getAxiosInstance().get(`${ENV.server}/users/own-users?search=${search}`);

export const getInscriptionCode = () =>
  getAxiosInstance().get(`${ENV.server}/users/inscription-code`);

export const subscribeToInstitution = (code) =>
  getAxiosInstance().post(`${ENV.server}/users/subscribe-to-institution`, {
    code,
  });
export const unlinkFromInstitution = (userId) =>
  getAxiosInstance().post(`${ENV.server}/users/unlink-from-institution`, {
    userId,
  });
export const updateOwnUserUnidades = (userId, boughtUpTo) =>
  getAxiosInstance().put(`${ENV.server}/users/update-unidades`, {
    userId,
    boughtUpTo,
  });

export const getUser = async () => {
  const { data } = await getAxiosInstance().get(`${ENV.server}/users/own`);
  const parsedData = JSON.parse(atob(data));
  return { data: parsedData };
};

export const requestExtraUnits = () =>
  getAxiosInstance().post(`${ENV.server}/users/request-extra-units`);
