import React from 'react';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import Logo from '../Logo/Logo';

const Navbar = () => {
    const { user, logOutUser } = useAuth()
    // console.log(user.email)

    const handleLogOut = () => {
        logOutUser()
            .then(() => {
                // console.log("signout")
            })
            .catch(error => {
                console.log(error)
            })
    }


    const link = <>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/about'>About Us</NavLink></li>
        <li><NavLink to='/coverage'>Coverage</NavLink></li>
        <li><NavLink to='/sendParcel'>Send a parcel</NavLink></li>
        <li><NavLink to='/register'>Register</NavLink></li>
       
        {
            user &&  <li><NavLink to='/dashBoard'>DashBoard</NavLink></li>
        }
          <li><NavLink to='/beARider'>Be a rider</NavLink></li>

    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {link}
                    </ul>
                </div>
                <small><Logo></Logo></small>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {link}
                </ul>
            </div>
            <div className="navbar-end">
                {user ?
                    <button onClick={handleLogOut} className="btn">Sign out</button> :
                    <Link className='btn btn-primary' to='/login'>Login</Link>
                }
            </div>
        </div>
    );
};

export default Navbar;
{/* <Link className='btn btn-primary' to='/login'>Login</Link> */ }