import { format } from "date-fns";
import { he } from "date-fns/locale";

export const fullDateFormat = (data) => {
  return data ? format(new Date(data), "EEEE dd/MM/yy", { locale: he }) : null;
};

export const dateFormat = (data) => {
  return data ? format(new Date(data), "dd/MM/yy", { locale: he }) : null;
};

export const timeFormat = (data) => {
  return data ? format(new Date(data), "HH:mm", { locale: he }) : null;
};

export const toInputDateFormat = (data) => {
  return data ? format(new Date(data), "yyyy-MM-dd", { locale: he }) : "";
};

export const toInputDateTimeFormat = (data) => {
  return data
    ? format(new Date(data), "yyyy-MM-dd'T'HH:mm", { locale: he })
    : "";
};

export const getMonthYear = (data) => {
  return data ? format(new Date(data), "MM/yyyy", { locale: he }) : null;
};

export const hebrewDateFormat = (dateString) => {
  //המרה לתאריך עברי
  // המרת מחרוזת התאריך לאובייקט Date
  const newDate = new Date(dateString);
  if (isNaN(newDate.getTime())) {
    return "תאריך לא תקין";
  }

  const partialDateConversion = new Intl.DateTimeFormat("he-u-ca-hebrew", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(newDate); //המרת תאריך לועזי לעברי בלי שנה ויום בחודש
  const dateArr = partialDateConversion.split(" "); //פיצול התאריך למערך

  //המרת שנה לעברית
  let yearIndex = dateArr.length === 6 ? 5 : 4; //אינדקס של השנה במערך לפי שנה מעוברת או רגילה
  let loaziYear = dateArr[yearIndex]; //שנה עברית במספרים

  const hebrewLetters = {
    0: "",
    1: "א",
    2: "ב",
    3: "ג",
    4: "ד",
    5: "ה",
    6: "ו",
    7: "ז",
    8: "ח",
    9: "ט",
    10: "י",
    20: "כ",
    30: "ל",
    40: "מ",
    50: "נ",
    60: "ס",
    70: "ע",
    80: "פ",
    90: "צ",
    100: "ק",
    200: "ר",
    300: "ש",
    400: "ת",
  };

  const digits = [...loaziYear.toString()];
  const individualDigits = digits.map((digit) => Number(digit));
  //individualDigits Output: [5, 7, 8, 2]

  var thousands = Math.floor(individualDigits[0]); // אלפים
  var hundreds = Math.floor(individualDigits[1] * 100); // מאות
  var tens = Math.floor(individualDigits[2] * 10); // עשרות
  var units = individualDigits[3]; // אחדות

  if (hundreds > 400) {
    var firstDigit = 400;
    var secondDigit = hundreds - 400;
  }

  var hebrewYearString =
    hebrewLetters[thousands] +
    (hebrewLetters[hundreds] !== undefined
      ? hebrewLetters[hundreds]
      : hebrewLetters[firstDigit]) +
    hebrewLetters[secondDigit] +
    hebrewLetters[tens] +
    hebrewLetters[units];

  //hebrewYearString שנה מומרת לעברית

  //המרת יום לעברי
  let loaziDay = dateArr[2];
  const digitsDay = [...loaziDay.toString()];
  const digitsNum = digitsDay.map((digit) => Number(digit));
  //digitsNum Output: [2,2]

  let tensDay = Math.floor(digitsNum[0] * 10); // עשרות
  let unitsDay = digitsNum[digitsNum.length - 1]; // אחדות

  let hebrewDayString; //יום מומר לעברית

  // תנאי מיוחד עבור ט"ו וט"ז
  if (loaziDay === "15") {
    hebrewDayString = `ט"ו`;
  } else if (loaziDay === "16") {
    hebrewDayString = `ט"ז`;
  } else {
    // חישוב רגיל עבור ימים אחרים
    hebrewDayString =
      digitsNum.length > 1 && unitsDay !== 0
        ? hebrewLetters[tensDay] + `"` + hebrewLetters[unitsDay] // עשרות + אחדות
        : hebrewLetters[unitsDay === 0 ? tensDay : unitsDay] + `'`; // עשרות או אחדות עם גרש
  }

  dateArr[yearIndex] = hebrewYearString;
  dateArr[2] = hebrewDayString;
  const mergeDate = dateArr.join(" ");

  return mergeDate;
};
