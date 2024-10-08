export const dateFormat = (dateIso: Date) => {
  try {
    return new Date(dateIso).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return null;
  }
};

export const dateFormatAgo = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else if (diffInWeeks < 5) {
    return `${diffInWeeks} minggu yang lalu`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  } else {
    return `${diffInYears} tahun yang lalu`;
  }
};

export function secondToMinutes(seconds: number): string {
  // Menghitung menit dan detik
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  // Menambahkan leading zero untuk menit dan detik jika kurang dari 10
  const minutesString = mins.toString().padStart(2, "0");
  const secondsString = secs.toString().padStart(2, "0");

  return `${minutesString}:${secondsString}`;
}

export function formatLike(num: number = 0): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.00$/, "") + "K";
  } else {
    return num.toString();
  }
}
