import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generationToken(
  info,
  expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN
) {
  const newInfo = {
    ...info,
    data: new Date(),
  };
  const token = jwt.sign(newInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
  return token;
}

export default generationToken;
