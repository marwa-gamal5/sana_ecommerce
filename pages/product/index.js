import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { useSelector, useDispatch } from 'react-redux';
import { getFavCount, getNavbarColor } from '../../store/actions';
import style from './product.module.css';
// import goOne from '../../public/assets/image/goOne.png';
import { FaCircleArrowRight } from "react-icons/fa6";


import fav from '../../public/assets/image/fav.png';
import favFill from '../../public/assets/image/favFill.png';
import Image from 'next/image';


import Swal from "sweetalert2";

function Product() {


  
  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();

  const lang = useRef();

  lang.current = useSelector((state) => state.language);

  const [product, setProduct] = useState([]);

  const [categories, setCategories] = useState([]);


  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }


  const viewAllCategories = async (lang) => {
    await axiosInstance.post('store/view_all_categories', {
      lang: lang,
    }).then(res => {
      setCategories(res.data.success);
    }).catch((err) => {
      console.log("err", err)
    });
  }

  const viewAllProduct = async (lang) => {
    await axiosInstance.post('store/view_all_products', {
      lang: lang,
    }).then(res => {
      setProduct(res.data.success);
    }).catch((err) => {
      console.log("err", err)
    });
  }



  const visittoken = localStorage.getItem("visitToken");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [favArr, setFavArr] = useState([]);


  const addFavorite = async (userId, id, token1) => {
    await axiosInstance.post('user/add_favorite_product', {
      id: userId,
      product_id: id,
      token: token1
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
      } else {
        showAlert(listRef.current[res.data.success], "success");
      }

      if (token == null) {
        if (visittoken != null) {
          viewFavoriteProducts(0, visittoken, lang.current);
        }
      } else {
        viewFavoriteProducts(userId, token, lang.current);
      }

    }).catch((err) => {
      console.log("err", err)
    });
  }



  const viewFavoriteProducts = async (id, token, lang) => {
    await axiosInstance.post('user/get_favorite_products', {
      lang: lang,
      token: token,
      id: id
    }).then(res => {
      dispatch(getFavCount(res.data.success.length));
      setFavArr(res.data.success);
    }).catch((err) => {
      console.log("err", err)
    });
  }




  const removeFavorite = async (userId, id, token1) => {
    await axiosInstance.post('user/remove_favorite_product', {
      id: userId,
      product_id: id,
      token: token1
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
      } else {
        showAlert(listRef.current[res.data.error], "error");
      }

      if (token == null) {
        if (visittoken != null) {
          viewFavoriteProducts(0, visittoken, lang.current);
        }
      } else {
        viewFavoriteProducts(userId, token, lang.current);
      }
    }).catch((err) => {
      console.log("err", err)
    });
  }


  useEffect(() => {
    dispatch(getNavbarColor("#FFFFFF"));

    viewAllCategories(lang.current);
    viewAllProduct(lang.current);

    if (token == null) {
      if (visittoken != null) {
        viewFavoriteProducts(0, visittoken, lang.current);
      }
    } else {
      viewFavoriteProducts(userId, token, lang.current);
    }

  }, [lang.current]);




  return (
    <>
      <section>
        <div className={`${style.product}`}>
        </div>

        <div className='container'>

          <div className={`${style.about} `}>

            <div className={`${style.underLay} mb-3 position-relative`}>
              <h2>{listRef.current.VAR000041_categories_AITSP0000}</h2>
            </div>
            <div className='row'>
              {categories.map((cat, index) => {
                return (
                  <div key={index} className='col-lg-3 col-md-6'>
                    <div className='text-center'>
                      <img src={`data:image/png;base64,${cat.org.image}`} alt="image one" className='w-100 rounded-2' style={{ height: "180px" }} />
                      <h5>{cat.trans.name}</h5>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={`${style.allProduct} `}>
            {product.map((cat, index) => {
              return (
                <div key={index}>
                  <h4>{cat.category.name}:</h4>
                  <div className='row'>
                    {cat.product.map((prod, index) => {
                      const isFavorite = favArr.some((ele) => ele.id === prod.id);
                      return (
                        <div key={index} className='col-lg-3 col-md-6 mb-4'>
                          <div className='bg-white p-2 shadow-lg rounded-2 position-relative'>
                            {isFavorite ? (
                              <Image
                                type="button"
                                className={`${style.fav}`}
                                src={favFill}
                                alt="image one"
                                onClick={() => {
                                  if (token) {
                                    removeFavorite(userId, prod.id, token);
                                  } else {
                                    removeFavorite(0, prod.id, visittoken);
                                  }
                                }}
                              />
                            ) : (
                              <Image
                                type="button"
                                className={`${style.fav}`}
                                src={fav}
                                alt="image one"
                                onClick={() => {
                                  if (token) {
                                    addFavorite(userId, prod.id, token);
                                  } else {
                                    addFavorite(0, prod.id, visittoken);
                                  }
                                }}
                              />
                            )}

                            <img
                              src={`data:image/png;base64,${prod.image}`}
                              alt="image one"
                              className='w-100 rounded-2'
                              style={{ height: "250px" }}
                            />
                            <h5>{prod.name}</h5>
                            <div className='d-flex justify-content-between'>
                              <h5>{prod.price}</h5>
                              <Link
                                href={`product/${prod.id}`}
                                className='text-decoration-none'
                              >
                                {/*<Image className={`${style.goOne}`} src={goOne} alt="image one" />*/}
                                <FaCircleArrowRight color="#AE4829" style={{ fontSize: '30px' }} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section >
    </>
  )
}

export default Product;



