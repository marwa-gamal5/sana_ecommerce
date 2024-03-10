import * as React from 'react';
import { useRouter } from 'next/router';
import style from './Activate.module.css';
import Swal from "sweetalert2";
import { useEffect } from 'react';
import axiosInstance from '../../axiosConfig/instance';


import { useDispatch } from 'react-redux';

import {getNavbarColor } from '../../store/actions';


function Activate() {

  const router = useRouter();
  const { token } = router.query;

  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }

  async function check(token) {

    await axiosInstance.post(`/user/chk_active`, {
      token: token
    }).then(res => {;

      if (res.data.success) {
        sendActivate();
      } else {
        if (res.data.error == "too_many_requests") {
          router.push('/');
        } else {
          document.getElementById("form").innerHTML = `<div className="text-center ">
          <h4 className="text-capitalize fw-bold">
           ${res.data.error}    
          </h4>
          </div>` ;
        }
      }
    }).catch(err => {
      console.log(err);
    })
  }


  async function sendActivate() {
    await axiosInstance.post(`/user/activate`, {
      token: token
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
        router.push('/login');
      } else {
        if (res.data.error == "too_many_requests") {
          router.push('/');
        } else {
          showAlert(listRef.current[res.data.error], "error");
          document.getElementById("form").innerHTML = `<div className="text-center ">
            <h4 className="text-capitalize fw-bold">
             ${res.data.error}  
            </h4>
            </div>`
        }
      }
    })
  }

  useEffect(() => {
    if (token) {
      check(token);
    }
  }, [token]);


  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNavbarColor("#0B2802"));
  }, []);



  return (
    <>
      <section className={`${style.login}`}>
        <div className='d-flex align-items-center'>
          <div className="w-100">
            <div className={`${style.row} row  mt-5`}>
              <div className=" my-5 form ">
                <div className="forText">
                  <div className='form-contain'>
                    <form id="form" className="my-3 ">

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>

  );
}

export default Activate;