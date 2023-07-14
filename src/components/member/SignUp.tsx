import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { db, auth } from '@/firebase';
function SignUp() {
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [createUserWithEmailAndPassword, user, loading, fbError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };
  return (<div className='flex flex-col items-center'>
    {(error || fbError) && (
        <div className='text-red-500'>{error || fbError?.message}</div>
      )}
    <form onSubmit={handleSubmit} className='flex flex-col mt-4 w-full'>
      <input
        required
        name="email"
        placeholder="email"
        type="email"
        onChange={handleChange}
        className='mt-3 border border-slate-400 rounded-xl px-2 py-2'        
      />
      <input
        required
        name="password"
        placeholder="password"
        type="password"
        onChange={handleChange}
        className='mt-6 border border-slate-400 rounded-xl px-2 py-2'            
      />
      <input
        required
        name="confirmPassword"
        placeholder="Confirm password"
        type="password"
        onChange={handleChange}
        className='mt-6 border border-slate-400 rounded-xl px-2 py-2'        
      />

      <button type="submit" className='mt-6 bg-black text-white rounded-full px-2 py-2' >Sign Up</button>
    </form>
    </div>);
}

export default SignUp;
