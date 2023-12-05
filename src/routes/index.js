import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import { useSelector } from 'react-redux';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const loggedIn = useSelector(state => state.user.loggedIn)
  return useRoutes([loggedIn ? MainRoutes : LoginRoutes]);
}
