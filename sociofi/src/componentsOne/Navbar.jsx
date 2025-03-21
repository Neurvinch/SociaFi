import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Navbar = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8 ml-175">
      <a><Link to="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Home</Link></a>
    <a href="/posts" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Posts</a>
    <a href="/event" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Events</a>
    <a href="/voting" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Voting</a>
    <a href="/liveshow" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">LiveShow</a>
    <button className="ml-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-50">{<ConnectButton/>}</button>
    
  </nav>
  );
};

export default Navbar;
