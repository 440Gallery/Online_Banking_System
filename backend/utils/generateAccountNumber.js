export const generateAccountNumber = () => {
  // Generates a 12-digit random account number
  const prefix = '987'; // Bank code prefix
  const randomStr = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `${prefix}${randomStr}`;
};
