import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posicionPorUnidad: null,
  unidadesData: null,
  unidadesStatus: {},
  boughtUpTo: null,
  current: {
    explanation: "",
    explanationOpen: false,
    attachedDocument: null,
    skill: null,
    title: null,
    grade: 0,
    gradeTotal: null,
    gradeOpen: false,
    exerciseId: null,
    verified: false,
    dontSaveGrade: false,
    binaria: false,
    numeroUnidad: null,
    displayUnidad: null,
    tituloUnidad: null,
    canContinue: false,
    vocabulary: {
      unidad: -1,
      dictionaries: [],
    },
    vocabularyOpen: false,
  },
  credentials: {},
  token: null,
  user: null,
  unidadIndice: null,
};

export const datosSlice = createSlice({
  name: "datos",
  initialState,
  reducers: {
    setPosicionPorUnidad: (state, action) => {
      state.posicionPorUnidad = {
        ...state.posicionPorUnidad,
        ...action.payload,
      };
    },
    setCanContinue: (state, action) => {
      state.current.canContinue = action.payload;
    },
    setUnidadesData: (state, action) => {
      state.unidadesData = action.payload;
    },
    setUnidadStatus: (state, action) => {
      state.unidadesStatus = {
        ...state.unidadesStatus,
        ...action.payload,
      };
    },
    setBoughtUpTo: (state, action) => {
      state.boughtUpTo = action.payload;
    },
    setCurrent: (state, action) => {
      state.current = { ...state.current, ...action.payload };
    },
    setVerified: (state, action) => {
      state.current.verified = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setCurrentSkill: (state, action) => {
      state.current.skill = action.payload;
    },
    setCurrentTitle: (state, action) => {
      state.current.title = action.payload;
    },
    setCurrentattachedDocument: (state, action) => {
      state.current.attachedDocument = action.payload;
    },
    setCloudData: (state, action) => {
      state.credentials = action.payload;
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setUnidadIndice: (state, action) => {
      state.unidadIndice = action.payload;
    },
    setVocabulary: (state, action) => {
      state.current.vocabulary = { ...action.payload };
    },
    setVocabularyOpen: (state, action) => {
      state.current.vocabularyOpen = action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    cleanData: (state, action) => {
      // eslint-disable-next-line no-unused-vars
      state = { ...initialState };
    },
  },
});

export const {
  setUnidadIndice,
  setPosicionPorUnidad,
  setUnidadesData,
  setUnidadStatus,
  setBoughtUpTo,
  setCurrent,
  setVerified,
  setToken,
  setCloudData,
  setCanContinue,
  setUser,
  cleanData,
  setCurrentTitle,
  setCurrentattachedDocument,
  setCurrentSkill,
  setVocabulary,
  setVocabularyOpen,
} = datosSlice.actions;
export default datosSlice.reducer;
