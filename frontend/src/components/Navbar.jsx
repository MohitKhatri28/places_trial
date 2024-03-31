import React from 'react';
import { Link } from 'react-router-dom';
export const Navbar = () => {
    return (
        <div id="navbar">

        
        <nav className="flex gap-10 lg:gap-20 flex-shrink-0 items-center justify-between p-4 bg-cyan-200">
            <div className=" text-black text-xl font-semibold">
                <Link to="/">WhoGetsHereFirst</Link>
            </div>
            <div>
                <Link to="/how-to-play" className="text-black text-xl font-semibold">
                    How to Play
                </Link>
            </div>
        </nav>   
        </div>
    ) 
}