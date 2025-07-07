import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../../Hooks/useAuth';
import axios from 'axios';
import useAxios from '../../../Hooks/useAxios';


const Register = () => {
    const [profilePic, setProfilePic] = useState('')
    const navigate = useNavigate()
    const axiosInstance = useAxios();
    const {
        register,
        formState: { errors },
        handleSubmit,

    } = useForm()
    const { createUser, updateUserProfile } = useAuth();

    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user)
                navigate('/')
                toast.success("Successfully Register!")


                //update userinfo in the database
                const userInfo = {
                    email: data.email,
                    // photoURL: data.photoURL
                    role: 'user',  //default role
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                };

                
                const userRes = await axiosInstance.post('/users', userInfo)
                console.log(userRes.data)


                //update user profile in firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('updated')
                    })
                    .catch(error => {
                        console.log(error)
                    })

            })
            .catch(error => {
                console.error(error)
                toast.error('Fail to register')
            })
    }

    const handleImageUp = async (e) => {
        const image = e.target.files[0]
        console.log(image)


        const formData = new FormData()
        formData.append('image', image)

        const uploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`
        // const res = await axios.post(uploadURL, formData)
        // const imageUrl = res.data?.data?.url; // ✅ Extract just the URL
        // setProfilePic(imageUrl); // ✅ Save only the URL string
        // setProfilePic(res.data)
        try {
            const res = await axios.post(uploadURL, formData);
            const imageUrl = res.data?.data?.url; // ✅ Extract just the URL
            setProfilePic(imageUrl); // ✅ Save only the URL string
        } catch (err) {
            console.error("Image upload failed", err);
        }
    }



    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <Toaster />
            <div className="card-body">
                <h1 className="text-5xl font-bold">Create an account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">
                        <label className="label">Name</label>
                        <input type="text" {...register('name', { required: true, })} className="input" placeholder="Type Your Name" />
                        {
                            errors.name?.type === 'required' && <p className='text-red-600'>Please enter your name</p>
                        }
                        <label className="label">Email</label>
                        <input type="email" {...register('email', { required: true, })} className="input" placeholder="Email" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-600'>Email is required</p>
                        }


                        <label className="label">Photo</label>
                        <input type="file"
                            onChange={handleImageUp}
                            className="input"
                            placeholder="Your Profile picture" />


                        <label className="label">Password</label>
                        <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-600'>Enter a password</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-600'>Password must be 6 character or longer</p>
                        }


                        <div><a className="link link-hover">Forgot password?</a></div>
                    </fieldset>
                    <button className="btn btn-primary mt-4 w-full">Register</button>
                    <p><small>Already have an account?</small> <Link className='text-blue-700 font-bold' to='/login'>Login</Link></p>
                </form>
                <SocialLogin></SocialLogin>
                {/* <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        <label className="label">Email</label>
                        <input type="email" {...register('email', { required: true, })} className="input" placeholder="Email" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-600'>Email is required</p>
                        }


                        <label className="label">Password</label>
                        <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-600'>Enter a password</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-600'>Password must be 6 character or longer</p>
                        }


                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-primary mt-4">Register</button>
                    </fieldset>
                    <p><small>Already have an account?</small> <Link className='text-blue-700 font-bold' to='/login'>Login</Link></p>
                </form> */}

            </div>
        </div>
    );
};

export default Register;