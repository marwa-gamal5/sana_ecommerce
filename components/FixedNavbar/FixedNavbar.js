import * as React from 'react';
import Link from 'next/link';
import style from './FixedNavbar.module.css';

import imgNavbar from "../../public/assets/image/logo sana.png";

import { useState, useEffect, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import classNames from 'classnames'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'next/image'


import { useSelector, useDispatch } from 'react-redux';

import {getLanguage, getWebList, getCartCount, getShowLogin, getShowRegister, getShowForget, getShowSearch, getFavCount } from '../../store/actions';

import axiosInstance from '../../axiosConfig/instance';

import { useRouter } from 'next/router';

import Notifications from '../Notifications/Notifications';


import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faGlobeAmericas, faUser, faSearch, faBars, faHeart, faBell } from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingCart, faGlobeAmericas, faUser, faSearch, faBars, faHeart, faBell);


import Modal from 'react-bootstrap/Modal';

import Login from '../Login/Login';

import Register from '../Register/Register';

import Forget from '../Forget/index';
import Search from '../Search/Search';


import Cookies from 'js-cookie';

function FixedNavbar() {

  const router = useRouter();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [language, setLanguage] = useState([]);

  const dispatch = useDispatch();

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);


  const lang = useRef(null);
  lang.current = Cookies.get('lang') || useSelector((state) => state.language);

  let token = localStorage.getItem('token');


  const visittoken = localStorage.getItem("visitToken");
  

  const cartCount = useRef(null);

  cartCount.current = useSelector((state) => state.cartCount);

  const favCount = useRef(null);

  favCount.current = useSelector((state) => state.favCount);



  const [navitems, setNavitems] = useState({
    signin: "d-block",
    signout: "d-none",
  });

  const userId = localStorage.getItem("userId");

  const navbarColor = useRef(null);
  navbarColor.current = useSelector((state) => state.navbarColor);

  const linkRef = useRef(null);
  const linkRef1 = useRef(null);
  const linkRef2 = useRef(null);
  const linkRef3 = useRef(null);
  const linkRef4 = useRef(null);
  const linkRef5 = useRef(null);
  const linkRef6 = useRef(null);
  const linkRef7 = useRef(null);
  const linkRef8 = useRef(null);
  const linkRef9 = useRef(null);


  const showLogin = useRef(null);

  showLogin.current = useSelector((state) => state.showLogin);


  const showRegister = useRef(null);

  showRegister.current = useSelector((state) => state.showRegister);


  const showForget = useRef(null);

  showForget.current = useSelector((state) => state.showForget);


  const showSearch = useRef(null);

  showSearch.current = useSelector((state) => state.showSearch);



  async function logout() {

    await axiosInstance.post(`user/logout/`, {
      token: token
    }, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    }
    ).then(res => {

      if (res.data.success) {
        localStorage.removeItem('user_info');
        localStorage.removeItem('token');
        localStorage.removeItem('visitToken');
        localStorage.removeItem('userId');
        localStorage.setItem("isLogged", false);


        setNavitems({
          ...navitems,
          signin: "d-block",
          signout: "d-none",
        });
        router.push('/');

      } else {
        if (res.data.error == "too_many_requests") {
          router.push('/');
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }



  async function getVisitToken(token1) {

    await axiosInstance.post('payment/get_token', {
      token: token1
    }).then(res => {
      localStorage.setItem("visitToken", res.data.vst_tok);

      if (token == null) {
        if (res.data.vst_tok != null) {
          getCartData(res.data.vst_tok, lang.current);
          viewFavoriteProducts(0,res.data.vst_tok,lang.current);
        }
      } else {
        getCartData(token,lang.current);
        viewFavoriteProducts(userId,token,lang.current);
      }

    }).catch(err => {
      console.log("error", err)
    });
  }

  async function getCartData(token, lang) {
    await axiosInstance.post('payment/get_cart', {
      token: token,
      lang: lang
    }).then(res => {

      if (res.data.cart == 'no_items') {
        dispatch(getCartCount(0));
      } else {
        dispatch(getCartCount(res.data.cart.length));
      }
    }).catch(err => {
      console.log("error ", err)
    });
  }

  
  const viewFavoriteProducts = async (id,token,lang) => {
    await axiosInstance.post('user/get_favorite_products', {
      lang: lang,
      token:token,
      id:id
    }).then(res => {
        dispatch(getFavCount(res.data.success.length));
    }).catch((err) => {
      console.log("err", err)
    });
  }


  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(`user/langList`);

        setLanguage(response.data.languages);

        dispatch(getWebList(axiosInstance, lang.current));

        if (lang.current) {
          const currentLanguage = response.data.languages.find(
            (l) => l.code === lang.current
          );

          if (currentLanguage.rtl == false) {
            document.body.dir = 'ltr';
          } else {
            document.body.dir = 'rtl';
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

     // end lang list ..........................................

    // start sign in or out ..........................................
     if (token) {
      setNavitems({
        ...navitems,
        signin: "d-none",
        signout: "d-block",
      });
    }

    // end sign in or out ..........................................

    // start color nav ..........................................


    if (navbarColor.current) {
      linkRef.current.style.color = navbarColor.current;
      linkRef1.current.style.color = navbarColor.current;
      linkRef2.current && (linkRef2.current.style.color = navbarColor.current);
      linkRef3.current.style.color = navbarColor.current;
      linkRef4.current.style.color = navbarColor.current;
      linkRef5.current.style.color = navbarColor.current;
      linkRef6.current.style.color = navbarColor.current;
      linkRef7.current.style.color = navbarColor.current;
      linkRef8.current.style.color = navbarColor.current;
      linkRef9.current.style.color = navbarColor.current;
    }

    // end color nav ..........................................

    if (Cookies.get('lang')) {
      dispatch(getLanguage(Cookies.get('lang')));
    }

    if (token == null) {
      if (visittoken == null) {
        getVisitToken('0');
      } else {
        getVisitToken(visittoken);
      }

    } else {
      getVisitToken(token);
    }

  }, [token, visittoken ,lang.current , navbarColor.current ]);



  return (
    <>

      <Navbar collapseOnSelect className={`${style.myNav} d-lg-block d-none position-absolute top-0 start-0 end-0`} expand="lg">

        {/* login modal */}
        <Modal className='modalSpiceal' show={showLogin.current} fullscreen={true} onHide={() => dispatch(getShowLogin(false))}>
          <Modal.Body className='p-0'>
            <Login />
          </Modal.Body>
        </Modal>

        {/* register modal */}
        <Modal className='modalSpiceal' show={showRegister.current} fullscreen={true} onHide={() => dispatch(getShowRegister(false))}>
          <Modal.Body className='p-0'>
            <Register />
          </Modal.Body>
        </Modal>

        {/* forget modal */}
        <Modal className='modalSpiceal' show={showForget.current} fullscreen={true} onHide={() => dispatch(getShowForget(false))}>
          <Modal.Body className='p-0'>
            <Forget />
          </Modal.Body>
        </Modal>

        {/* search modal */}
        <Modal className='modalSpiceal' show={showSearch.current} fullscreen={true} onHide={() => dispatch(getShowSearch(false))}>
          <Modal.Body className='p-0'>
            <Search />
          </Modal.Body>
        </Modal>




        <Container>
          <Navbar.Toggle />

          <Link href="/">
            <Image src={imgNavbar} alt="My image" width={72} />
          </Link>

          <Navbar.Collapse className='flex-grow-0'>
            <Nav className={`${style.nav}`}>

              <Nav.Item>
                <Link className={` ${style.colorlink} nav-link px-3 fw-bolder text-uppercase`}  ref={linkRef} href="/" >
                  {listRef.current.VAR000001_home_AITSP0000000000}
                </Link>
              </Nav.Item>

              <Nav.Item>
                <Link className={`${style.colorlink}  nav-link px-3 fw-bolder text-uppercase`}  ref={linkRef1} href="/about" >
                {listRef.current.VAR000002_about_AITSP000000000}
                </Link>
              </Nav.Item>

              <Nav.Item>
                <Link className={` ${style.colorlink}  nav-link px-3 fw-bolder text-uppercase`} style={{ color: "#0B2802" }} ref={linkRef2} href="/product" >
                {listRef.current.VAR000003_product_AITSP0000000}
                </Link>
              </Nav.Item>


              <Nav.Item>
                <Link className={`${style.colorlink}  nav-link px-3 fw-bolder text-uppercase`} style={{ color: "#0B2802" }} ref={linkRef3} href="/contact" >
                {listRef.current.VAR000004_contact_us_AITSP0000}
                </Link>
              </Nav.Item>


              <Nav.Item>
                <FontAwesomeIcon className={`  ${style.colorlink}  fs-4 p-2`} icon={faSearch}  ref={linkRef7} type='button'
                  onClick={() => dispatch(getShowSearch(true))} />
              </Nav.Item>




              <Dropdown>

                <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                  <FontAwesomeIcon icon="globe-americas" className={` ${style.colorlink}  fs-4 `} style={{ color: "#0B2802" }} ref={linkRef4} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <span className="dropdown-item-text">{listRef.current.VAR000043_language_AITSP000000}</span>
                  </Dropdown.Item>

                  {language.map(({ code, name }, index) => (
                    <Dropdown.Item key={index}
                      className={classNames('dropdown-item', {
                        disabled: lang.current === code,
                      })}
                      onClick={() => {
                        dispatch(getLanguage(code));
                        Cookies.set('lang', code);
                        dispatch(getWebList(axiosInstance, code));
                      }}>
                      {name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>


              <div className={ navitems.signout}>
                <Notifications color="#AE4829" />
              </div>

              <Nav.Item className={""}>
                <Link className={`nav-link `} href="/cart" >

                  <div className='position-relative'>
                    <FontAwesomeIcon className={` ${style.colorlink}  fs-4`} icon={faShoppingCart} style={{ color: "#0B2802" }} ref={linkRef6} />
                    {(cartCount.current > 0) ? (
                      <span className={`${style.cart}`}></span>
                    ) : (
                      <></>
                    )}
                  </div>
                </Link>

              </Nav.Item>

              <Nav.Item>
              <Link className={`nav-link `} href="/favorite" >

                <div className='position-relative'>
                  <FontAwesomeIcon className={` ${style.colorlink}  fs-4 `} icon="heart"   ref={linkRef9}  />
                  {(favCount.current > 0) ? (
                    <span className={`${style.heart}`}></span>
                  ) : (
                    <></>
                  )}
                </div>
                </Link>

                
              </Nav.Item>


              <Dropdown className={"d-flex drop-user  align-items-center  " + navitems.signout}>
                <Dropdown.Toggle name='lang' variant="transparent" id="dropdown-basic" className={`text-white d-flex align-items-center dropnav testPad  ${navitems.signout}`}>
                  <FontAwesomeIcon icon="user" className={`  ${style.colorlink} fs-4 ` + navitems.signout}  ref={linkRef5} />
                </Dropdown.Toggle>
                <Dropdown.Menu className={`${style.profileMenu} my-2`}>
                  <Dropdown.Item href="/profile" as={Link}>{listRef.current.VAR000091_profile_AITSP0000000}</Dropdown.Item>

                  <Dropdown.Item onClick={() => {
                    logout();
                  }}>{listRef.current.VAR000092_logout_AITSP00000000}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              

              <Nav.Item>
                <span className={`nav-link ${style.navLinkSign} ${navitems.signin} fw-bolder text-uppercase`}
                  type='button' onClick={() => dispatch(getShowLogin(true))}>
                    {listRef.current.VAR000005_log_in_AITSP00000000}
                </span>

              </Nav.Item>

            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>


      <Navbar collapseOnSelect className={`${style.myNav} d-block d-lg-none position-absolute top-0 start-0 end-0`} expand="lg">
        <Container>

          <Link href="/">
            <Image src={imgNavbar} alt="My image" width={72} />
          </Link>

          <Navbar.Toggle onClick={handleShow} >
            <FontAwesomeIcon className={`${style.colorlink} fs-4`} ref={linkRef8} icon={faBars} />
          </Navbar.Toggle>


          <Offcanvas className="bg-light" placement="end" show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <Image src={imgNavbar} alt="My image" width={72} />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className={`${style.nav}`}>

                <Nav.Item>
                  <Link className={`  nav-link px-3 ${style.navLinkOffcanvas} fw-bolder text-uppercase`} href="/" >
                  {listRef.current.VAR000001_home_AITSP0000000000}
                  </Link>
                </Nav.Item>

                <Nav.Item>
                  <Link className={`  nav-link px-3 ${style.navLinkOffcanvas} fw-bolder text-uppercase`} href="/about" >
                  {listRef.current.VAR000002_about_AITSP000000000}
                  </Link>
                </Nav.Item>

                <Nav.Item>
                  <Link className={`  nav-link px-3 ${style.navLinkOffcanvas} fw-bolder text-uppercase`} href="/product" >
                  {listRef.current.VAR000003_product_AITSP0000000}
                  </Link>
                </Nav.Item>

                <Nav.Item>
                  <Link className={`  nav-link px-3 ${style.navLinkOffcanvas} fw-bolder text-uppercase`} href="/contact" >
                  {listRef.current.VAR000004_contact_us_AITSP0000}
                  </Link>
                </Nav.Item>

                <Nav.Item>
                <FontAwesomeIcon className={` ${style.colorlink}  fs-4 p-2`} icon={faSearch}  ref={linkRef7} type='button'
                  onClick={() => dispatch(getShowSearch(true))} />
              </Nav.Item>




              <Dropdown>

                <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                  <FontAwesomeIcon icon="globe-americas" className={` ${style.colorlink}  fs-4`}  ref={linkRef4} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <span className="dropdown-item-text">{listRef.current.VAR000043_language_AITSP000000}</span>
                  </Dropdown.Item>

                  {language.map(({ code, name }, index) => (
                    <Dropdown.Item key={index}
                      className={classNames('dropdown-item', {
                        disabled: lang.current === code,
                      })}
                      onClick={() => {
                        dispatch(getLanguage(code));
                        Cookies.set('lang', code);
                        dispatch(getWebList(axiosInstance, code));
                      }}>
                      {name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>


              <div className={ navitems.signout}>
                    <Notifications color={navbarColor.current} />
              </div>

              <Nav.Item className={""}>
                <Link className={`   nav-link mx-2`} href="/cart" >

                  <div className='position-relative d-inline-block'>
                    <FontAwesomeIcon className={` ${style.colorlink}  fs-4`} icon={faShoppingCart} style={{ color: "#0B2802" }} ref={linkRef6} />
                    {(cartCount.current > 0) ? (
                      <span className={`${style.cart}`}></span>
                    ) : (
                      <></>
                    )}
                  </div>
                </Link>

              </Nav.Item>

              <Nav.Item>
              <Link className={`nav-link mx-2`} href="/favorite" >

                <div className='position-relative  d-inline-block'>
                  <FontAwesomeIcon className={` ${style.colorlink}  fs-4 `} icon="heart" style={{ color: "#0B2802" }}  ref={linkRef9}  />
                  {(favCount.current > 0) ? (
                    <span className={`${style.heart}`}></span>
                  ) : (
                    <></>
                  )}
                </div>
                </Link>

                
              </Nav.Item>


              <Dropdown className={`drop-user ` + navitems.signout}>
                  <Dropdown.Toggle name='lang' variant="transparent" id="dropdown-basic" className={`text-white d-flex align-items-center dropnav testPad  ${navitems.signout}`}>
                    <FontAwesomeIcon icon="user" className={`${style.icon} fs-4 ` + navitems.signout} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='my-2 '>
                    <Dropdown.Item href="/profile" as={Link}>{listRef.current.VAR000091_profile_AITSP0000000}</Dropdown.Item>

                    <Dropdown.Item onClick={() => {
                      logout();
                    }}>{listRef.current.VAR000092_logout_AITSP00000000}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              

              <Nav.Item>
                <span className={`nav-link ${style.navLinkSign} ${navitems.signin} fw-bolder text-uppercase`}
                  type='button' onClick={() => dispatch(getShowLogin(true))}>
                    {listRef.current.VAR000005_log_in_AITSP00000000}
                </span>

              </Nav.Item>



              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </>


  )

}


export default FixedNavbar;