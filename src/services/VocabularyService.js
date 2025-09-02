import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getVocabularyByUnit = (unit) =>
  getAxiosInstance().get(`${ENV.server}/vocabulary/${unit}`);

export const getVocabularyFromJSONs = (unit, type, level, page) => {

  let query = "?";

  if (unit !== "all") query += `&unidad=${unit}`;
  if (type !== "all") query += `&vocabularyType=${type}`;
  if (level !== "all") query += `&vocabularyLevel=${level}`;
  if (page) query += `&page=${page}`;

  return getAxiosInstance().get(`${ENV.server}/vocabulary/from-jsons${query}`);
}
