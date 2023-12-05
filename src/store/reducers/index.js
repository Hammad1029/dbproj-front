// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import user from "./user"
import appInfo from "./appInfo"

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, user, appInfo });

export default reducers;
