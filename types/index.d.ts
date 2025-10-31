import { ZodIssue } from "zod/v4";

type Gender = "male" | "female";

type User = {
  id: string;
  email: string;
  name: string;
  birthday: Date;
  bio: string;
  gender: Gender;
  profilePhotos: string[];
  password: string;
  createdAt: Date;
};

type Profile = Omit<User, "password" | "createdAt">;

type Match = {
  id: string;
  otherUser: Profile;
  createdAt: Date;
};

type Conversation = {
  id: string;
  otherUser: Profile;
  messages: Message[];
  isActive: boolean;
  createdAt: Date;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date;
};

type ResponseResult<T> = {
  data?: T;
  error?: string | ZodIssue[];
};
