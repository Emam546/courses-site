import type { RegisterRequestData } from "@/user";
import { faker } from "@faker-js/faker";
export function createUserSignupData(
  teacherId: string,
  levelId: string,
): RegisterRequestData {
  return {
    displayName: faker.internet.displayName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    levelId: levelId,
    teacherId,
  };
}
