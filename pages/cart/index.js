import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { useSelector, useDispatch } from 'react-redux';
import { getCartCount , getNavbarColor } from '../../store/actions';

import Swal from "sweetalert2";
import style from './cart.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faSquarePlus, faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
library.add(faTrashAlt, faSquarePlus, faSquareMinus);

function Cart() {


  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);

  const [quantity, setQuantity] = useState([]);
  const [quantityPrice, setQuantityPrice] = useState([]);
  const [arrPrice, setArrPrice] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);

  const visittoken = localStorage.getItem("visitToken");
  const token = localStorage.getItem("token");

  const lang = useRef();
  lang.current = useSelector((state) => state.language);

  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }


  function DeleteAlert(id) {
    Swal.fire({
      title: "Are you sure ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1dbf73',
      cancelButtonColor: '#d33',
      confirmButtonText: "delete",
      cancelButtonText: "cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
      }
    })
  }

  async function getCartData(token, lang) {

    axiosInstance.post('payment/get_cart', {
      token: token,
      lang: lang
    }).then(res => {
      if (res.data.cart == 'no_items') {
        setCart([]);
        dispatch(getCartCount(0));
      } else {


        dispatch(getCartCount(res.data.cart.length));
        setCart(res.data.cart);

        setTotalPrice(0);

        let total = 0

        res.data.cart.map((cart, index) => {
          quantity[index] = cart[2];
          arrPrice[index] = cart[13];
          quantityPrice[index] = cart[13] * cart[2];

          total = total + (cart[13] * cart[2]);

        });



        setQuantity([...quantity]);
        setArrPrice([...arrPrice]);
        setQuantityPrice([...quantityPrice]);
        setTotalPrice(total);

      }

    }).catch(err => {
      console.log("error ", err)
    });

  }


  async function updateQuantity(id, sizeOrWeight, quantity) {
    axiosInstance.post('payment/update_quantity', {
      token: visittoken,
      id: id,
      size_or_weight: sizeOrWeight,
      quantity: quantity
    }).then(res => {
      getCartData(visittoken, lang.current);
    }).catch(err => {
      console.log(err);
    });
  }


  async function deleteProduct(id) {
    axiosInstance.post('payment/remove_from_cart', {
      id: id,
    }).then(res => {
      getCartData(visittoken, lang.current);
      showAlert(listRef.current[res.data.success], "success");
    }).catch(err => {
      console.log(err);
    });
  }


  useEffect(() => {
    if (token == null) {
      if (visittoken != null) {
        getCartData(visittoken, lang.current)
      }
    } else {
      getCartData(token, lang.current)
    }
    dispatch(getNavbarColor("#0B2802"));
  }, [lang.current]);



  return (
    <>


      <section className={`mainSction  container py-5`}>
        <div className='container my-5'>
          <div className={`${style.about} `}>
            <div className='container'>
              <div className={`${style.underLay} position-relative`}>
                <h2>{listRef.current.VAR000044_cart_AITSP0000000000}</h2>
              </div>
            </div>
          </div>

          {(cart.length == 0) ? (
            <div>
              <h4 style={{ color: "#0D2F04" }}>{listRef.current.VAR000045_no_product_in_your_c} <Link style={{ color: "#3E6035", fontWeight: 400 }} href="/product">{listRef.current.VAR000046_browse_to_product_AI}?</Link></h4>
            </div>
          ) : (
            <div>

              <div className={`d-md-block d-none`}>
                  <table className={`${style.table} table`}>
                    <thead>
                      <tr>
                        <th scope="col" >{listRef.current.VAR000003_product_AITSP0000000}</th>
                        <th scope="col" className='text-center'>{listRef.current.VAR000055_u_price_AITSP0000000}</th>
                        <th scope="col" className='text-center'>{listRef.current.VAR000056_quantity_AITSP000000}</th>
                        <th scope="col" className='text-center'>{listRef.current.VAR000059_sub_total_AITSP00000}</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((ele, index) => {
                        return (
                          <tr key={index}>
                            <th className={`${style.cart}`}>
                              <div className={`${style.cartImg} `}>
                                <img className=' rounded-2' src={`data:image/png;base64,${ele[10]}`} alt="" />
                              </div>
                              <div className='d-flex align-items-center'>
                                <div>
                                  <h4 className='text-capitalize'>{ele[1]}</h4>
                                  <p className='text-capitalize'>({`${ele[5]} ${ele[11]}`})</p>
                                </div>

                              </div>
                            </th>
                            <td className='text-center'>
                              <p className='text-capitalize fw-bold'>{arrPrice[index]}</p>
                            </td>
                            <td className='text-center'>
                      
                                <FontAwesomeIcon type='button' icon={faSquareMinus} className={`${style.iconQuantity} fs-4`} onClick={() => {
                                  quantity[index] = quantity[index] - 1;
                                  setQuantity(quantity[index]);
                                  setQuantityPrice(cart[13] * (quantity[index] - 1));
                                  updateQuantity(ele[7], ele[6], quantity[index] - 1);
                                }} />

                                <input type='number' className={`${style.inputQuantity} `} value={quantity[index]} onChange={(e) => {
                                  quantity[index] = e.target.value;
                                  setQuantity(quantity);
                                  updateQuantity(ele[7], ele[6], e.target.value);
                                  setQuantityPrice(cart[13] * e.target.value);

                                }} max={cart[8]} />

                                <FontAwesomeIcon type='button' icon={faSquarePlus} className={`${style.iconQuantity} fs-4`} onClick={() => {
                                  quantity[index] = quantity[index] + 1;
                                  setQuantity(quantity[index]);
                                  setQuantityPrice(cart[13] * (quantity[index] + 1));
                                  updateQuantity(ele[7], ele[6], quantity[index] + 1);
                                }} />

                            </td>
                            <td className='text-center'>
                              <p className='text-capitalize fw-bold'>{quantityPrice[index]}</p>
                            </td>
                            <td>

                              <FontAwesomeIcon type="button" icon={faTrashAlt} className='text-danger fs-5' onClick={() => {
                                DeleteAlert(ele[8])
                              }} />
                            </td>
                          </tr>

                        )
                      })
                      }
                    </tbody>
                  </table>
              </div>

              <div className={`${style.table} d-block d-md-none `}>

                  {cart.map((ele, index) => {
                    return (
                      <div key={index}>
                        <div className={`${style.cartMob} row`}>
                          <div className={`${style.cartImg} col-4 p-0`}>
                            <img className='rounded-2' src={`data:image/png;base64,${ele[10]}`} alt="" />
                          </div>
                          <div className='col-7'>
                            <div className='d-flex justify-content-between'>
                              <div>
                                <h4 className='text-capitalize'>{ele[1]}</h4>
                                <p className='text-capitalize'>({`${ele[5]} ${ele[11]}`})</p>
                              </div>

                              <div> 
                                <FontAwesomeIcon type="button" icon={faTrashAlt} className='text-danger fs-5' onClick={() => {
                                  DeleteAlert(ele[8])
                                }} />
                              </div>
                            </div>


                            <div className='d-flex justify-content-between'>
                                <div className='text-center'>
                                    <FontAwesomeIcon type='button' icon={faSquareMinus} className={`${style.iconQuantity} fs-4`} onClick={() => {
                                      quantity[index] = quantity[index] - 1;
                                      setQuantity(quantity[index]);
                                      setQuantityPrice(cart[13] * (quantity[index] - 1));
                                      updateQuantity(ele[7], ele[6], quantity[index] - 1);
                                    }} />

                                    <input type='number' className={`${style.inputQuantity} `} value={quantity[index]} onChange={(e) => {
                                      quantity[index] = e.target.value;
                                      setQuantity(quantity);
                                      updateQuantity(ele[7], ele[6], e.target.value);
                                      setQuantityPrice(cart[13] * e.target.value);

                                    }} max={cart[8]} />

                                    <FontAwesomeIcon type='button' icon={faSquarePlus} className={`${style.iconQuantity} fs-4`} onClick={() => {
                                      quantity[index] = quantity[index] + 1;
                                      setQuantity(quantity[index]);
                                      setQuantityPrice(cart[13] * (quantity[index] + 1));
                                      updateQuantity(ele[7], ele[6], quantity[index] + 1);
                                    }} />

                                </div>
                                <div className='text-center'>
                                  <p className='text-capitalize fw-bold'>{listRef.current.VAR000057_total_AITSP000000000}: {quantityPrice[index]}</p>
                                </div>
                            </div>
                          
                        
                          </div>


                        </div>
                       
                      </div>

                    )
                  })
                  }
              </div>

              <div className='d-flex justify-content-end mt-5'>
                <div className='d-flex'>
                  <div className={`${style.totalToCheck}`}>
                  {listRef.current.VAR000057_total_AITSP000000000}:
                    <span> {totalPrice}</span>
                  </div>
                  <Link className={`${style.btnToCheck} text-decoration-none text-white`} href="/order">
                  {listRef.current.VAR000058_checkout_AITSP000000}
                  </Link>
                </div>
              </div>

            </div>
          )}





        </div>
      </section>
    </>
  )
}

export default Cart;



