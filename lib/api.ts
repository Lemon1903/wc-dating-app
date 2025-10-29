import axios from "axios";

import { User } from "@/lib/db/schema";
import { UserRegistrationSchema } from "@/lib/schemas/register-schema";
import { ResponseResult } from "@/types";

export const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export async function registerUser(userData: UserRegistrationSchema) {
  // Convert birthday object to ISO date string
  const month = parseInt(userData.birthday.month, 10);
  const day = parseInt(userData.birthday.day, 10);
  const year = parseInt(userData.birthday.year, 10);
  const birthDate = new Date(year, month - 1, day).toISOString();

  const apiData = {
    ...userData,
    birthday: birthDate,
  };

  const response = await axiosClient.post<ResponseResult<User>>(`/users`, apiData);

  return response.data;
}
