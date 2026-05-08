import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

// On force l'injection du composant "ws" de manière globale 
// pour corriger le plantage de Node.js v20
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket as any;
}

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
