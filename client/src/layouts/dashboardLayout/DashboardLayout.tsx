// @ts-ignore
import { Outlet, useNavigate } from 'react-router-dom'
import './dashboardLauot.css'
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Chatlist from '../../components/chatList/Chatlist';

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className='dashboardLayout'>
      <div className="menu"><Chatlist/></div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  )
}

export default DashboardLayout
