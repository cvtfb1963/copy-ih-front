import moment from "moment-timezone";

export const getAvatarName = (fullName) => {
  if (!fullName)
    console.error("Cannot invoice getAvatarName without a name as argument");
  const names = fullName.split(" ");
  let avatar = names[0].substring(0, 1);
  if (names.length > 1) {
    avatar += names[names.length - 1].substring(0, 1);
  }
  return avatar;
};

export const getName = (fullName) => {
  if (!fullName)
    console.error("Cannot invoice getName without a name as argument");
  return fullName.split(" ")[0];
};

export function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export function getFormatedDateTime(date) {
  return `${moment(date).format("DD/MM/YYYY")} a las ${moment(date)
    .get("hours")
    .toString()
    .padStart(2, "0")}:${moment(date)
    .get("minute")
    .toString()
    .padStart(2, "0")}`;
}

export function getBillingFrequencyCaption(frequency) {
  const CAPTIONS = {
    DAY: "Diariamente",
    WEEK: "Semanalmente",
    MONTH: "Mensualmente",
    YEAR: "Anualmente",
  };
  return CAPTIONS[frequency];
}

export const getFireInTheHoleLink = (plan_id) =>
  `${window.location.origin}/fith/${plan_id}`;

export const formatNumber = (num) => new Intl.NumberFormat("de-DE").format(num);
