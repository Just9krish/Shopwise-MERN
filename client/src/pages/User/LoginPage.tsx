import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Login from "../../components/Auth/login/Login";
import { useAppSelector } from "../../hooks";

export default function LoginPage() {
  const navigate = useNavigate();

  const { isUserAuthenticate } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isUserAuthenticate) {
      toast.info("You are allready logged in");
      navigate("/");
    }
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <Login />
    </section>
  );
}
