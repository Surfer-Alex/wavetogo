import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import { VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
type Props = {
  setIsUserLoggedIn: (value: boolean) => void;
};
const SignInWithNative = ({ setIsUserLoggedIn }: Props) => {
  const [signInForm, setSignInForm] = useState({
    email: "alex@gmail.com",
    password: "Alex123456",
  });
  const [signInWithEmailAndPassword, user, loading, fbError] =
    useSignInWithEmailAndPassword(auth);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    variant: VariantType,
  ) => {
    e.preventDefault();

    signInWithEmailAndPassword(signInForm.email, signInForm.password);
    setIsUserLoggedIn(true);
    router.push("/");
    enqueueSnackbar("Login successfully !", { variant });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e, "success")}
      className="mt-4 flex w-full flex-col"
    >
      <input
        required
        name="email"
        placeholder="email"
        type="Your email..."
        onChange={handleChange}
        value={"alex@gmail.com"}
        className="mt-3 rounded-xl border border-slate-400 px-2 py-2"
      />
      <input
        required
        name="password"
        placeholder="password"
        type="Choose a strong password..."
        onChange={handleChange}
        value={"Alex123456"}
        className="mt-3 rounded-xl border border-slate-400 px-2 py-2"
      />

      {fbError && <div>fbError.message</div>}

      <button
        type="submit"
        className="mt-6 rounded-full bg-black px-2 py-2 text-white"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInWithNative;
