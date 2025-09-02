import { stringSimilarity } from "string-similarity-js";

export const checkAnswer = (...params) => {
  let answer = params[0];
  const corrects = params.slice(1, params.length - 1);
  const exerciseType = params[params.length - 1];

  const SIMILARITY_TYPES = [];
  if (SIMILARITY_TYPES.includes(exerciseType))
    return checkSimilarityAnswer(...params);

  const RELATIVE_WEIGHTS_TYPES = [15, 23, 31];
  if (RELATIVE_WEIGHTS_TYPES.includes(exerciseType))
    return checkAnswerWithRelativeWeigths(...params);

  if (
    [6, 29].includes(exerciseType) &&
    localStorage.getItem("peso_sujeto_verbo_complemento")
  )
    return checkAnswersEspecialTipo6(...params);

  return corrects.some((correct) => compareTwo(answer, correct));
};

const checkAnswerWithRelativeWeigths = (...params) => {
  let answer = params[0];
  const corrects = params.slice(1, params.length - 1);

  return Math.max(
    ...corrects.map((correct) =>
      compareTwoWithWeights(
        String(answer)
          .toLowerCase()
          .replaceAll(/[!?.,]/g, "")
          .replaceAll(regex, normalizeContractions)
          .replaceAll("  ", " "),
        String(correct)
          .toLowerCase()
          .replaceAll(/[!?.,]/g, "")
          .replaceAll(regex, normalizeContractions)
          .replaceAll("  ", " "),
        correct !== undefined &&
          String(correct)
            .toLowerCase()
            .replaceAll(/[!?.,]/g, "")
            .replaceAll(regex, normalizeContractions)
            .replaceAll("  ", " ")
            .split(" ")
            .map((_, i, arr) => Number(1 / arr.length))
      )
    )
  );
};

const checkAnswersEspecialTipo6 = (...params) => {
  let answer = params[0];

  if (typeof answer === "string") {
    answer = answer
      .toLowerCase()
      .replaceAll(/[^\w\s\d']/g, "")
      .replaceAll(regex, normalizeContractions)
      .replaceAll("  ", " ")
      .trim();
  }

  const corrects = params.slice(1, params.length - 1);

  return Math.max(
    ...corrects.map((correct) =>
      compareEspecialAnswerTipo6({
        respuesta: answer,
        wh: correct.wh,
        adverbio: correct.adverbio,
        aux: correct.aux,
        sujeto: correct.sujeto,
        verbo: correct.verbo,
        complemento: correct.complemento,
      })
    )
  );
};

const normForT6 = (string) =>
  string
    ? Array.isArray(string)
      ? string.map((x) => normForT6(x))
      : String(string)
          .replaceAll(regex, normalizeContractions)
          .replaceAll("  ", " ")
    : undefined;

const compareEspecialAnswerTipo6 = ({
  respuesta,
  wh,
  adverbio,
  aux,
  sujeto,
  verbo,
  complemento,
}) => {
  if (!sujeto || !verbo || !complemento || !respuesta) return 0;
  let total = 0;

  respuesta = normForT6(respuesta);
  wh = normForT6(wh);
  adverbio = normForT6(adverbio);
  aux = normForT6(aux);
  sujeto = normForT6(sujeto);
  verbo = normForT6(verbo);
  complemento = normForT6(complemento);

  const palabrasRespuesta = respuesta.split(" ");

  const type = localStorage.getItem("peso_sujeto_verbo_complemento");
  const isPreguntaBe = type === "be";
  const isPreguntaGeneral = type === "general";
  const isNormalSentence =
    !isPreguntaBe &&
    !isPreguntaGeneral &&
    !wh &&
    !aux &&
    !adverbio &&
    sujeto &&
    verbo &&
    complemento;
  const isAdverbioSentence =
    !isPreguntaBe && !isNormalSentence && !isPreguntaGeneral && adverbio;

  if (isNormalSentence)
    total = sumNormalT6({
      palabrasRespuesta,
      sujeto,
      verbo,
      complemento,
    });
  else if (isPreguntaBe)
    total = sumWhBeT6({
      palabrasRespuesta,
      wh,
      sujeto,
      verbo,
      complemento,
    });
  else if (isPreguntaGeneral)
    total = sumWhGeneralT6({
      palabrasRespuesta,
      wh,
      aux,
      sujeto,
      verbo,
      complemento,
    });
  else if (isAdverbioSentence)
    total = sumAdverbioT6({
      palabrasRespuesta,
      adverbio,
      sujeto,
      verbo,
      complemento,
    });
  else {
    alert("ERROR: tipo 6 no entró en ninguno de los 3 modelos.");
    return 0;
  }

  if (palabrasRespuesta.length > 0) {
    const complementoLenght = Array.isArray(complemento)
      ? complemento.join(" ").split(" ").length
      : complemento.split(" ").length;
    const differenceCount = palabrasRespuesta.length;
    const differenceValue = 0.25 / complementoLenght;
    total -= differenceValue * differenceCount;
  }

  return total > 0 ? total : 0;
};

const sumNormalT6 = ({ palabrasRespuesta, sujeto, verbo, complemento }) => {
  //pesos               30%     45%      25%
  //correct example: [sujeto, verbo, complemento]

  //Excepcion: cuando el ejercicio es de vocabulario, los pesos son:
  //pesos               20%     40%      40%

  let total = 0;

  const isVocabularyExercise =
    localStorage.getItem("is_vocabulary_exercise") === "true";

  //valoracion de sujeto

  if (sujeto === "N/A") total += isVocabularyExercise ? 0.2 : 0.3;
  else {
    const sujetoPuntaje = obtenerResultadoParteTipo6(
      sujeto,
      palabrasRespuesta,
      isVocabularyExercise ? 0.2 : 0.3
    );
    total += sujetoPuntaje;
  }
  if (palabrasRespuesta.length === 0) return total;
  //valoracion de sujeto

  //valoracion de verbo
  const verboPuntaje = obtenerResultadoParteTipo6(
    verbo,
    palabrasRespuesta,
    isVocabularyExercise ? 0.4 : 0.45
  );
  total += verboPuntaje;
  if (palabrasRespuesta.length === 0) {
    if (complemento === "N/A") total += isVocabularyExercise ? 0.4 : 0.25;
    return total;
  }
  //valoracion de verbo

  //valoracion de complemento
  const complementoPuntaje = obtenerResultadoParteTipo6(
    complemento,
    palabrasRespuesta,
    isVocabularyExercise ? 0.4 : 0.25
  );
  total += complementoPuntaje;
  //valoracion de complemento

  return total;
};

const sumAdverbioT6 = ({
  palabrasRespuesta,
  adverbio,
  sujeto,
  verbo,
  complemento,
}) => {
  //pesos                5%       30%     45%      20%
  //correct example: [adverbio, sujeto, verbo, complemento]

  let total = 0;

  //valoracion de adverbio
  const adverbioPuntaje = obtenerResultadoParteTipo6(
    adverbio,
    palabrasRespuesta,
    0.05
  );
  total += adverbioPuntaje;
  if (palabrasRespuesta.length === 0) return total;
  //valoracion de adverbio

  //valoracion de sujeto
  if (sujeto === "N/A") total += 0.3;
  else {
    const sujetoPuntaje = obtenerResultadoParteTipo6(
      sujeto,
      palabrasRespuesta,
      0.3
    );
    total += sujetoPuntaje;
  }
  if (palabrasRespuesta.length === 0) return total;
  //valoracion de sujeto

  //valoracion de verbo
  const verboPuntaje = obtenerResultadoParteTipo6(
    verbo,
    palabrasRespuesta,
    0.45
  );
  total += verboPuntaje;
  if (palabrasRespuesta.length === 0) {
    if (complemento === "N/A") total += 0.2;
    return total;
  }
  //valoracion de verbo

  //valoracion de complemento
  const complementoPuntaje = obtenerResultadoParteTipo6(
    complemento,
    palabrasRespuesta,
    0.2
  );
  total += complementoPuntaje;
  //valoracion de complemento

  return total;
};

const sumWhBeT6 = ({ palabrasRespuesta, wh, sujeto, verbo, complemento }) => {
  //pesos             5%   45%     30%      20%
  //correct example: [wh, verbo, sujeto, complemento]

  let total = 0;

  //valoracion de wh
  if (wh) {
    const whPuntaje = obtenerResultadoParteTipo6(wh, palabrasRespuesta, 0.05);
    total += whPuntaje;
    if (palabrasRespuesta.length === 0) return total;
  }
  //valoracion de wh

  //valoracion de verbo
  const verboPuntaje = obtenerResultadoParteTipo6(
    verbo,
    palabrasRespuesta,
    0.45
  );
  total += verboPuntaje;
  if (palabrasRespuesta.length === 0) return total;
  //valoracion de verbo

  //valoracion de sujeto
  if (sujeto === "N/A") total += 0.3;
  else {
    const sujetoPuntaje = obtenerResultadoParteTipo6(
      sujeto,
      palabrasRespuesta,
      0.3
    );
    total += sujetoPuntaje;
  }
  if (palabrasRespuesta.length === 0) {
    if (complemento === "N/A") total += wh ? 0.2 : 0.25;
    return total;
  }
  //valoracion de sujeto

  //valoracion de complemento
  const complementoPuntaje = obtenerResultadoParteTipo6(
    complemento,
    palabrasRespuesta,
    wh ? 0.2 : 0.25
  );
  total += complementoPuntaje;
  //valoracion de complemento

  return total;
};

const sumWhGeneralT6 = ({
  palabrasRespuesta,
  wh,
  aux,
  sujeto,
  verbo,
  complemento,
}) => {
  //pesos             5%  20%    30%    25%       20%
  //correct example: [wh, aux, sujeto, verbo, complemento]

  let total = 0;

  //valoracion de wh
  if (wh) {
    const whPuntaje = obtenerResultadoParteTipo6(wh, palabrasRespuesta, 0.05);
    total += whPuntaje;
    if (palabrasRespuesta.length === 0) return total;
  }
  //valoracion de wh

  //valoracion de aux
  const auxPuntaje = obtenerResultadoParteTipo6(aux, palabrasRespuesta, 0.2);
  total += auxPuntaje;
  if (palabrasRespuesta.length === 0) return total;
  //valoracion de aux

  //valoracion de sujeto
  if (sujeto === "N/A") total += 0.3;
  else {
    const sujetoPuntaje = obtenerResultadoParteTipo6(
      sujeto,
      palabrasRespuesta,
      0.3
    );
    total += sujetoPuntaje;
  }
  if (palabrasRespuesta.length === 0) return total;
  //valoracion de sujeto

  //valoracion de verbo
  const verboPuntaje = obtenerResultadoParteTipo6(
    verbo,
    palabrasRespuesta,
    0.25
  );
  total += verboPuntaje;
  if (palabrasRespuesta.length === 0) {
    if (complemento === "N/A") total += wh ? 0.2 : 0.25;
    return total;
  }
  //valoracion de verbo

  //valoracion de complemento
  const complementoPuntaje = obtenerResultadoParteTipo6(
    complemento,
    palabrasRespuesta,
    wh ? 0.2 : 0.25
  );
  total += complementoPuntaje;
  //valoracion de complemento

  return total;
};

const obtenerResultadoParteTipo6 = (parteCorrecta, answerWordsArray, peso) => {
  const parteWordsCount = Array.isArray(parteCorrecta)
    ? parteCorrecta.join(" ").split(" ").length
    : parteCorrecta.split(" ").length;

  let parteRecibida;
  if (answerWordsArray.length >= parteWordsCount) {
    parteRecibida = answerWordsArray.splice(0, parteWordsCount).join(" ");
  } else
    parteRecibida = answerWordsArray
      .splice(0, answerWordsArray.length)
      .join(" ");

  return (
    compareTwo(parteRecibida, parteCorrecta, {
      relativeGrade: true,
      normForT6: true,
    }) * peso
  );
};

const checkSimilarityAnswer = (...params) => {
  let answer = params[0];
  const corrects = params.slice(1, params.length - 1);

  return Math.max(
    ...corrects.map((correct) => compareTwo(answer, correct, true))
  );
};

const compareTwoWithWeights = (answer, correct, pesos) => {
  pesos = String(pesos)
    .split(",")
    .map((x) => Number(x));

  if (
    pesos.length === 0 ||
    isNaN(pesos[0]) ||
    pesos.length !== correct.split(" ").length
  )
    return 0;

  let total = 0;

  const correctParts = correct.split(" ");
  const answerParts = answer
    .split(" ")
    .filter((part) => part && part !== "" && part !== " ");

  for (let i = 0; i < correctParts.length; i++) {
    const part = correctParts[i];

    if (answerParts.length <= i) break;

    if (compareTwo(answerParts[i], part)) total += pesos[i];
  }

  if (answerParts.length > correctParts.length) {
    const difference = answerParts.length - correctParts.length;
    const differenceValue = 1 / answerParts.length;
    total -= differenceValue * difference;
  }

  return total > 0 ? total : 0;
};

const compareTwo = (answer, correct, config) => {
  //config {similarity: boolean, relativeGrade: boolean}
  const responseShouldBeNumeric = config?.similarity || config?.relativeGrade;
  if (correct === undefined || correct === null)
    return responseShouldBeNumeric ? 0 : false;
  if (Array.isArray(correct))
    return checkWithPermutacion(answer, correct, config);

  if (answer === null) return responseShouldBeNumeric ? 0 : false;
  if (answer === correct) return responseShouldBeNumeric ? 1 : true;
  answer = String(answer)
    .toLowerCase()
    .replaceAll(/[^\w\s\d']/g, "");
  correct = String(correct)
    .toLowerCase()
    .replaceAll(/[^\w\s\d']/g, "");

  if (answer === correct) return responseShouldBeNumeric ? 1 : true;

  const normalizedSentence1 = answer
    .toLowerCase()
    .replaceAll(regex, normalizeContractions)
    .replaceAll(" ", "");
  const normalizedSentence2 = correct
    .toLowerCase()
    .replaceAll(regex, normalizeContractions)
    .replaceAll(" ", "");

  if (config?.similarity)
    return Math.max(
      stringSimilarity(
        normalizedSentence1.replaceAll("'d", "would"),
        normalizedSentence2.replaceAll("'d", "would")
      ),
      stringSimilarity(
        normalizedSentence1.replaceAll("'d", "had"),
        normalizedSentence2.replaceAll("'d", "had")
      )
    );

  if (config?.relativeGrade)
    return checkAnswerWithRelativeWeigths(answer, correct, null);

  return (
    normalizedSentence1 === normalizedSentence2 ||
    normalizedSentence1.replaceAll("'d", "would") ===
      normalizedSentence2.replaceAll("'d", "would") ||
    normalizedSentence1.replaceAll("'d", "had") ===
      normalizedSentence2.replaceAll("'d", "had")
  );
};

export const checkWithPermutacion = (answer, correct, config) => {
  const responseShouldBeNumeric = config?.similarity || config?.relativeGrade;

  if (!responseShouldBeNumeric)
    return permutar(correct).some((permutacion) =>
      compareTwo(answer, permutacion)
    );

  const isSpecialTipo6 = localStorage.getItem("peso_sujeto_verbo_complemento");

  return Math.max(
    ...permutar(isSpecialTipo6 ? [correct] : correct).map((permutacion) =>
      compareTwo(answer, permutacion, config)
    )
  );
};

const contractionsMap = {
  "'m": "am",
  "'s": "is",
  "'re": "are",
  "'ve": "have",
  "'ll": "will",
  "i'm": "i am",
  "i'll": "i will",
  "i won't": "i will not",
  "iwon't": "i will not",
  "you're": "you are",
  "you've": "you have",
  "you'll": "you will",
  "you won't": "you will not",
  "he's": "he is",
  "he'll": "he will",
  "he won't": "he will not",
  "hewon't": "he will not",
  "she's": "she is",
  "she'll": "she will",
  "shewon't": "she will not",
  "it's": "it is",
  "it'll": "it will",
  "itwon't": "it will not",
  "we're": "we are",
  "we've": "we have",
  "we'll": "we will",
  "wewon't": "we will not",
  "they're": "they are",
  "they've": "they have",
  "they'll": "they will",
  "theywon't": "they will not",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "can't": "can not",
  "won't've": "will not have",
  "won't": "will not",
  "could've": "could have",
  "couldn't": "could not",
  "would've": "would have",
  "wouldn't": "would not",
  "will've": "will have",
  "shall've": "shall have",
  "should've": "should have",
  "shouldn't": "should not",
  "might've": "might have",
  "may've": "may have",
  "may not": "may not",
  "must've": "must have",
  "must not": "must not",
  "that's": "that is",
  "who's": "who is",
  "what's": "what is",
  "where's": "where is",
  "when's": "when is",
  "why's": "why is",
  "how's": "how is",
  "weren't": "were not",
  "wasn't": "was not",
  "isn't": "is not",
  "aren't": "are not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
};

const regex = new RegExp(`(${Object.keys(contractionsMap).join("|")})`, "gi");

const normalizeContractions = (match) =>
  contractionsMap[match.toLowerCase()] || match;

const permutar = (arr) => {
  if (arr.filter((x) => Array.isArray(x)).length > 1)
    throw new Error("Solo puede haber 1 arreglo permutable en la respuesta");

  function generatePermutation(arr) {
    let resultArr = [];
    if (arr.length === 0) return [];
    if (arr.length === 1) return [arr];

    for (let i = 0; i < arr.length; i++) {
      const currentElement = arr[i];

      const otherElements = arr.slice(0, i).concat(arr.slice(i + 1));
      const swappedPermutation = generatePermutation(otherElements);

      for (let j = 0; j < swappedPermutation.length; j++) {
        const finalSwappedPermutation = [currentElement].concat(
          swappedPermutation[j]
        );

        resultArr.push(finalSwappedPermutation);
      }
    }

    return resultArr;
  }

  let toPermutIndex = arr.findIndex((x) => Array.isArray(x));
  if (toPermutIndex === -1) return [arr.map((x) => x.trim()).join(" ")];

  const permutations = generatePermutation(arr[toPermutIndex]).map(
    (permutation) => permutation.join(" ")
  );

  const res = [];

  for (let i = 0; i < permutations.length; i++) {
    res.push(
      arr
        .map((part) => (Array.isArray(part) ? permutations[i] : part))
        .join(" ")
    );
  }

  return res;
};

export const getPlainValue = (answer) =>
  Array.isArray(answer) ? getFirstPermutacion(answer) : answer;

const getFirstPermutacion = (arr) => permutar(arr)[0];
