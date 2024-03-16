import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { useSelector, useDispatch } from 'react-redux';
import { getNavbarColor } from '../../store/actions';

import style from './order.module.css';

import Swal from "sweetalert2";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';

import closeImage from '../../public/assets/image/exit-icon.webp';
import Image from 'next/image';


library.add(faEye);

function Order() {

  
  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);


  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);

  const [oneOrders, setOneOrders] = useState({});

  const [orderItems, setOrderItems] = useState([]);


  const visittoken = localStorage.getItem("visitToken");
  const token = localStorage.getItem("token");

  const lang = useRef();
  lang.current = useSelector((state) => state.language);


  async function getOrderData(token, lang) {
    axiosInstance.post('payment/get_orders', {
      token: token,
      lang: lang
    }, {
      headers: {
        "Authorization": `Token ${token}`
      }
    }).then(res => {
      setOrders(res.data.orders);

    }).catch(err => {
    });

  }


  async function getOneOrder(orderId) {
    axiosInstance.post('payment/get_one_order', {
      token: token,
      lang: lang.current,
      order_idd: orderId
    }, {
      headers: {
        "Authorization": `Token ${token}`
      }
    }).then(res => {

      setOneOrders(res.data);
      setOrderItems(res.data.orders);

    }).catch(err => {
      console.log("error ", err)
    });

  }



  async function CancelOrder(orderId) {
    axiosInstance.post('payment/cancel_orders', {
      token: token,
      order_idd: orderId
    }, {
      headers: {
        "Authorization": `Token ${token}`
      }
    }).then(res => {
      if(res.data.success){
    
        showAlert(listRef.current[res.data.success], "success");
        getOrderData(token, lang);
      }

    }).catch(err => {
      console.log("error ", err)
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
        getOrderData(visittoken, lang.current)
      }
    } else {
      getOrderData(token, lang.current)
    }
    dispatch(getNavbarColor("#0B2802"));
  }, [lang.current]);



  return (
    <>
      <section className={`${style.main} `}>
        <div className=''>
          <h2>{listRef.current.VAR000072_your_orders_AITSP000}</h2>
          {orders && orders.map((order, index) => {
            return (
              <div key={index} className={`${style.ordrItem} my-3`}>

                <div className='d-flex align-items-center'>
                  <span></span>
                  <h5>{listRef.current.VAR000070_order_AITSP000000000} {order.order_id}</h5>
                </div>

                <div className='d-flex align-items-center'>

                  <h5 className='mx-2'>{listRef.current.VAR000106_order_placed_AITSP00} {order.order_date}</h5>
                </div>

                <div className='d-flex align-items-center'>
                  <h5 className='mx-2'>{listRef.current.VAR000057_total_AITSP000000000} :{order.total_price}</h5>
                </div>


                <div className='d-flex align-items-center'>
                  <FontAwesomeIcon type='button' id="eye" icon={faEye} className={`${style.icon} fs-6`} onClick={(e) => {
                    getOneOrder(order.order_id);

                    handleModalShow();

                  }} />

                  {(order.order_status == 'pending') ? (
                    <p className='btn btn-outline-danger  fw-bold mb-0 mx-3' onClick={(e) => {
                      CancelOrder(order.order_id)
                    }} >
                      {listRef.current.VAR000107_cancel_AITSP00000000}</p>
                  ) : (
                    <h5 className='mx-3'>{order.order_status}</h5>
                  
                
                  )}



                </div>


              </div>
            )
          })}


        </div>
      </section>




      <Modal className='modalSpiceal' show={showModal} fullscreen={true} onHide={handleModalClose}>

        <Modal.Body className='p-0'>
          <div className={`${style.modelOrder}`}>
            <div>
              <div className={`${style.innerModelDiv} d-flex justify-content-between`}>
                <h5>
                {listRef.current.VAR000108_order_details_AITSP0}
                </h5>
                <h5>
                {listRef.current.VAR000109_arriving_AITSP000000} {oneOrders ? oneOrders.delivery_date : " "}
                </h5>
                <h5>
                  {oneOrders ? oneOrders.shipping_status : " "}
                </h5>

              </div>

              <div className={`${style.innerModelDiv} `}>
                <h5>
                {listRef.current.VAR000088_shipping_AITSP000000}  {listRef.current.VAR000075_address_AITSP0000000} 
                </h5>

                <p>
                  {oneOrders ? oneOrders.shipping_address : " "}
                </p>





                <h5 className='mt-4'>
                {listRef.current.VAR000110_order_items_AITSP000}
                </h5>
              </div>

              <div className={``}>
                {orderItems.map((item, index) => {
                  return (
                    <div key={index} className='d-flex'>

                      <div className={`${style.itemImg} mb-2`}>
                        <img src={`data:image/png;base64,${item.product_image}`} alt="" />
                      </div>
                      <div className='d-flex align-items-center'>
                        <div>
                          <h5 className='text-capitalize'>{item.product_name}</h5>
                          <p className='text-capitalize'>({`${item.size_or_weight_value} ${item.size_or_weight_unit}`})</p>
                          <p className='text-capitalize'>{item.price}</p>
                        </div>

                      </div>
                    </div>

                  )
                })
                }
              </div>


              <button className={`${style.close}`} onClick={handleModalClose} >
                <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />

              </button>

            </div>

          </div>
        </Modal.Body>



      </Modal>

    </>
  )
}

export default Order;



