import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getStatisticsLastUpdatedTime = () =>
  getAxiosInstance().get(`${ENV.server}/statistics/last-updated-time`);

export const executeStatisticsJob = () =>
  getAxiosInstance().post(`${ENV.server}/statistics/execute-job`);

export const getOwnGlobalStatistics = () =>
  getAxiosInstance().get(`${ENV.server}/statistics/global/own`);

export const getOwnUnidadStatistics = (unidad) =>
  getAxiosInstance().get(`${ENV.server}/statistics/${unidad}/own`);

export const getUserGlobalStatistics = (userId) =>
  getAxiosInstance().get(`${ENV.server}/statistics/global/user/${userId}`);

export const getUserUnitStatistics = (userId, unidad) =>
  getAxiosInstance().get(`${ENV.server}/statistics/${unidad}/user/${userId}`);

export const getInstitutionUserGlobalStatistics = (userId) =>
  getAxiosInstance().get(
    `${ENV.server}/statistics/institution/global/user/${userId}`
  );

export const getInstitutionUserUnitStatistics = (userId, unidad) =>
  getAxiosInstance().get(
    `${ENV.server}/statistics/institution/${unidad}/user/${userId}`
  );

export const getGlobalTop10 = () =>
  getAxiosInstance().get(`${ENV.server}/statistics/global/top-10`);

export const getDataForLinearChart = () =>
  getAxiosInstance().get(`${ENV.server}/statistics/global/unidades`);
