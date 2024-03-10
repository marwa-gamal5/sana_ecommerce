import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosConfig/instance';
import Link from 'next/link';
import Image from 'next/image';

import style from './Favorite.module.css';
import favFill from '../../public/assets/image/favFill.png';
import goOne from '../../public/assets/image/goOne.png';
import {getNavbarColor,getFavCount } from '../../store/actions';
import Swal from "sweetalert2";


function Favorite() {

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

    const visittoken = localStorage.getItem("visitToken");
    const token = localStorage.getItem("token");

    const userId = localStorage.getItem("userId");

    const dispatch = useDispatch();


    const [product, setProduct] = useState([]);

    const currentLanguage = useRef();
    currentLanguage.current = useSelector((state) => state.language);

    const viewFavoriteProducts = async (id,token,lang) => {
        await axiosInstance.post('user/get_favorite_products', {
          lang: lang,
          token:token,
          id:id
        }).then(res => {
          dispatch(getFavCount(res.data.success.length));
          setProduct(res.data.success);
        }).catch((err) => {
          console.log("err", err)
        });
      }
      

    
      const removeFavorite = async (userId,id,token) => {
        await axiosInstance.post('user/remove_favorite_product',{
          id:userId,
          product_id:id,
          token:token
        }).then(res => {
          if(res.data.success){
            showAlert(listRef.current[res.data.success], "success");
          }else{
            showAlert(listRef.current[res.data.error], "error");
          }    

          if (token == null) {
            if (visittoken != null) {
              viewFavoriteProducts(0,visittoken,currentLanguage.current);
            }
          } else {
            viewFavoriteProducts(userId,token,currentLanguage.current);
          }
        }).catch((err) => {
          console.log("err", err)
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

      
    useEffect(() => {
        if (token == null) {
          if (visittoken != null) {
            viewFavoriteProducts(0,visittoken,currentLanguage.current);
          }
        } else {
          viewFavoriteProducts(userId,token,currentLanguage.current);
        }
        dispatch(getNavbarColor("#0B2802"));
      }, [currentLanguage.current]);



    return (
        <>
            <section className='mainSction'>

                <div className='container'>

                    <div className={`${style.about} `}>

                        <div className={`${style.underLay} mb-3 position-relative`}>
                            <h2>{listRef.current.VAR000047_favorite_AITSP000000}</h2>
                        </div>

                    </div>

                    <div className={`${style.allProduct} `}>

                        <div className='row'>

                        {(product.length == 0) ? (
                            <div>
                              <h4 style={{ color: "#0D2F04" }}>{listRef.current.VAR000048_no_favorite_products} <Link style={{ color: "#3E6035", fontWeight: 400 }} href="/product">{listRef.current.VAR000046_browse_to_product_AI}</Link></h4>
                            </div>
                          ) : (
                            product.map((prod, index) => {

                              return (
                                  <div key={index} className='col-lg-3 col-md-6  mb-4'>
                                      <div className='bg-white p-2 shadow-lg rounded-2 position-relative'>
                                          <Image type="button" className={`${style.fav}`} src={favFill} alt="image one" onClick={()=>{
                                            
                                              if(token){
                                                  removeFavorite(userId,prod.id,token);
                                                }else{
                                                  removeFavorite(0,prod.id,visittoken);
                                                }
                                          }}/>
                                          <img src={`data:image/png;base64,${prod.image}`} alt="image one" className='w-100 rounded-2' style={{ height: "250px" }} />
                                          <h5>{prod.name}</h5>
                                          <div className='d-flex justify-content-between'>
                                              <Link href={`/product/${prod.id}`} className='text-decoration-none'>
                                                  <Image className={`${style.goOne}`} src={goOne} alt="image one" />
                                              </Link>
                                          </div>
                                      </div>

                                  </div>
                              )
                          })
                          )}
                         

                        </div>

                    </div>


                </div>
            </section >
        </>
    )
}

export default Favorite;