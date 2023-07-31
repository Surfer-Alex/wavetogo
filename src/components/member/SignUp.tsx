import { useEffect, useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import { VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
type Props = {
  setIsUserLoggedIn: (value: boolean) => void;
};
function SignUp({ setIsUserLoggedIn }: Props) {
  const [signUpForm, setSignUpForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [sendProfile, setSendProfile] = useState(false);
  const [createUserWithEmailAndPassword, user, loading, fbError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    if (sendProfile && !fbError) {
      router.push("/");
      setIsUserLoggedIn(true);
    } else {
      setSendProfile(false);
    }
  }, [fbError, sendProfile]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    variant: VariantType,
  ) => {
    e.preventDefault();

    if (error) setError("");

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,256}$/gm;

    if (!passwordRegex.test(signUpForm.password)) {
      setError(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      );
      return;
    }
    await createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);

    const success = await updateProfile({
      displayName: signUpForm.displayName,
    });
    if (auth.currentUser != null) {
      await auth.currentUser.reload();
    }

    enqueueSnackbar("Sign Up successfully !", { variant });
    setSendProfile(true);
  };

  return (
    <div className="flex flex-col items-center">
      {(error || fbError) && (
        <div className="text-red-500">{error || fbError?.message}</div>
      )}

      <form
        onSubmit={(event) => handleSubmit(event, "success")}
        className="mt-4 flex w-full flex-col"
      >
        <input
          required
          name="displayName"
          placeholder="displayName"
          type="displayName"
          onChange={handleChange}
          className="mt-3 rounded-xl border border-slate-400 px-2 py-2"
        />
        <input
          required
          name="email"
          placeholder="email"
          type="email"
          onChange={handleChange}
          className="mt-6 rounded-xl border border-slate-400 px-2 py-2"
        />
        <input
          required
          name="password"
          placeholder="password"
          type="password"
          onChange={handleChange}
          className="mt-6 rounded-xl border border-slate-400 px-2 py-2"
        />
        <input
          required
          name="confirmPassword"
          placeholder="Confirm password"
          type="password"
          onChange={handleChange}
          className="mt-6 rounded-xl border border-slate-400 px-2 py-2"
        />

        <button
          type="submit"
          className="mt-6 rounded-full bg-black px-2 py-2 text-white"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
