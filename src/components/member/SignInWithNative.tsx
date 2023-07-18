import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { db, auth } from '@/firebase';
import { VariantType, useSnackbar } from 'notistack';
type Props = {
    setIsUserLoggedIn: (value: boolean) => void;
  };
const SignInWithNative = ({ setIsUserLoggedIn }: Props) => {
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });
  const [signInWithEmailAndPassword, user, loading, fbError] =
    useSignInWithEmailAndPassword(auth);
    const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>,variant: VariantType) => {
    e.preventDefault();

    signInWithEmailAndPassword(signInForm.email, signInForm.password);
    setIsUserLoggedIn(true);
    enqueueSnackbar('Login successfully !', { variant });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  return (
    <form onSubmit={(e)=>handleSubmit(e,'success')} className='flex flex-col mt-4 w-full'>
      <input
        required
        name="email"
        placeholder="email"
        type="Your email..."
        onChange={handleChange}
        className='mt-3 border border-slate-400 rounded-xl px-2 py-2'        
      />
      <input
        required
        name="password"
        placeholder="password"
        type="Choose a strong password..."
        onChange={handleChange}
        className='mt-3 border border-slate-400 rounded-xl px-2 py-2'        
      />

      {fbError && <div>fbError.message</div>}

      <button type="submit" className='mt-6 bg-black text-white rounded-full px-2 py-2'>Sign In</button>
    </form>
  );
};

export default SignInWithNative;
