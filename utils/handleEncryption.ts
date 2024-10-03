import bcrypt from "bcryptjs";

const secretKey = "quizz-aes";

export const handlePasswordEncryption = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export const handlePasswordDecryption = (
  password: string,
  hashedPassword: string
) => bcrypt.compareSync(password, hashedPassword);
