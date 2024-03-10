import * as types from './types';

// ......................................... WEB_LIST  .............................................//
export const setWebList = (payload) => ({ type: types.SET_WEB_LIST, payload });

export const getWebList = (axios, langCode) => (dispatch, getState) => {
  const state = getState();
  if (state.webList.webList) {
    return;
  }

  axios.post('user/Web_trans', {
    lang: langCode
  }).then((res) => {
    dispatch(setWebList(res.data.languages[0].web));
  }).catch((err) => {
    console.log(err);
  });
};

// ......................................... Language .............................................//
export const setLanguage = (payload) => ({ type: types.SET_LANGUAGE, payload });

export const getLanguage = (langCode) => (dispatch, getState) => {
  const state = getState();
  if (state.language.language) {
    return;
  }

  dispatch(setLanguage(langCode));
};

// ......................................... isAuth .............................................//
export const setIsAuth = (payload) => ({ type: types.SET_IS_AUTH, payload });

export const getIsAuth = (ele) => (dispatch, getState) => {
  const state = getState();
  if (state.isAuth.isAuth) {
    return;
  }

  dispatch(setIsAuth(ele));
};

// ......................................... Country .............................................//
export const setCountry = (payload) => ({ type: types.SET_COUNTRY, payload });

export const getCountry = (country) => (dispatch, getState) => {
  const state = getState();
  if (state.country.country) {
    return;
  }

  dispatch(setCountry(country));
};

// ......................................... cart .............................................//
export const setCartCount = (payload) => ({ type: types.SET_CART_COUNT, payload });

export const getCartCount = (cartCount) => (dispatch, getState) => {
  const state = getState();
  if (state.cartCount.cartCount) {
    return;
  }
  dispatch(setCartCount(cartCount));
};


// ......................................... fav .............................................//
export const setFavCount = (payload) => ({ type: types.SET_FAV_COUNT, payload });

export const getFavCount = (favCount) => (dispatch, getState) => {
  const state = getState();
  if (state.favCount.favCount) {
    return;
  }
  dispatch(setFavCount(favCount));
};


// ......................................... notifications .............................................//
export const setNotificationstCount = (payload) => ({ type: types.SET_NOTIFICATION_COUNT, payload });

export const getNotificationstCount = (notificationsCount) => (dispatch, getState) => {
  const state = getState();
  if (state.notificationsCount.notificationsCount) {
    return;
  }
  dispatch(setNotificationstCount(notificationsCount));
};


// ......................................... show login .............................................//
export const setShowLogin = (payload) => ({ type: types.SET_SHOW_LOGIN, payload });

export const getShowLogin = (showLogin) => (dispatch, getState) => {
  const state = getState();
  if (state.showLogin.showLogin) {
    return;
  }
  dispatch(setShowLogin(showLogin));
};

// ......................................... show register .............................................//
export const setShowRegister = (payload) => ({ type: types.SET_SHOW_REGISTER, payload });

export const getShowRegister = (showRegister) => (dispatch, getState) => {
  const state = getState();
  if (state.showRegister.showRegister) {
    return;
  }
  dispatch(setShowRegister(showRegister));
};

// ......................................... show forget .............................................//
export const setShowForget = (payload) => ({ type: types.SET_SHOW_FORGET, payload });

export const getShowForget = (showForget) => (dispatch, getState) => {
  const state = getState();
  if (state.showForget.showForget) {
    return;
  }
  dispatch(setShowForget(showForget));
};


// ......................................... show Search .............................................//
export const setShowSearch = (payload) => ({ type: types.SET_SHOW_SEARCH, payload });

export const getShowSearch = (showSearch) => (dispatch, getState) => {
  const state = getState();
  if (state.showSearch.showSearch) {
    return;
  }
  dispatch(setShowSearch(showSearch));
};


// ......................................... CURRENCY_RATE  .............................................//
import axios from 'axios';

export const setCurrencyRate = (payload) => ({ type: types.SET_CURRENCY_RATE, payload });

export const getCurrencyRate = () => (dispatch, getState) => {
  const state = getState();
  if (state.currencyRate.currencyRate) {
    return;
  }

  axios.get("https://api.exchangerate.host/convert?from=USD&to=EGP").then((res) => {
      dispatch(setCurrencyRate(res.data.result));
  }).catch((err) => {
    console.log(err);
  });
};

// ......................................... Navbar Color .............................................//
export const setNavbarColor = (payload) => ({ type: types.SET_NAVBAR_COLOR, payload });

export const getNavbarColor = (navbarColor) => (dispatch, getState) => {
  const state = getState();
  if (state.navbarColor.navbarColor) {
    return;
  }
  dispatch(setNavbarColor(navbarColor));
};

