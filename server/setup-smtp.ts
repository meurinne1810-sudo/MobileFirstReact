import fetch from "node-fetch";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function configureSMTP() {
  console.log("🟠 Configurando SMTP personalizado en Supabase...");

  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/smtp`, {
    method: "PUT",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      enabled: true,
      host: "smtp.resend.com",
      port: 587,
      user: "resend",
      pass: "re_c5U4Hep2_9m8dMEvoyxAWJ32tmm22EP",
      sender_name: "WIP",
      sender_email: "admin@aflbrands.com",
      max_frequency: 5,
    }),
  });

  if (!response.ok) {
    console.error("❌ Error configurando SMTP:", await response.text());
  } else {
    console.log("✅ SMTP configurado correctamente con Resend.");
  }
}

configureSMTP();
