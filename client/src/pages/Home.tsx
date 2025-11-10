import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/login");
      else setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenido 👋</h1>
      {user && <p>{user.email}</p>}
    </div>
  );
}
