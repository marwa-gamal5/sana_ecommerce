import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { useSelector} from 'react-redux';

import style from './Shipping.module.css';
import Swal from "sweetalert2";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import Modal from 'react-bootstrap/Modal';

import closeImage from '../../public/assets/image/exit-icon.webp';

import addImage from '../../public/assets/image/add.png';
import Image from 'next/image';


import { faSquarePlus, faEdit, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
library.add(faSquarePlus, faEdit, faTrashAlt);

library.add(faEye);

function Shipping({ custumerId, defaultShipping, handleInfo }) {

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  const token = localStorage.getItem("token");

  const lang = useRef();
  lang.current = useSelector((state) => state.language);

  const viewAllShipping = async (custumerId) => {
    await axiosInstance.post('user/view_all_shipping', {
      token: token,
      customer_id: custumerId,
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }).then(res => {
      setShipping(res.data.success);
    }).catch((err) => {
      console.log("err", err)
    });
  }

  const [newAddress, setNewAddress] = useState("");

  const AddShipping = async (e) => {
    e.preventDefault();
    await axiosInstance.post('user/add_shipping_address', {
      token: token,
      customer_id: custumerId,
      address: newAddress
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
        e.target.reset();
        let shappingAddress = document.getElementById('shappingAddress');
        if (shappingAddress.classList.contains("d-none") == false) {
          shappingAddress.classList.add("d-none");
        }
        viewAllShipping(custumerId);
      } else {
        showAlert(listRef.current[res.data.error], "error");
      }

    }).catch((err) => {
      console.log("err", err)
    });
  }

  const DeleteShipping = async (id) => {
    await axiosInstance.post('user/delete_shipping_address', {
      id: id
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
        viewAllShipping(custumerId);
      } else {
        showAlert(listRef.current[res.data.error], "error");
      }

    }).catch((err) => {
      console.log("err", err)
    });
  }

  const [shippingForEdit, setShippingForEdit] = useState({});

  const viewOneShipping = async (id) => {
    await axiosInstance.post('user/view_one_shipping', {
      token: token,
      id: id
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.success) {
        setShippingForEdit(res.data.success.shipping_address);
        setNewAddress(res.data.success.shipping_address.address)
      }

    }).catch((err) => {
      console.log("err", err)
    });
  }


  const EditShipping = async (e) => {
    e.preventDefault();
    await axiosInstance.post('user/update_shipping_address', {
      token: token,
      id: shippingForEdit.id,
      address: newAddress
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
        viewAllShipping(custumerId);
        let shappingAddress = document.getElementById('shappingAddressEdit');
        if (shappingAddress.classList.contains("d-none") == false) {
          shappingAddress.classList.add("d-none");
        }
      } else {
        showAlert(listRef.current[res.data.error], "error");
      }

    }).catch((err) => {
      console.log("err", err)
    });
  }


  const setDafaultShippingAddress = async (id) => {

    await axiosInstance.post('user/set_dafault_shipping_address', {
      token: token,
      customer_id: custumerId,
      id: id
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.data.success) {
        showAlert(listRef.current[res.data.success], "success");
        handleInfo();

      } else {
        showAlert(listRef.current[res.data.error], "error");
      }

    }).catch((err) => {
      console.log("err", err)
    });
  }


  function DeleteAlert(type, id) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteShipping(id);

      }
    })
  }

  const [shipping, setShipping] = useState([]);

  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }



  useEffect(() => {
    if (custumerId) {
      viewAllShipping(custumerId);
    }

  }, [custumerId]);


  return (
    <>
      <section className={`${style.main} `}>
        <div className=''>
          <h2 className='mx-3'> {listRef.current.VAR000088_shipping_AITSP000000}</h2>
          <div className=' p-3'>
            {(shipping.length == 0) ? (
              <p>{listRef.current.VAR000104_no_shipping_addresse}</p>
            ) : (
              <>

                {shipping.map((ele, index) => {

                  return (
                    <div key={index} className={`${style.ordrItem} mb-4`} >

                      <div>
                        <h5>{ele[1]}</h5>
                      </div>

                      <div>

                        <input className={`${style.customRadioInput}`} type="radio" defaultChecked={ele[0] === defaultShipping} id={ele[0]} name="Dafault" value={ele[0]} onChange={() => {
                          let id = ele[0];
                          setDafaultShippingAddress(id);
                        }} />

                        <label htmlFor={ele[0]} className='mx-3'>{listRef.current.VAR000089_default_AITSP0000000}</label>

                        <FontAwesomeIcon icon={faEdit} className={`${style.icon} fs-5 ms-2`} onClick={() => {
                          let id = ele[0];
                          viewOneShipping(id);
                          handleModalShow();
                        }} />
                        <FontAwesomeIcon icon={faTrashAlt} className='text-danger fs-5 ms-2' onClick={() => {
                          let id = ele[0];
                          DeleteAlert(id);
                        }} />

                      </div>

                    </div>

                  )

                })}

                <button className={`${style.btnSend} d-flex`} onClick={handleAddModalShow} >
                  <Image src={addImage} alt="close Image" style={{ width: "30px", height: "30px" }} />
                  <span className='fw-bold mx-2 mt-1'>{listRef.current.VAR000087_add_AITSP00000000000}</span>

                </button>

              </>
            )}
          </div>


        </div>
      </section>


      {/* edit */}
      <Modal className='modalSpiceal' show={showModal} fullscreen={true} onHide={handleModalClose}>
        <Modal.Body className='p-0'>
          <div className={`${style.modelOrder}`}>
            <div>
              <div className={`${style.innerModelDiv}`}>
                <h5>
                {listRef.current.VAR000080_edit_AITSP0000000000} {listRef.current.VAR000075_address_AITSP0000000}
                </h5>
              </div>

              <div className={``}>
                <form onSubmit={EditShipping}>
                  <label> {listRef.current.VAR000075_address_AITSP0000000}</label>
                  <input type="text" className={`form-control input `} autoComplete="shappingAddress"
                    placeholder="Add Shapping Address" value={newAddress} onChange={(e) => {
                      setNewAddress(e.target.value)
                    }} />
                  <div className='d-flex justify-content-center mt-3'>
                    <button type='submit' className={`${style.btnSend}`}>
                    {listRef.currentVAR000082_upload_AITSP00000000}
                    </button>
                  </div>

                </form>

              </div>


              <button className={`${style.close}`} onClick={handleModalClose} >
                <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
              </button>

            </div>


          </div>
        </Modal.Body>
      </Modal>

      {/* add */}
      <Modal className='modalSpiceal' show={showAddModal} fullscreen={true} onHide={handleAddModalClose}>

        <Modal.Body className='p-0'>
          <div className={`${style.modelOrder}`}>
            <div>
              <div className={`${style.innerModelDiv}`}>
                <h5>
                {listRef.current.VAR000087_add_AITSP00000000000} {listRef.current.VAR000075_address_AITSP0000000}
                </h5>
              </div>

              <div className={``}>
                <form onSubmit={AddShipping}>
                  <label>{listRef.current.VAR000075_address_AITSP0000000}</label>
                  <input type="text" className={`form-control input `} autoComplete="shappingAddress"
                      placeholder="Add Shapping Address" onChange={(e) => {
                        setNewAddress(e.target.value);
                      }} />
                  <div className='d-flex justify-content-center mt-3'>
                    <button type='submit' className={`${style.btnSend}`}>
                    {listRef.current.VAR000087_add_AITSP00000000000}
                    </button>
                  </div>

                </form>

              </div>


              <button className={`${style.close}`} onClick={handleAddModalClose} >
                <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
              </button>

            </div>


          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Shipping;



