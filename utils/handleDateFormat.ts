export const handleDateFormat = (isoString: string) => {
  const date = new Date(isoString);
  const readableDate = date.toLocaleDateString();
  const readableTime = date.toLocaleTimeString();

  return `${readableDate}, ${readableTime}`;
};
