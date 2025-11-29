export const formatDate = (dateString: Date): string => {
  const date: Date = new Date(dateString);

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
