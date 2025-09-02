import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getMaintenanceWindow = () =>
  getAxiosInstance().get(`${ENV.server}/maintenance/window`);

export const createMaintenanceWindow = (window) =>
  getAxiosInstance().post(`${ENV.server}/maintenance/window`, window);

export const cancelMaintenanceWindow = () =>
  getAxiosInstance().delete(`${ENV.server}/maintenance/window`);
