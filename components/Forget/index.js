import * as React from 'react';
import style from './Forget.module.css';
import Swal from "sweetalert2";
import { useState } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { useRouter } from 'next/router';
import { useDispatch , useSelector} from 'react-redux';
import login from '../../public/assets/image/forget.png';
import Image from 'next/image';
import { getShowForget, getShowRegister } from '@/store/actions';
import closeImage from '../../public/assets/image/exit-icon.webp';

function Forget() {

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();

  const router = useRouter();

  const [email, setEmail] = useState('');

  async function sendEmail(e) {
    e.preventDefault();
    await axiosInstance.post(`user/forget/`, {
      email: email,
    }).then(res => {
      if (res.data.error) {
        if (res.data.error == "too_many_requests") {

          router.push('/');
          dispatch(getShowForget(false));
        } else {
          showAlert(listRef.current[res.data.error], "error");

        }
      } else {
        showAlert(listRef.current[res.data.success], "success");
        document.getElementById("form").innerHTML = `<div className="text-center ">
       <h4 className="text-capitalize fw-bold">
       "check your email"    
       </h4>
       </div>` ;
      }
    });
  }

  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }


  return (
    <>
      <section className={`${style.login}`}>
        <div className={`${style.row} `}>
          <div className={`row`}>
            <div className='col-md-6 d-md-block d-none'>
              <Image src={login}  style={{width:"100%"}} alt="login_img" />
            </div>
            <div className='col-md-6'>

              <div className={`${style.beforeForm}`}>
                <div className={`${style.form}`}>

                  <h2 className="text-center fw-bold"> {listRef.current.VAR000132_password_recovery_AI}</h2>

                  <form id="form" className="my-3" onSubmit={sendEmail} >
                    <label className="mb-2">{listRef.current.VAR000125_email_AITSP000000000}</label>

                    <input className=" form-control" type="email" onChange={(e) => {
                      setEmail(e.target.value);
                    }} placeholder={listRef.current.VAR000125_email_AITSP000000000} required autoFocus />

                    <span className='text-lowercase'> {listRef.current.VAR000133_enter_your_registere}</span>

                    <button type="submit" className={`${style.btn_login} btn mt-2 mb-1 text-capitalize fw-bold `}>{listRef.current.VAR000134_send_email_AITSP0000}</button>
                    <p className='text-muted text-lowercase'>{listRef.current.VAR000065_donot_have_any_accou} ?
                      <span type="button" onClick={() => {
                        dispatch(getShowForget(false));
                        dispatch(getShowRegister(true));
                      }}>{listRef.current.VAR000094_sign_up_AITSP0000000}</span>
                    </p>

                  </form>
                </div>
              </div>
            </div>
          </div>

          <button className={`${style.close}`} onClick={() => dispatch(getShowForget(false))} >
          <Image src={closeImage} alt="close Image" style={{ width:"40px" , height:"40px" }}  />
          </button>

        </div>


      </section>

    </>
  )
}

export default Forget;




