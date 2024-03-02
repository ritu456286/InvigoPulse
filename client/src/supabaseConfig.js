import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zrppooblworcqptzucrt.supabase.co";
const supabaseApi =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycHBvb2Jsd29yY3FwdHp1Y3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzODU5MzgsImV4cCI6MjAyNDk2MTkzOH0.atKxWKlUVGNUd40lMmw4SCaPdiBd9oeg-vlJep0pFP4";
export const supabase = createClient(supabaseUrl, supabaseApi);
