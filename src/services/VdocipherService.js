import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getVideoCredentials = (videoId) =>
  getAxiosInstance().get(`${ENV.server}/vdocipher/${videoId}`);
