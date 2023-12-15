import { getCollectionReference } from "@/firebase";
import bcrypt from "bcrypt";
export type Data = DataBase["Students"];
export async function createStudent(data: Data, password: string) {
  const userDoc = await getCollectionReference("Students").add(data);
  const [passwordHash, passwordSalt] = generatePasswordHashSalt(password);

  await getCollectionReference("AuthStudent").doc(userDoc.id).set({
    passwordHash,
    passwordSalt,
  });
  return userDoc;
}
export function generatePasswordHashSalt(password: string) {
  const passwordSalt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, passwordSalt);
  return [passwordHash, passwordSalt];
}
