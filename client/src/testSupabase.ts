// testSupabase.ts
export async function testServer() {
  try {
    const res = await fetch("http://localhost:5000/");
    const text = await res.text();
    console.log("✅ Server response:", text);
  } catch (error) {
    console.error("❌ Error connecting to server:", error);
  }
}

testServer();
