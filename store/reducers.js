/* eslint-disable default-param-last */
import { combineReducers } from 'redux';
import * as types from './types';
import {USER_TYPE} from "./types";
// import Cookies from 'js-cookie'; 

// ......................................... Language .............................................//
const languageReducer = (state = "en", { type, payload }) => {
  switch (type) {
    case types.SET_LANGUAGE:
      return payload;
    default:
      return state;
  }
};

// ......................................... user Type .............................................//

const userType = (state = "", { type, payload }) => {
  switch (type) {
    case types.USER_TYPE:
      return payload;
    default:
      return state;
  }
};

// ......................................... WEB_LIST  .............................................//
const webListReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case types.SET_WEB_LIST:
      return payload
    default:
      return state;
  }
};

// ......................................... isAuth .............................................//
const isAuthReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case types.SET_IS_AUTH:
      return payload;
    default:
      return state;
  }
};

// ......................................... country .............................................//
const countryReducer = (state ="Egypt", { type, payload }) => {
  switch (type) {
    case types.SET_COUNTRY:
      return payload;
    default:
      return state;
  }
};


// ......................................... cart count .............................................//
const cartCountReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case types.SET_CART_COUNT:
      return payload;
    default:
      return state;
  }
};


// ......................................... fav count.............................................//
const favCountReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case types.SET_FAV_COUNT:
      return payload;
    default:
      return state;
  }
};

// ......................................... fav count.............................................//
const notificationsCountReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case types.SET_NOTIFICATION_COUNT:
      return payload;
    default:
      return state;
  }
};

// ......................................... show login .............................................//
const showLoginReducer = (state = false, { type, payload }) => {
  switch (type) {
    case types.SET_SHOW_LOGIN:
      return payload;
    default:
      return state;
  }
};


// ......................................... show register .............................................//
const showRegisterReducer = (state = false, { type, payload }) => {
  switch (type) {
    case types.SET_SHOW_REGISTER:
      return payload;
    default:
      return state;
  }
};

// ......................................... show forget .............................................//
const showForgetReducer = (state = false, { type, payload }) => {
  switch (type) {
    case types.SET_SHOW_FORGET:
      return payload;
    default:
      return state;
  }
};

// ......................................... show forget .............................................//
const showSearchReducer = (state = false, { type, payload }) => {
  switch (type) {
    case types.SET_SHOW_SEARCH:
      return payload;
    default:
      return state;
  }
};

// ......................................... CURRENCY_RATE .............................................//
const currencyRateReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case types.SET_CURRENCY_RATE:
      return payload
    default:
      return state;
  }
};


// ......................................... Navbar Bg .............................................//
const navbarColorReducer = (state = "#0B2802", { type, payload }) => {
  switch (type) {
    case types.SET_NAVBAR_COLOR:
      return payload;
    default:
      return state;
  }
};


// COMBINED REDUCERS
const reducers = {
  language: languageReducer,
  webList: webListReducer,
  isAuth: isAuthReducer,
  country: countryReducer,
  cartCount: cartCountReducer,
  notificationsCount: notificationsCountReducer,
  favCount: favCountReducer,
  showLogin: showLoginReducer,
  showRegister: showRegisterReducer,
  showForget: showForgetReducer,
  showSearch:showSearchReducer,
  currencyRate:currencyRateReducer,
  navbarColor:navbarColorReducer,
  userType:userType,
};

export default combineReducers(reducers);