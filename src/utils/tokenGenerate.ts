import jwt from "jsonwebtoken";

export const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, "abcde", {
    expiresIn: "7d",
  });
};
