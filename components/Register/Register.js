import * as React from 'react';


import { useState, useEffect, useRef } from 'react';
import { useDispatch , useSelector} from 'react-redux';

import style from './Register.module.css';

import { useForm } from "react-hook-form";


import { Form, Button } from 'semantic-ui-react';

import Swal from "sweetalert2";

import registerImg from '../../public/assets/image/register.png';

import axiosInstance from '../../axiosConfig/instance';
import { useRouter } from 'next/router';

import Image from 'next/image';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEyeSlash, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getShowLogin, getShowRegister } from '@/store/actions';

import closeImage from '../../public/assets/image/exit-icon.webp'

library.add(faEyeSlash, faEye, faTimes);

function Register() {

    const listRef = React.useRef({});
    listRef.current = useSelector((state) => state.webList);


    const router = useRouter();

    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("")

    const [data, setData] = useState({
        email: "",
        username: "",
        fullname: "",
        password: "",
        re_Password: "",
        phone: "",
    });


    const { register, handleSubmit, reset, formState } = useForm();

    const { errors } = formState

    function showAlert(message, icon) {
        Swal.fire({
            title: message,
            icon: icon,
            showConfirmButton: false,
            timer: 1500
        });
    }

    function onSubmit(data) {
        if (data.password == data.re_password) {

            axiosInstance.post(`/user/reg/`, {
                email: data.email,
                fullname: data.fullname,
                username: data.username.toLowerCase(),
                password: data.password,
                re_password: data.re_password,
                phone: data.phone,
            }).then((res) => {

                if (res.data.success) {
                    showAlert(listRef.current[res.data.success], "success");
                    document.getElementById("form").innerHTML = `<div className="text-center ">
                            <h4 className="text-capitalize fw-bold">
                           check your email for verification
                            </h4>
                            </div>` ;
                } else {
                    if (res.data.error == "too_many_requests") {

                        router.push('/');
                        dispatch(getShowRegister(false));
                    } else {
                        showAlert(listRef.current[res.data.error], "error");
                    }
                }


            })
                .catch((err) => {
                    console.log("error: ", err);
                });

        } else {
            document.getElementById('confirm').innerHTML = listRef.current.VAR000120_passwords_not_match_;
        }

        return false
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



    const showEyeConfirm = (e) => {
        e.preventDefault();

        let eyeSlash = document.getElementById('eyeSlashConfirm');
        let eye = document.getElementById('eyeConfirm');
        let input = document.getElementById("re_password");

        eyeSlash.classList.add('d-none');
        eye.classList.remove('d-none');
        if (input.getAttribute('type') == 'password') {
            input.setAttribute('type', 'text');
        };

    }


    const hiddenEyeConfirm = (e) => {
        e.preventDefault();

        let eyeSlash = document.getElementById('eyeSlashConfirm');
        let eye = document.getElementById('eyeConfirm');
        let input = document.getElementById("re_password");

        eye.classList.add('d-none');
        eyeSlash.classList.remove('d-none');

        if (input.getAttribute('type') == 'text') {
            input.setAttribute('type', 'password');
        };

    }


    const dispatch = useDispatch();

    return (
        <>


            <section className={`${style.login} `}>
                <div className={`${style.row} `}>
                    <div className={`row`}>
                        <div className='col-md-6 d-md-block d-none' >
                            <Image src={registerImg} style={{ width: "100%" }} alt="login_img" />
                        </div>
                        <div className='col-md-6'>

                            <div className={`${style.beforeForm}`}>
                                <div className={`${style.form}`}>

                                    <h2 className="text-center fw-bold">{listRef.current.VAR000123_get_started_AITSP000}</h2>
                                    <p className='text-center text-lowercase'>{listRef.current.VAR000122_create_your_account_}</p>
                                    <Form id="form" onSubmit={handleSubmit(onSubmit)} className="reg ">
                                        <Form.Field>
                                            <label className=" my-1">{listRef.current.VAR000124_full_name_AITSP00000}</label>
                                            <input id="fullname" type="text" className={`form-control  input  ${errors.fullname ? 'is-invalid' : ''}`}
                                                name="fullname" autoComplete="name"
                                                placeholder={listRef.current.VAR000124_full_name_AITSP00000} {...register("fullname", {
                                                    required: true, minLength: 10,
                                                })} />
                                            {errors.fullname && <p className='text-danger mt-2'>{listRef.current.VAR000131_check_AITSP000000000} {listRef.current.VAR000061_username_AITSP000000}</p>}
                                        </Form.Field>
                                        <Form.Field>
                                            <label className=" my-1">{listRef.current.VAR000061_username_AITSP000000}</label>
                                            <input id="username" type="text" className={`form-control  input  ${errors.username ? 'is-invalid' : ''}`}
                                                name="username" autoComplete="username"
                                                placeholder={listRef.current.VAR000061_username_AITSP000000}   {...register("username", {
                                                    required: true, minLength: 8,
                                                    pattern: /^[a-zA-Z]{8,15}$/,
                                                })} />
                                            {errors.username && <p className='text-danger mt-2'>{listRef.current.VAR000131_check_AITSP000000000} {listRef.current.VAR000061_username_AITSP000000}</p>}
                                        </Form.Field>
                                        <Form.Field>
                                            <label className=" my-1">{listRef.current.VAR000125_email_AITSP000000000}</label>
                                            <input id="email" type="email"
                                                className="form-control input" name="email"
                                                autoComplete="email"
                                                placeholder={listRef.current.VAR000125_email_AITSP000000000}  {...register("email", {
                                                    required: true,
                                                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                                })} />
                                            {errors.email && <p className='text-danger mt-2'>{listRef.current.VAR000131_check_AITSP000000000} {listRef.current.VAR000125_email_AITSP000000000}</p>}
                                        </Form.Field>
                                        <Form.Field>
                                            <label className=" my-1">{listRef.current.VAR000126_phone_AITSP000000000}</label>
                                            <input type="tel" id="phone" name="phone"
                                                className={`form-control mb-3 input  ${errors.phone ? 'is-invalid' : ''}`} required
                                                placeholder={listRef.current.VAR000126_phone_AITSP000000000}  {...register("phone", {
                                                    required: true,
                                                    minLength: 11,

                                                })} />
                                            {errors.phone && <p className='text-danger mt-2'>{listRef.current.VAR000131_check_AITSP000000000} {listRef.current.VAR000126_phone_AITSP000000000}</p>}
                                        </Form.Field>
                                        <Form.Field>
                                            <label className=" my-1">{listRef.current.VAR000062_password_AITSP000000}</label>
                                            <div className="position-relative">
                                                <input id="password" type="password" required
                                                    className={`input form-control mb-2  ${errors.password ? 'is-invalid' : ''}`} name="password"
                                                    placeholder={listRef.current.VAR000062_password_AITSP000000} {...register("password", {
                                                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
                                                        required: true
                                                    })}
                                                    onChange={e => setPassword(e.target.value)} />

                                                <FontAwesomeIcon id="eyeSlash" icon={faEyeSlash} className={` ${style.show_pass} position-absolute`} onClick={(e) => {
                                                    showEye(e)
                                                }} />
                                                <FontAwesomeIcon id="eye" icon={faEye} className={` ${style.show_pass} d-none position-absolute`} onClick={(e) => {
                                                    hiddenEye(e)
                                                }} />
                                            </div>
                                            {errors.password && <p className='text-danger'>{listRef.current.VAR000131_check_AITSP000000000} {listRef.current.VAR000062_password_AITSP000000}</p>}

                                        </Form.Field>
                                        <Form.Field>
                                            <label className=" my-1">{listRef.current.VAR000127_confirm_password_AIT}</label>
                                            <div className="position-relative">
                                                <input id="re_password" type="password" className={`input form-control  mb-2 ${errors.re_password ? 'is-invalid' : ''}`}
                                                    name="re_password" {...register('re_password', {
                                                        required: true,
                                                    })} required
                                                    placeholder={listRef.current.VAR000127_confirm_password_AIT}
                                                    onChange={e => setPasswordAgain(e.target.value)} />

                                                <FontAwesomeIcon id="eyeSlashConfirm" icon={faEyeSlash} className={` ${style.show_pass} position-absolute`} onClick={(e) => {
                                                    showEyeConfirm(e)
                                                }} />
                                                <FontAwesomeIcon id="eyeConfirm" icon={faEye} className={` ${style.show_pass} d-none position-absolute`} onClick={(e) => {
                                                    hiddenEyeConfirm(e)
                                                }} />
                                            </div>
                                            {errors.re_password && <p className=' text-danger'>{listRef.current.VAR000120_passwords_not_match_}</p>}

                                        </Form.Field>

                                        <Button type="submit" className={`${style.btn_login} btn mt-2 mb-1 text-capitalize fw-bold `}>{listRef.current.VAR000130_register_AITSP000000}</Button>
                                        <p className='text-muted text-lowercase'>{listRef.current.VAR000128_already_have_an_acco} ?
                                            <span type="button" onClick={() => {
                                                dispatch(getShowLogin(true));
                                                dispatch(getShowRegister(false));
                                            }}>{listRef.current.VAR000129_log_in_AITSP00000000}</span>
                                        </p>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={`${style.close}`} onClick={() => {
                        dispatch(getShowRegister(false))
                    }} >
                        <Image src={closeImage} alt="close Image" style={{ width: "40px", height: "40px" }} />
                    </button>
                </div>
            </section>

        </>

    );
}


export default Register;