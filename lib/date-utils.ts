export interface Birthday {
  month: string;
  day: string;
  year: string;
}

export function validateBirthday(birthday: Birthday): boolean {
  const month = parseInt(birthday.month, 10);
  const day = parseInt(birthday.day, 10);
  const year = parseInt(birthday.year, 10);

  // Check if valid month
  if (isNaN(month) || month < 1 || month > 12) {
    return false;
  }

  // Check if valid day
  const daysInMonth = new Date(year, month, 0).getDate();
  if (isNaN(day) || day < 1 || day > daysInMonth) {
    return false;
  }

  // Check if valid year
  if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
    return false;
  }

  const age = calculateAge(new Date(year, month - 1, day));
  return age >= 18;
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
