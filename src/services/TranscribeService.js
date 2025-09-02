import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const sendAudioToTranscribe = (formData) =>
  getAxiosInstance().post(`${ENV.server}/transcribe`, formData);
