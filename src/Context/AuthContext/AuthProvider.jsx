import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const provider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth,email, password)
    }

    const loginUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

     const logOutUser = () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = profileInfo=>{
        return updateProfile(auth.currentUser,profileInfo)
    }

     const googleLogin = () => {
        setLoading(true)
        return signInWithPopup(auth, provider)
    }
    
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setLoading(false);
        });
       return () => unSubscribe();
    },[])

    const authInfo = {
        user,
        loading,
        createUser,
        loginUser,
        logOutUser,
        updateUserProfile,
        googleLogin,
    }
    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;