import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          SociaFi
        </div>
        <div className="space-x-4">
          <Link to="/posts" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/event" className="text-white hover:text-gray-200">Events</Link>
          <Link to="/voting" className="text-white hover:text-gray-200">Voting</Link>
          <Link to="/liveshow" className="text-white hover:text-gray-200">LiveShow</Link>
          <ConnectButton/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
