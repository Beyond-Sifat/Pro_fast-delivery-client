import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../Hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const { loginUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation()

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm()

    const onSubmit = data => {
        console.log(data)

        loginUser(data.email, data.password)
            .then(async (result) => {
                const user = result.user

                if (!user.displayName) {
                    const name = prompt("👋 You haven't set a name yet. Please enter your name:");

                    if (name) {
                        try {
                            await updateUserProfile({ displayName: name });
                            console.log("✅ Name updated to:", name);
                            toast.success('Name updated!');
                        } catch (err) {
                            console.error("❌ Failed to update name:", err);
                            toast.error("Couldn't update name.");
                        }
                    }
                }
                console.log(result)
                navigate(location?.state || '/')
                toast.success('Login successful')
            })
            .catch(error => {
                console.log(error)
                toast.error('Something went wrong')
            })

    }
    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <Toaster />
            <div className="card-body">
                <h1 className="text-5xl font-bold">Please Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        <label className="label">Email</label>
                        <input type="email" {...register('email')} className="input" placeholder="Email" />


                        <label className="label">Password</label>
                        <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-600' role='alert'>Password is required</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-600' role='alert'>Password must be 6 character or longer</p>
                        }


                        <div><a className="link link-hover">Forgot password?</a></div>
                    </fieldset>
                    <button className="btn btn-primary mt-4 w-full">Login</button>
                    <p><small>New in this Site? Register First</small> <Link className='text-blue-700 font-bold' to='/register'>Register</Link></p>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Login;