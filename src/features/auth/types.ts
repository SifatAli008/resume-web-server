export type SignupFieldKey =
  | "businessLocation"
  | "fullName"
  | "email"
  | "password";

export type SignupFieldErrors = Partial<Record<SignupFieldKey, string>>;

export type SignupPayload = {
  businessLocation: string;
  fullName: string;
  email: string;
  password: string;
};

export type LoginFieldKey = "email" | "password";

export type LoginFieldErrors = Partial<Record<LoginFieldKey, string>>;

export type LoginPayload = {
  email: string;
  password: string;
};
