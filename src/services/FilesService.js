import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getAudio = (audioName) =>
  getAxiosInstance().get(`${ENV.server}/audios/${audioName}`, {
    responseType: "blob",
  });

export const getImagen = (imagenName) =>
  getAxiosInstance().get(`${ENV.server}/imagenes/${imagenName}`, {
    responseType: "blob",
  });
