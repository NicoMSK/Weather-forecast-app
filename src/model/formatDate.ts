export function formatDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const month = new Intl.DateTimeFormat("ru", { month: "short" })
    .format(date)
    .replace(".", "");
  const day = new Intl.DateTimeFormat("ru", { day: "numeric" }).format(date);
  const weekday = new Intl.DateTimeFormat("ru", { weekday: "short" }).format(
    date
  );

  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${
    weekday.charAt(0).toUpperCase() + weekday.slice(1)
  }`;
}
