import * as React from 'react';
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import style from './Login.module.css';
import Swal from "sweetalert2";
import Image from 'next/image';
import { useDispatch , useSelector} from 'react-redux';
import login from '../../public/assets/image/login.png';

import axiosInstance from '../../axiosConfig/instance';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEyeSlash, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getShowForget, getShowLogin, getShowRegister } from '@/store/actions';
library.add(faEyeSlash, faEye, faTimes);

import closeImage from '../../public/assets/image/exit-icon.webp'

function Login() {

    const listRef = React.useRef({});
    listRef.current = useSelector((state) => state.webList);


    const router = useRouter();

    const dispatch = useDispatch();

    function showAlert(message, icon) {
        Swal.fire({
            title: message,
            icon: icon,
            showConfirmButton: false,
            timer: 1500
        });
    }

    const [username, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = useState(false);


    if (rememberMe) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberMe', rememberMe);
    } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
    }

    let visittoken = localStorage.getItem("visitToken");
    const handleSubmit = (e) => {
        e.preventDefault();
        let { data } = axiosInstance.post(`user/login/`, {
            username: username.toLowerCase(),
            password: password
        }).then(res => {
    console.log("login respons",res.data.user_type)
            if (res.data.error) {
                if (res.data.error == "too_many_requests") {
                    showAlert(listRef.current[res.data.error], "error");
                    router.push('/');
                    dispatch(getShowLogin(false));
                } else {
                    showAlert(listRef.current[res.data.error], "error");
                    document.getElementById('error').innerHTML = listRef.current[res.data.error];
                }
            } else {
                localStorage.setItem("user_info", JSON.stringify(res.data));
                localStorage.setItem("isLogged", true);
                localStorage.setItem('userId', res.data.user_id);

                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);

                    if (visittoken != null) {
                        updateToken(res.data.token,visittoken);
                    } else {
                     
                        dispatch(getShowLogin(false));
                    }
                }
                showAlert(listRef.current[res.data.success], "success");
              
                dispatch(getShowLogin(false));
            }
        });
    };



    function updateToken(token, visittoken) {
        axiosInstance.post(`payment/update_token`, {
            user_token: token,
            vst_token: visittoken
        }).then(res => {


            if (res.data.success) {
                localStorage.setItem("visitToken", token);
            }

        })
            .catch(error => {
                console.log("error", error)
            });
    }


    const showEye = (e) => {
        e.preventDefault();

        let eyeSlash = document.getElementById('eyeSlash');
        let eye = document.getElementById('eye');
        let input = document.getElementById("password");

        eyeSlash.classList.add('d-none');
        eye.classList.remove('d-none');
        if (input.getAttribute('type') == 'password') {
            input.setAttribute('type', 'text');
        };

    }


    const hiddenEye = (e) => {
        e.preventDefault();

        let eyeSlash = document.getElementById('eyeSlash');
        let eye = document.getElementById('eye');
        let input = document.getElementById("password");

        eye.classList.add('d-none');
        eyeSlash.classList.remove('d-none');

        if (input.getAttribute('type') == 'text') {
            input.setAttribute('type', 'password');
        };
    }


    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        const storedRememberMe = localStorage.getItem('rememberMe');

        if (storedRememberMe && storedUsername && storedPassword) {
            setName(storedUsername);
            setPassword(storedPassword);
            setRememberMe(true);
        }
    }, []);


    return (
        <>
     
            <section className={`${style.login}`}>
                <div className={`${style.row} `}>
                    <div className={`row`}>
                        <div className='col-md-6 d-md-block d-none'>
                            <Image src={login}  style={{width:"100%"}} alt="login_img" />
                        </div>
                        <div className='col-md-6'>

                            <div className={`${style.beforeForm}`}>
                                <div className={`${style.form}`}>

                                    <h2 className="text-center fw-bold">{listRef.current.VAR000060_welcome_AITSP0000000}!</h2>
                                    <p className='text-center text-lowercase'>{listRef.current.VAR000135_log_in_to_your_accou} </p>

                                    <form method="POST" onSubmit={handleSubmit}>
                                        <label className="mb-2">{listRef.current.VAR000061_username_AITSP000000}</label>
                                        <input name="username" className=" form-control mb-2 input" type="text"
                                            placeholder={listRef.current.VAR000061_username_AITSP000000}
                                            required autoFocus
                                            value={username}
                                            onChange={e => setName(e.target.value.toLowerCase())} />

                                        <label className="mb-2">{listRef.current.VAR000062_password_AITSP000000}</label>
                                        <div className='position-relative'>
                                            <input id="password" name="password" className="form-control mb-2  input position-relative"
                                                type="password" placeholder="********"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                autoComplete="current-password" />

                                            <FontAwesomeIcon id="eyeSlash" icon={faEyeSlash} className={` ${style.show_pass} position-absolute`} onClick={(e) => {
                                                showEye(e)
                                            }} />
                                            <FontAwesomeIcon id="eye" icon={faEye} className={` ${style.show_pass} d-none position-absolute`} onClick={(e) => {
                                                hiddenEye(e)
                                            }} />
                                        </div>


                                        <div className="d-flex justify-content-between content-forget">
                                            <label>
                                                <input type="checkbox" checked={rememberMe} className={`${style.checkbox}  me-2`}
                                                    onChange={(e) => setRememberMe(e.target.checked)} />
                                              {listRef.current.VAR000063_remember_me_AITSP000
}
                                            </label>

                                            <span className={`${style.sign_up} text-decoration-none `} type="button" onClick={() => {
                                                dispatch(getShowLogin(false));
                                                dispatch(getShowForget(true));
                                            }}>{listRef.current.VAR000064_forgot_password_AITS}</span>

                                        </div>
                                        <p id="error" style={{ color: "red", fontWeight: "bold" }}></p>

                                        <button type="submit" className={`${style.btn_login} btn mt-2 mb-1 text-capitalize fw-bold `}>{listRef.current.VAR000005_log_in_AITSP00000000}</button>
                                        <p className='text-muted text-lowercase'>{listRef.current.VAR000065_donot_have_any_accou}
                                            <span type="button" onClick={() => {
                                                dispatch(getShowLogin(false));
                                                dispatch(getShowRegister(true));
                                            }}>{listRef.current.VAR000094_sign_up_AITSP0000000}</span>
                                        </p>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                    <button className={`${style.close}`} onClick={() => dispatch(getShowLogin(false))} >
                        <Image src={closeImage} alt="close Image" style={{ width:"40px" , height:"40px" }}  />
                    </button>

                </div>


            </section>

        </>
    )
}

export default Login;

