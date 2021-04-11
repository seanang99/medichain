export const formatDateString = (str) => {
  const options = {
    day: "numeric",
    month: "long",
  };
  const date = new Date(str);
  return date.toLocaleDateString("en-SG", options);
};
