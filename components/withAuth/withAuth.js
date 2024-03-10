import { useRouter } from 'next/router';
import axiosInstance from '../../axiosConfig/instance';
import { useDispatch } from 'react-redux';
import { getIsAuth } from '../../store/actions';
import { useEffect, useState } from 'react';

import { getShowLogin } from '../../store/actions';


const withAuth = (Component) => {

  const Auth = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance
          .post('user/check/', { token })
          .then((res) => {
            if (res.data.name) {
              setIsAuthenticated(true);
              dispatch(getIsAuth(res.data));
            } else {
              localStorage.removeItem('token');
              dispatch(getIsAuth({}));
              dispatch(getShowLogin(true));
            }
          })
          .catch((err) => {
            console.log(err);
            dispatch(getShowLogin(true));
         
          });
      } else {
        setIsAuthenticated(false);
        dispatch(getIsAuth({}));
        dispatch(getShowLogin(true));
       
      }
    }, [dispatch, router]);

    return isAuthenticated ? <Component {...props} /> : null;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;