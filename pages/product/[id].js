import * as React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import style from './product.module.css';
import axiosInstance from '../../axiosConfig/instance';
import { useState, useEffect, useRef } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSquarePlus, faSquareMinus } from '@fortawesome/free-regular-svg-icons';
library.add(faSquarePlus, faSquareMinus);
import { getCartCount, getNavbarColor } from '../../store/actions';
import Link from 'next/link';
import fav from '../../public/assets/image/fav.png';
import Image from 'next/image';
import goOne from '../../public/assets/image/goOne.png';
import Accordion from 'react-bootstrap/Accordion';

import zoom from '../../public/assets/image/zoom.png';

function Product() {

    
  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();

  const [images, setImages] = useState([]);

  const [img, setImg] = useState("");

  const [quantityPrice, setQuantityPrice] = useState("");

  const [quantity, setQuantity] = useState(1);

  function showAlert(message, icon) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 1500
    });
  }


  const hoverHandler = (image, i) => {
    setImg(image);

    for (var j = 0; j < images.length; j++) {
      if (i !== j && refs.current[j]) {
        refs.current[j].style.border = 'none';
      }
    }
  };

  const refs = useRef([]);
  refs.current = [];
  const addRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  const router = useRouter();
  const { id } = router.query;

  let token = localStorage.getItem('token');

  const lang = useRef();
  const [products, setProducts] = useState([]);

  const [product, setProduct] = useState({});


  const [related, setRelated] = useState([]);

  const [certificates, setCertificates] = useState([]);

  lang.current = useSelector((state) => state.language);

  const viewOneProduct = async (lang) => {

    try {
      const res = await axiosInstance.post('store/view_one_product', {
        id: id,
        lang: lang,
      });

      setProducts(res.data.success);
      setProduct(res.data.success[0]);
      setImages(res.data.success[0].imgs);
      setImg(res.data.success[0].imgs[0]);

      setQuantityPrice(res.data.success[0].price);

      setCertificates(res.data.success[0].certificates);

    } catch (err) {
      console.log('err', err);
    }
  };


  useEffect(() => {
    if (id) {
      viewOneProduct(lang.current);
      getRelated(lang.current);
    }

  }, [lang.current, id]);


  let visitToken = localStorage.getItem("visitToken");

  function AddToCart() {
    if (token == null) {
      if (visitToken) {
        addCart(visitToken)
      }

    } else {
      addCart(token)
    }

  }

  const cartCount = useSelector((state) => state.cartCount);

  const addCart = async (token) => {

    try {
      const res = await axiosInstance.post(
        'payment/add_to_cart',
        {
          id: id,
          token: token,
          prod_price: product.price,
          prod_discount: 0,
          prod_name: product.name,
          prod_quantity: quantity,
          size_or_weight: product.size_or_weight,
          size_or_weight_idf: product.size_or_weight_id
        });

      if (res.data.error) {
        showAlert(listRef.current[res.data.error], "error");
      } else {
        showAlert(listRef.current[res.data.success], "success");
        dispatch(getCartCount(cartCount + 1));
      }

    } catch (err) {
      console.log('err', err);
    }
  };


  useEffect(() => {
    dispatch(getNavbarColor("#0B2802"));
  }, []);


  const getRelated = async (lang) => {

    try {
      const res = await axiosInstance.post('store/related_products', {
        id: id,
        lang: lang,
      });

      setRelated(res.data.success);

    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <>
      <section className={`${style.oneProduct}`}>
        <div className={`container`} >

          <div className='row'>
            <div className={`col-lg-1 col-2`}>

              <div className={`${style.left_1}`}>
                {images.map((image, i) => (
                  <div
                    className={`${style.img_wrap}`}
                    key={i}
                    onMouseOver={() => hoverHandler(image, i)}
                    ref={addRefs} >
                    <img src={`data:image/png;base64,${image}`} alt="" />
                  </div>
                ))}

              </div>


            </div>
            <div className={` col-lg-5 col-10 mb-4`}>
              <div className={` ${style.left_2}`}>
                <InnerImageZoom className={` ${style.left_2Img}`} src={`data:image/png;base64,${img}`} zoomScale={1.5} zoomPreload={true} />
              </div>

              {/* <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: 'Wristwatch by Ted Baker London',
                                    isFluidWidth: true,
                                    src:`data:image/png;base64,${img}`,
                                },
                                largeImage: {
                                    src:`data:image/png;base64,${img}`,
                                    width: 1200,
                                    height: 1200,
                                },
                                enlargedImageContainerDimensions: {
                                    width: '180%',
                                    height: '150%',
                                },
                            }}
                        /> */}
            </div>
            <div className={`col-lg-6 col-12`}>
              <div className={`${style.detailsBefore}`}>
                <div className={`${style.details}`}>
                  <div className='d-flex justify-content-between'>
                    <h2 className='text-capitalize'>{product ? product.name : " "}</h2>
                    <h6>{product ? product.price : " "}</h6>
                  </div>

                  {/* <div className='d-flex justify-content-between'>
                  <p className='text-capitalize fw-bold'>category : <span className='text-info'>{product ? product.category : " "}</span></p>
                  <p className='text-capitalize fw-bold'>seller : <span className='text-info'>{product ? product.seller_name : " "}</span></p>
                </div>
                <hr />
                <p className='text-capitalize text-muted fw-bold'>price : <span className='text-danger'>{price}</span></p>
                <p className='text-capitalize text-muted fw-bold'>{product ? product.size_or_weight : " "} : <span className='text-black'>{product ? megure : " "}</span></p>
                 */}
                  <div className='d-flex my-2'>
                    {
                      products.map((prod, index) => {
                        return (
                          <span id={prod.size_or_weight_id} type="button" className='border border-1 mx-2 p-2' key={index} onClick={(e) => {
                            let indexSize = products.findIndex((ele) => {
                              return ele.size_or_weight_id == e.target.id;
                            });

                            setProduct(products[indexSize]);
                            setImages(products[indexSize].imgs);
                            setImg(products[indexSize].imgs[0]);

                          }}>
                            {prod.value} {prod.unit}
                          </span>
                        )

                      })
                    }
                  </div>

                  <div className='my-4'>

                    <FontAwesomeIcon icon={faSquareMinus} className={`${style.iconQuantity} fs-4`} onClick={() => {
                      setQuantity(quantity - 1);
                      setQuantityPrice(product.price * (quantity - 1));
                    }} />

                    <input type='number' className={`${style.inputQuantity} `} value={quantity} onChange={(e) => {
                      setQuantity(e.target.value);

                      setQuantityPrice(product.price * e.target.value);

                    }} max={product.max_order} />

                    <FontAwesomeIcon icon={faSquarePlus} className={`${style.iconQuantity} fs-4`} onClick={() => {
                      setQuantity(quantity + 1);
                      setQuantityPrice(product.price * (quantity + 1));
                    }} />

                  </div>

                  <h6>{quantityPrice}</h6>
                  {/* <p className='text-capitalize text-muted fw-bold'>vendor : <span className='text-black'>{product ? product.vendor : " "}</span></p>
                <p><span>{product ? product.description : " "}</span></p> */}
                  {(product.stock < 5) ? (
                    <p className='d-flex justify-content-end'><span className='text-danger'>{product ? `Only ${product.stock} left` : " "}</span></p>
                  ) : (
                    <></>
                  )}
                  <button className={`${style.cartBtn} mt-5`} onClick={AddToCart}>
                  {listRef.current.VAR000093_add_to_cart_AITSP000}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='my-5'>
            <p>{product ? product.description : " "}</p>
          </div>

          <div className='my-5'>


            <div className={`${style.accordion} mt-5 accordion`}>
              <Accordion >

                <Accordion.Item className={`${style.accordionOne}`} eventKey="0">
                  <Accordion.Header>{listRef.current.VAR000049_ingredients_AITSP000}</Accordion.Header>
                  <Accordion.Body>
                    <p>{product ? product.ingredients : " "}</p>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>{listRef.current.VAR000050_benefits_AITSP000000}</Accordion.Header>
                  <Accordion.Body>
                    <p>{product ? product.benifits : " "}</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>{listRef.current.VAR000051_how_to_use_AITSP0000}</Accordion.Header>
                  <Accordion.Body>
                    <p>{product ? product.how_to : " "}</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>{listRef.current.VAR000052_certified_AITSP00000}</Accordion.Header>
                  <Accordion.Body>
                    <div className={`row ${style.static} `} >
                      {certificates.map((ele, index) => {
                      return(
                 
                          <div className={`position-relative col-lg-4 mb-2`}  key={index}>
                            <img src={`data:image/png;base64, ${ele}`}
                              alt="avatar"
                              className={` w-100`}
                              style={{ height: "160px" }}
                              fluid />
                            <Image type="button" src={zoom} alt="image one" onClick={() => {
                           
                            }} className='position-absolute bottom-0 end-0 m-3' />
                          </div>
                        
                    
                      )
                    
                      })
                  }
                    </div>
                 

                  </Accordion.Body>
                </Accordion.Item>

              </Accordion>
            </div>

          </div>

          <div className={`${style.aboutOne} my-5`}>
            <div className='container'>
              <div className={`${style.underLay} mb-5 position-relative`}>
                <h2>{listRef.current.VAR000053_related_products_AIT}</h2>
              </div>
              <div className={`${style.allProduct} `}>

                <div className='row'>
                  {related.map((prod, index) => {
                    return (
                      <div key={index} className='col-lg-3 mb-4'>
                        <div className='bg-white p-2 shadow-lg rounded-2 position-relative'>
                          <Image type="button" className={`${style.fav}`} src={fav} alt="image one" />
                          <img src={`data:image/png;base64,${prod.image}`} alt="image one" className='w-100 rounded-2' style={{ height: "250px" }} />
                          <div className='d-flex justify-content-between'>
                            <h5>{prod.name}</h5>
                            <Link href={`${prod.id}`} className='text-decoration-none mt-2'>
                              <Image className={`${style.goOne}`} src={goOne} alt="image one" />
                            </Link>
                          </div>

                        </div>

                      </div>
                    )
                  })}

                </div>


              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default Product;
