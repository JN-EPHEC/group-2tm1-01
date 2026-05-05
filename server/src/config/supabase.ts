import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
);

const { data, error } = await supabase.from("Products").select("*");

console.log(data, error);
