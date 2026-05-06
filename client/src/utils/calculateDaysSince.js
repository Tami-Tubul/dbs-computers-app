// Calculates usage days (up to 2 hours overtime is still counted as 1 day)
const calculateDaysSince = (date) => {
  const currentDate = new Date();
  const pastDate = new Date(date);

  const timeDifference = currentDate - pastDate;

  const msPerDay = 1000 * 60 * 60 * 24;
  const msTwoHours = 1000 * 60 * 60 * 2;

  // full days since the past date
  const fullDays = Math.floor(timeDifference / msPerDay);

  // remaining milliseconds after accounting for full days
  const remainder = timeDifference % msPerDay;

  // if the remainder is less than or equal to 2 hours, we consider it as part of the last day
  if (remainder <= msTwoHours) {
    return Math.max(fullDays, 1); // at least 1 day if there's any time difference
  }

  // otherwise, we count the next day as well
  return fullDays + 1;
};

export default calculateDaysSince;
