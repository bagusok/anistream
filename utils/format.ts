export const dateFormat = (dateIso: Date) => {
  return new Date(dateIso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
