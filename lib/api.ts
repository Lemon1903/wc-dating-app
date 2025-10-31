import axios from "axios";
import { signIn, signOut } from "next-auth/react";

import { UserLoginSchema } from "@/lib/form-schemas/login-schema";
import { UserRegistrationSchema } from "@/lib/form-schemas/register-schema";
import { CreateInteractionSchema } from "@/lib/validators/like";
import { CreateUserSchema } from "@/lib/validators/user";
import { uploadProfilePhotos } from "@/services/uploadService";
import { Conversation, Match, Message, Profile, ResponseResult } from "@/types";

export const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export async function signInUser(values: UserLoginSchema) {
  return await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  });
}

export async function signOutUser() {
  await signOut({ callbackUrl: "/login" });
}

export async function registerUser(userData: UserRegistrationSchema) {
  // Convert birthday object to ISO date string
  const month = parseInt(userData.birthday.month, 10);
  const day = parseInt(userData.birthday.day, 10);
  const year = parseInt(userData.birthday.year, 10);
  const birthDate = new Date(year, month - 1, day).toISOString();

  // Upload profile photos to Supabase storage
  const response = await uploadProfilePhotos(userData.profilePhotos);
  if (response.error) {
    throw new Error(`Failed to upload profile photos: ${response.error}`);
  }

  // If no photos were uploaded, use a default placeholder
  const profilePhotoUrls = response.data ?? [];

  const apiData: CreateUserSchema = {
    ...userData,
    birthday: birthDate,
    profilePhotos: profilePhotoUrls,
  };

  try {
    const response = await axiosClient.post<ResponseResult<Profile>>(`/auth/register`, apiData);
    if (response.data.error) {
      throw new Error(
        typeof response.data.error === "string" ? response.data.error : "Validation error",
      );
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function discoverPeople() {
  try {
    const response = await axiosClient.get<ResponseResult<Profile[]>>(`/discover`);
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function getMatches() {
  try {
    const response = await axiosClient.get<ResponseResult<Match[]>>(`/matches`);
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function createInteraction(interactionData: CreateInteractionSchema) {
  try {
    const response = await axiosClient.post<
      ResponseResult<{ likeId: string; matchId: string | null }>
    >(`/interactions`, interactionData);
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const response = await axiosClient.get<ResponseResult<Profile>>(`/profile/${userId}`);
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function updateUserProfile(userId: string, updateData: Partial<Pick<Profile, "name" | "bio" | "profilePhotos">>) {
  try {
    const response = await axiosClient.put<ResponseResult<Profile>>(`/profile/${userId}`, updateData);
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function getConversations() {
  try {
    const response = await axiosClient.get<ResponseResult<Conversation[]>>(`/conversations`);
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function startConversation(userBId: string) {
  try {
    const response = await axiosClient.post<ResponseResult<Conversation>>(`/conversations`, {
      otherUserId: userBId,
    });
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function getMessages(conversationId: string) {
  try {
    const response = await axiosClient.get<ResponseResult<Message[]>>(
      `/messages/${conversationId}`,
    );
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}

export async function sendMessage(conversationId: string, text: string) {
  try {
    const response = await axiosClient.post<ResponseResult<Message>>(
      `/messages/${conversationId}`,
      {
        text,
      },
    );
    if (response.data.error) {
      throw new Error(typeof response.data.error === "string" ? response.data.error : "API error");
    }
    return response.data.data!;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const apiError = error.response.data.error;
      throw new Error(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
    }
    throw error;
  }
}
