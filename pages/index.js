import * as React from 'react';
import styles from './Home.module.css';
import Bg from '../public/assets/vedio/bg-home.mp4';
import Image from 'next/image'
import img from '../public/assets/image/prod1.webp';
import img2 from '../public/assets/image/prod2.png';

var $ = require("jquery");
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

import axiosInstance from '../axiosConfig/instance';

import { useDispatch, useSelector } from 'react-redux';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';
import { getNavbarColor } from '../store/actions';
import Link from 'next/link';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});



function Home() {


  const molasses = [{ src: img },
  { src: img },
  { src: img }];


  const dates = [{ src: img2 },
  { src: img2 },
  { src: img2 }];


  const options = {
    loop: true,
    center: true,
    items: 3,
    margin: 0,
    autoplay: true,
    dots: true,
    autoplayTimeout: 3000,
    smartSpeed: 450,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      800: {
        items: 2
      },
      1400: {
        items: 3
      }
    }
  };


  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();

  const [product, setProduct] = useState([]);

  
  const [isBasy, setIsBasy] = useState(false);

  const lang = React.useRef('');

  lang.current = useSelector((state) => state.language);

  const viewNewProducts = async (lang) => {
    await axiosInstance.post('store/view_latest_products', {
      lang: lang,
    }).then(res => {
      setProduct(res.data.success);
      setIsBasy(true)
    }).catch((err) => {
      console.log("err", err)
    });
  }



  useEffect(() => {
    viewNewProducts(lang.current);
    dispatch(getNavbarColor("#FFFFFF"));
  }, [lang.current]);



  return (
    <>

      
      <section >
        <div className={styles.videoContainer}>

          <video autoPlay muted loop className={styles.video}>
            <source src={Bg} type="video/mp4" />
          </video>

          <div className={styles.caption}>
            <h2>
              {listRef.current.VAR000006_best_AITSP0000000000}<br />
              {listRef.current.VAR000007_quality_AITSP0000000}<br />
              {listRef.current.VAR000008_ever_AITSP0000000000}
            </h2>
          </div>

        </div>

        <div className={`${styles.about} py-5`}>

          <div className='container'>
            <h2>
              {listRef.current.VAR000009_the_first_developed_}<br />
              {listRef.current.VAR000010_for_the_manufacture_}<br />
              {listRef.current.VAR000011_molasses_in_egypt_AI}
            </h2>
            <p>
              {listRef.current.VAR000012_al_baraka_factory_fo}<br />
              {listRef.current.VAR000013_packaging_of_molasse}<br />
              {listRef.current.VAR000014_manufacture_of_high_}

            </p>
            <button className={`${styles.contactBtn}`}>
              {listRef.current.VAR000004_contact_us_AITSP0000}
            </button>
          </div>
        </div>


          {/* <div className={`${styles.product} `}>
          <div className='container'>
            <div className={`${styles.underLay} position-relative`}>
              <h2>{listRef.current.VAR000016_best_seller_AITSP000}</h2>
            </div>

            <div className={`workTestimonoals `} dir='ltr'>
              <OwlCarousel className="owl-carousel owl-theme" {...options}>
                {molasses.map((molasse, index) => {

                  return (
                    <div key={index} className={` item`}>
                      <Image src={molasse.src} alt="image slider" className='w-100' style={{ height: "500px" }} />
                      <h2 className={`${styles.sliderHead}`}>Morana molasses</h2>
                    </div>
                  )
                }
                )}
              </OwlCarousel>

            </div>

            <div className='d-flex justify-content-center mt-5'>
           
                <Link className={`${styles.contactBtn} text-decoration-none`} href="/product" >
                {listRef.current.VAR000017_shob_now_AITSP000000}
                </Link>
        
            </div>

          </div>
        </div> */}

          <div className={`${styles.productTwo} py-5`}>
            <div className='container'>
              <div className={`${styles.underLay} position-relative`}>
                <h2>{listRef.current.VAR000018_new_products_AITSP00}</h2>
              </div>
              {isBasy?(
                  <>
              <div className={`workTestimonoals `} dir='ltr'>
                <OwlCarousel className="owl-carousel owl-theme" {...options}>
                  {product.map((prod, index) => {

                    return (
                      <div key={index} className={` item`}>
                        <div className='d-flex justify-content-center'>
                          <Link href={`product/${prod.id}`} className='text-decoration-none'>
                            <img
                              src={`data:image/png;base64,${prod.image}`}
                              alt="image slider" className='rounded-2' style={{ height: "350px" }}
                            />
                          </Link>

                        </div>

                        <Link href={`product/${prod.id}`} className='text-decoration-none'>
                          <h2 className={`${styles.sliderHead}`}>{prod.name}</h2>
                        </Link>

                      </div>
                    )
                  }
                  )}
                </OwlCarousel>

              </div>
                  </>
              ):(
                <>
              
                </>
              )}


              <div className='d-flex justify-content-center mt-5'>
                <Link className={`${styles.contactBtn} text-decoration-none`} href="/product" >
                  {listRef.current.VAR000017_shob_now_AITSP000000}
                </Link>
              </div>


            </div>
          </div>

          <div className={`${styles.layImage}`}>

          </div>


      </section>

    </>
  )
}

export default Home;



