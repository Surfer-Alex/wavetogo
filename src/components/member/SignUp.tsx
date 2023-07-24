import { useEffect, useState } from 'react';
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from 'react-firebase-hooks/auth';
import { db, auth } from '@/firebase';
import { VariantType, useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
type Props = {
  setIsUserLoggedIn: (value: boolean) => void;
};
function SignUp({ setIsUserLoggedIn }: Props) {
  const [signUpForm, setSignUpForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [createUserWithEmailAndPassword, user, loading, fbError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  //   useEffect(() => {
  //     console.log('user變化', user);
  //   }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    variant: VariantType
  ) => {
    e.preventDefault();
    // Reset the error before trying to submit the form
    if (error) setError('');
    // Check passwords match
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Check password format
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,256}$/gm;

    if (!passwordRegex.test(signUpForm.password)) {
      setError(
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
      );
      return;
    }
    router.push('/');
    enqueueSnackbar('Sign Up successfully !', { variant });

    await createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);

    const success = await updateProfile({
      displayName: signUpForm.displayName,
    });
    if (success) {
      console.log('成功update');
    }
    if (updateError) {
      console.log(updateError.message);
    }
    setIsUserLoggedIn(true);
  };
  //   const updateProfileWithSignUp = async () => {
  //     const success = await updateProfile({
  //       displayName: signUpForm.displayName,
  //     });
  //     if (success) {
  //       console.log('成功update');
  //     }
  //     if (updateError) {
  //       console.log(updateError.message);
  //     }
  //   };

  return (
    <div className="flex flex-col items-center">
      {(error || fbError) && (
        <div className="text-red-500">{error || fbError?.message}</div>
      )}

      <form
        onSubmit={(event) => handleSubmit(event, 'success')}
        className="flex flex-col mt-4 w-full"
      >
        <input
          required
          name="displayName"
          placeholder="displayName"
          type="displayName"
          onChange={handleChange}
          className="mt-3 border border-slate-400 rounded-xl px-2 py-2"
        />
        <input
          required
          name="email"
          placeholder="email"
          type="email"
          onChange={handleChange}
          className="mt-6 border border-slate-400 rounded-xl px-2 py-2"
        />
        <input
          required
          name="password"
          placeholder="password"
          type="password"
          onChange={handleChange}
          className="mt-6 border border-slate-400 rounded-xl px-2 py-2"
        />
        <input
          required
          name="confirmPassword"
          placeholder="Confirm password"
          type="password"
          onChange={handleChange}
          className="mt-6 border border-slate-400 rounded-xl px-2 py-2"
        />

        <button
          type="submit"
          className="mt-6 bg-black text-white rounded-full px-2 py-2"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
