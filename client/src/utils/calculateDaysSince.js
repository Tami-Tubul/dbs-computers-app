const calculateDaysSince = (date) => {
  const currentDate = new Date();
  const pastDate = new Date(date);

  // calculate the time difference between the dates (in milliseconds)
  const timeDifference = currentDate - pastDate;

  // Convert the difference to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
};

export default calculateDaysSince;
