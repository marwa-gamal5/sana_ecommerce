import * as React from 'react';
import style from './Reset.module.css';
import Swal from "sweetalert2";
import { useState, useEffect} from 'react';
import ReactLoading from "react-loading";
import axiosInstance from '../../axiosConfig/instance';
import { useRouter } from 'next/router';
import Image from 'next/image';
import login from '../../public/assets/image/login.png';
import {useDispatch } from 'react-redux';
import {getNavbarColor } from '../../store/actions';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEyeSlash, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getShowLogin } from '@/store/actions';
library.add(faEyeSlash, faEye, faTimes);

function Reset() {

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);  

  const dispatch = useDispatch();

  const router = useRouter();
  const { token } = router.query;

  const [isBusy, setIsBusy] = useState(false);

  const [password, setPassword] = useState();
  const [repassword, setRePassword] = useState();

  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }


  async function check(token) {
    await axiosInstance.post(`user/chk_tok`, {
      token: token
    }).then(res => {
      console.log(res)
      if (res.data.error) {
        if (res.data.error == "too_many_requests") {
          router.push('/');
        } else {
          showAlert(listRef.current[res.data.error], "error");
          router.push('/');
        }
      } else {
        setIsBusy(true);
      }
    })
  }


  async function sendPassword(e) {
    e.preventDefault();
    if (machErrorValidation === true) {
      await axiosInstance.post(`user/reset_pass/`, {
        token: token,
        password: password,
        re_password: repassword
      }).then(res => {
        if (res.data.success) {
          showAlert(listRef.current[res.data.success], "success");
          router.push('/');
          dispatch(getShowLogin(true));

        } else {
          if (res.data.error == "too_many_requests") {
            router.push('/');
          } else {
            showAlert(listRef.current[res.data.error], "error");
          }
        }
      })
    }
  }

  const [machError, setMachError] = useState('');
  const [machErrorValidation, setMachErrorValidation] = useState('');

  function machingPassword(value) {

    let eleErr = document.getElementById("rePassword");
    if (value === password) {
      eleErr.classList.add('d-none');
      return true;
    } else {
      setMachError(listRef.current.VAR000120_passwords_not_match_);
      eleErr.classList.remove('d-none');
      return false;
    }
  }

  useEffect(() => {
    if (token) {
      check(token);
    }
  }, [token]);


  useEffect(() => {
    dispatch(getNavbarColor("#0B2802"));
  }, []);

  return (
    <>
      {isBusy ? (

        <section className={`${style.login}`}>
          <div className={`${style.row} `}>
            <div className={`row`}>
              <div className='col-md-6 d-md-block d-none'>
                <Image src={login}  style={{ width: "100%" }} alt="login_img" />
              </div>
              <div className='col-md-6'>

                <div className={`${style.beforeForm}`}>
                  <div className={`${style.form}`}>

                    <h2 className="text-center fw-bold">{listRef.current.VAR000118_reset_your_password_}</h2>
                    <p className='text-center text-lowercase'>{listRef.current.VAR000117_strong_password_incl}</p>

                    <form className="my-3 " onSubmit={sendPassword}>
                      <label className="mb-1">{listRef.current.VAR000116_enter_new_password_A}</label>
                      <input className=" form-control mb-3" type="password" placeholder={listRef.current.VAR000116_enter_new_password_A} onChange={(e) => {
                        setPassword(e.target.value);
                      }} required autoFocus />

                      <label className="mb-1">{listRef.current.VAR000115_confirm_new_password}</label>
                      <input className=" form-control mb-3" type="password" placeholder={listRef.current.VAR000115_confirm_new_password} onChange={(e) => {
                        machingPassword(e.target.value)
                        setMachErrorValidation(machingPassword(e.target.value));
                        setRePassword(e.target.value);
                      }} required autoFocus />
                      <p id="rePassword" className='d-none text-danger mt-2'>{machError}</p>

                      <button type="submit" className={`${style.btn_login} btn mt-2 mb-1 text-capitalize fw-bold `}>{listRef.current.VAR000114_reset_password_AITSP}</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <button className={`${style.close}`} onClick={() => router.push('/')} >
              <FontAwesomeIcon className='fs-4' style={{ color: "#2E6020" }} icon={faTimes} />
            </button>

          </div>


        </section>

      ) : (

        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
          <div>
            <ReactLoading type="spin" color="#CD5C5C" height={100} width={50} />
          </div>
        </div>

      )}

    </>

  );
}

export default Reset;