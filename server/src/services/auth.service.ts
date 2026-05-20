import { supabase } from "../config/supabase.js";

export const registerUser = async (
  email: string,
  password: string
) => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { user: data.user, session: data.session };
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getCurrentUser = async (
  token: string
) => {

  const { data, error } =
    await supabase.auth.getUser(token);

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};
