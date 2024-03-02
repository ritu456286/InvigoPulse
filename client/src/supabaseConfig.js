import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "'https://zrppooblworcqptzucrt.supabase.co'";
const supabaseApi =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veHdpdG1jYmxobGtia2tzZ3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNTc1MjYsImV4cCI6MjAwNTkzMzUyNn0.HD7olj6uDEi6gFp-Sfk398XFX41Cl5_rFxyEGg2Lisg";
export const supabase = createClient(supabaseUrl, supabaseApi);
