// Generic helpers to manipluate data objects etc

export const dateString = (date) => {
    // Used by the date part of a date item ... will return the YYYY-MM-YY bit of a date
    return !!date ? date.toString().slice(0, 10) : null;
  };

export const timeString = (date) => {
    // Used by the time part of a date item .. will return the HH:MI bit of a date
    return !!date ? date.toString().slice(11, 16) : null;
  };

export const hourString = (date) => {
    // Used by the time part of a date item .. will return the HH bit of a date
      return !!date ? date.toString().slice(11,13) : 12 
  };