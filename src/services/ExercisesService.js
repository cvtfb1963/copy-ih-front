import { ENV } from "../../env";
import { getAxiosInstance } from "./AxiosService";

export const getCredentials = () =>
  getAxiosInstance().get(`${ENV.server}/exercises/credentials`);

export const getExercises = (from, limit) =>
  getAxiosInstance().get(`${ENV.server}/exercises?from=${from}&limit=${limit}`);

export const getOneExercise = async (index) =>
  getAxiosInstance().get(`${ENV.server}/exercises/${index}`);

export const getExercisesPorUnidad = () =>
  getAxiosInstance().get(`${ENV.server}/exercises/por-unidad`);

export const postExercise = (exercise) =>
  getAxiosInstance().post(`${ENV.server}/exercises`, exercise);

export const putExercise = (exercise) =>
  getAxiosInstance().put(`${ENV.server}/exercises`, exercise);

export const getOneByUnidadSkillNumber = (unidad, skill, number) =>
  getAxiosInstance().get(
    `${ENV.server}/exercises/find-one?unidad=${unidad}&skill=${skill}&number=${number}`
  );

export const removeExercise = (id) =>
  getAxiosInstance().delete(`${ENV.server}/exercises/delete/${id}`);

export const postUserGrade = (exerciseId, grade, unit) => {
  const data = {
    exerciseId,
    grade,
    unit,
  };

  const payload = btoa(JSON.stringify(data));

  return getAxiosInstance().post(`${ENV.server}/statistics/user-grade`, {
    payload,
  });
};

export const getUserPositions = (userId) =>
  getAxiosInstance().get(`${ENV.server}/statistics/position/user/${userId}`);

export const postUserPositions = (unidad, position) =>
  getAxiosInstance().post(`${ENV.server}/statistics/position`, {
    unidad,
    position,
  });

export const getUnidadIndice = (unidad) =>
  getAxiosInstance().get(`${ENV.server}/exercises/${unidad}/indice`);

export const getPesoTotalPorUnidadYSkill = (unidad, skill) =>
  getAxiosInstance().get(
    `${ENV.server}/exercises/unidad/${unidad}/peso?skill=${skill}`
  );
