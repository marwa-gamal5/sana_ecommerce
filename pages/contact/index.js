import * as React from 'react';
import axiosInstance from '../../axiosConfig/instance';
import styles from './ContactUs.module.css';
import Swal from "sweetalert2";
import { getNavbarColor } from '@/store/actions';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function ContactUs() {

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();


  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }


  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  async function KeepInTouch(e) {
    e.preventDefault();
    axiosInstance.post('user/send_mail_contact_us', {
      name: name,
      email: email,
      mobile: mobile,
      message: message
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
      }
    }).catch(err => {
      console.log(err);
    });

  }

  useEffect(() => {
    dispatch(getNavbarColor("#0B2802"));

  }, []);




  return (
    <>
      <section className='mainSction'>

        <div className='container'>

          <div className={`${styles.about} `}>

            <div className={`${styles.underLay} mb-3 position-relative`}>
              <h2>{listRef.current.VAR000004_contact_us_AITSP0000}</h2>
            </div>

          </div>

          <div className={`${styles.aboutFive} `}>
            <div className='container'>
              <div className='row justify-content-center'>
                <div className={` col-lg-9 ${styles.item} mb-4`}>

                  <div className={`${styles.underLay} position-relative`}>
                    <h2>{listRef.current.VAR000034_keep_in_touch_AITSP0}</h2>
                  </div>
                  <p>{listRef.current.VAR000035_for_more_information}</p>

                  <form>
                  <div>
                    <input type="text" placeholder={listRef.current.VAR000036_your_name_AITSP00000} onChange={(e) => {
                      setName(e.target.value)
                    }} />
                  </div>
                  <div>
                    <input type="email" placeholder={listRef.current.VAR000037_your_email_AITSP0000} onChange={(e) => {
                      setEmail(e.target.value)
                    }} />
                  </div>
                  <div>
                    <input type="text" placeholder={listRef.current.VAR000038_your_mobile_number_A} onChange={(e) => {
                      setMobile(e.target.value)
                    }} />
                  </div>
                  <div>
                    <input type="text" placeholder={listRef.current.VAR000039_leave_your_message_A} onChange={(e) => {
                      setMessage(e.target.value)
                    }} />
                  </div>

                  <div className='d-flex justify-content-end'>
                    <button type="submit" onClick={KeepInTouch}>{listRef.current.VAR000040_submit_AITSP00000000}</button>
                  </div>
                </form>

                </div>

                <div className={` ${styles.itemMap} col-lg-9 p-0`}>

                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28672.282211865502!2d32.2255141!3d26.0651035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2seg!4v1690197848020!5m2!1sar!2seg"
                    width="100%" height="350" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                </div>

              </div>



            </div>
          </div>


        </div>
      </section >
    </>
  )
}

export default ContactUs;