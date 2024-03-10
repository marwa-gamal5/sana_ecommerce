import * as React from 'react';

import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig/instance';


import styles from './About.module.css';

import Bg from '../../public/assets/vedio/bg-home.mp4';

import Image from 'next/image'

import static1 from '../../public/assets/image/static1.png';
import static2 from '../../public/assets/image/static2.png';
import static3 from '../../public/assets/image/static3.png';
import static4 from '../../public/assets/image/static4.png';

import whyUs from '../../public/assets/image/whyUs.png';

import icon1 from '../../public/assets/image/icon1.png';
import icon2 from '../../public/assets/image/icon2.png';
import icon3 from '../../public/assets/image/icon3.png';
import icon4 from '../../public/assets/image/icon4.png';

import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import Slider from "react-slick";

import { useDispatch , useSelector } from 'react-redux';

import { getNavbarColor } from '../../store/actions';



function About() {


  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };



  var settingsTwo = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
  };


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



  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNavbarColor("#0B2802"));

  }, []);


  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {

    const onIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
        
          const interval = setInterval(() => {
            setCount((prevCount) => {
              const newCount = prevCount + 1;
              return newCount <= 200 ? newCount : 200;
            });

            setCount1((prevCount) => {
              const newCount = prevCount + 1;
              return newCount <= 250 ? newCount : 250;
            });

            setCount2((prevCount) => {
              const newCount = prevCount + 1;
              return newCount <= 300 ? newCount : 300;
            });

            setCount3((prevCount) => {
              const newCount = prevCount + 1;
              return newCount <= 130 ? newCount : 130;
            });
          }, 1); 

          return () => clearInterval(interval);
        }
      });
    };


    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0.5, 
    });


    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    <>


      <section  >
        {/* header */}
        <div className={styles.videoContainer}>

          <div className='container'>
            <video autoPlay muted loop className={styles.video}>
              <source src={Bg} type="video/mp4" />
            </video>

            <div className={styles.caption}>
              <h2> {listRef.current.VAR000009_the_first_developed_}<br />
              {listRef.current.VAR000010_for_the_manufacture_}
              </h2>
              <p>
              {listRef.current.VAR000023_al_baraka_factory_fo}
              {listRef.current.VAR000024_experts_in_the_manuf}
              
              </p>
            </div>


          </div>


        </div>
        {/* about */}

        <div className={`${styles.about} `}>
          <div className='container'>
            <div className={`${styles.underLay} position-relative`}>
              <h2>{listRef.current.VAR000025_who_we_are_AITSP0000}</h2>
            </div>


          </div>
        </div>


        <div className={`${styles.aboutTwo} py-5`} ref={sectionRef}>
          <div className='container'>
            <div className={`${styles.underLay} position-relative`}>
              <h2>{listRef.current.VAR000026_statistics_on_our_su}</h2>
            </div>

            <div className='row my-5 justify-content-center'>
              <div className='col-lg-3 col-md-4 col-6'>
                <div className='text-center'>
        
                  <Image src={static1} alt="image slider" className={`${styles.staticImage}`}/>
                 
                  <h5>{count3}+</h5>
                  <p>{listRef.current.VAR000027_tones_made_AITSP0000}</p>
                </div>

              </div>
              <div className='col-lg-3 col-md-4 col-6'>
                <div className='text-center'>
                  <Image src={static2} alt="image slider" className={`${styles.staticImage}`} />
                  <h5>{count1}+</h5>
                  <p>{listRef.current.VAR000028_years_of_experience_}</p>
                </div>

              </div>

              <div className='col-lg-3 col-md-4 col-6'>
                <div className='text-center'>
             
                  <Image src={static3} alt="image slider" className={`${styles.staticImage}`}/>
                  <h5>{count2}+</h5>
                  <p>{listRef.current.VAR000029_engineer_and_worker_}</p>
                </div>

              </div>

              <div className='col-lg-3 col-md-4 col-6'>
                <div className='text-center'>
       
                  <Image src={static4} alt="image slider" className={`${styles.staticImage}`}/>
                  <h5>{count}+</h5>
                  <p>{listRef.current.VAR000030_customer_served_AITS}</p>
                </div>

              </div>
            </div>


          </div>
        </div>


        <div className={`${styles.aboutThree} aboutThree`}>
          <div className={` container ${styles.contain}`}>
            <div className={`${styles.underLay} position-relative`}>
              <h2>{listRef.current.VAR000031_why_us_AITSP00000000}</h2>
            </div>
            <div>
              <Slider {...settings}>
                <div className='d-flex justify-content-center'>
                  <div className={`${styles.item} my-4`}>
                    <div className='row'>
                      <div className='col-lg-6 '>
                        <div>
                          <ul>
                            <li>
                            {listRef.current.VAR000032_al_barka_company_for}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className='col-lg-6'>
                        <div>
                          <Image src={whyUs} alt="image slider"  className='w-100'/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className='d-flex justify-content-center'>
                  <div className={`${styles.item} my-4`}>
                    <div className='row'>
                      <div className='col-lg-6 '>
                        <div>
                          <ul>
                            <li>
                            {listRef.current.VAR000032_al_barka_company_for}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className='col-lg-6'>
                        <div>
                          <Image src={whyUs} alt="image slider"  className='w-100'/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </Slider>
            </div>


          </div>
        </div>


        <div className={`${styles.aboutFour} aboutFour`}>
          <div className='container'>
            <div className='row'>
              <div className='col-md-3 mb-3 '>
                <div className={`${styles.underLay} position-relative`}>
                  <h2>{listRef.current.VAR000033_our_clients_AITSP000}</h2>
                </div>
              </div>
              <div className='col-md-8 offset-md-1 slackTwo'>
                <Slider {...settingsTwo}>
                  <Image src={icon1} alt="image slider" className={`${styles.iconImage}`}  />
                  <Image src={icon2} alt="image slider" className={`${styles.iconImage}`} />
                  <Image src={icon3} alt="image slider" className={`${styles.iconImage}`} />
                  <Image src={icon4} alt="image slider" className={`${styles.iconImage}`} />

                  <Image src={icon1} alt="image slider" className={`${styles.iconImage}`} />
                  <Image src={icon2} alt="image slider" className={`${styles.iconImage}`} />
                  <Image src={icon3} alt="image slider" className={`${styles.iconImage}`} />
                  <Image src={icon4} alt="image slider" className={`${styles.iconImage}`} />
                </Slider>
              </div>
            </div>

          </div>
        </div>


        <div className={`${styles.aboutFive} `}>
          <div className='container'>
            <div className='row'>
              <div className={` col-lg-9 ${styles.item}`}>
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

            </div>



          </div>
        </div>


      </section>

    </>
  )
}

export default About;





