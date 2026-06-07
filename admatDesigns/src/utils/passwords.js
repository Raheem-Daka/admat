// ✅ Password Strength Checker

export const getPasswordStrength = (password) => {
  const pwd = password || "";
  let score = 0;

  if (!pwd) return { label: "", color: "", width: "0%" };

  if (pwd.length >= 8) score++;           // ✅ stronger minimum
  if (/[a-z]/.test(pwd)) score++;         // ✅ lowercase
  if (/[A-Z]/.test(pwd)) score++;         // ✅ uppercase
  if (/[0-9]/.test(pwd)) score++;         // ✅ number
  if (/[^A-Za-z0-9]/.test(pwd)) score++;  // ✅ special

  switch (score) {
    case 1:
      return { label: "Weak", color: "bg-red-500", width: "20%" };
    case 2:
      return { label: "Fair", color: "bg-yellow-500", width: "40%" };
    case 3:
      return { label: "Good", color: "bg-blue-500", width: "60%" };
    case 4:
      return { label: "Strong", color: "bg-green-500", width: "80%" };
    case 5:
      return { label: "Very Strong 💪", color: "bg-green-700", width: "100%" };
    default:
      return { label: "", color: "", width: "0%" };
  }
};

// ✅ Password Generator
export const generatePassword = (length = 12) => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const all = lower + upper + numbers + symbols;

  let password = "";

  // ensure strong base
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // fill rest
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // shuffle
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export const getPasswordRules = (password) => {
  const pwd = password || ""; // ✅ fallback

  return {
    length: pwd.length >= 6,
    upper: /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
};