import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    const data = await resend.emails.send({
      from: "AFL Brands <admin@aflbrands.com>",
      to: "meurinne1810@gmail.com",
      subject: "🧪 Test directo desde Replit con Resend",
      html: `<p>¡Hola! Este es un correo de prueba enviado desde tu proyecto con Resend + Supabase.</p>`,
    });
    console.log("✅ Enviado:", data);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

sendTestEmail();
