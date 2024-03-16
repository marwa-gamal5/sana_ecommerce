import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosConfig/instance';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getShowSearch } from '@/store/actions';
import style from './Search.module.css';
import { FaCircleArrowRight } from "react-icons/fa6";
// import goOne from '../../public/assets/image/goOne.png';
import fav from '../../public/assets/image/fav.png';
import {getNavbarColor } from '../../store/actions';

function Search() {

    const listRef = React.useRef({});
    listRef.current = useSelector((state) => state.webList);  


    const dispatch = useDispatch();

    const [product, setProduct] = useState([]);

    const router = useRouter();
    const { name } = router.query;

    const currentLanguage = useRef();
    currentLanguage.current = useSelector((state) => state.language);

    const langW = localStorage.getItem("lang_w");


    const postMatch = async () => {
        await axiosInstance.post('store/search_products_pages', {
            name: name,
            lang_w: langW,
            lang: currentLanguage.current,
        }).then(res => {
            setProduct(res.data.success);
        }).catch((err) => {
            console.log("err", err)
        });
    }


    useEffect(() => {
        dispatch(getNavbarColor("#0B2802"));
        if (name) {
            dispatch(getShowSearch(false));
            postMatch();
        }
    },[name,currentLanguage.current]);




    return (
        <>
            <section  className='mainSction'>

                <div className='container'>

                    <div className={`${style.about} `}>

                        <div className={`${style.underLay} mb-3 position-relative`}>
                            <h2>{listRef.current.VAR000113_result_AITSP00000000}</h2>
                        </div>

                    </div>

                    <div className={`${style.allProduct} `}>

                        <div className='row'>
                            {product.map((prod, index) => {

                                return (
                                    <div key={index} className='col-lg-3 mb-4'>
                                        <div className='bg-white p-2 shadow-lg rounded-2 position-relative'>
                                            <Image type="button" className={`${style.fav}`} src={fav} alt="image one" />
                                            <img src={`data:image/png;base64,${prod.image}`} alt="image one" className='w-100 rounded-2' style={{ height: "250px" }} />
                                            <h5>{prod.name}</h5>
                                            <div className='d-flex justify-content-between'>
                                           
                                                <Link href={`/product/${prod.id}`} className='text-decoration-none'>
                                                    {/*<Image src={goOne} alt="image one" />*/}
                                                    <FaCircleArrowRight color="#AE4829" style={{ fontSize: '30px' }} />

                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}

                        </div>

                    </div>


                </div>
            </section >
        </>
    )
}

export default Search;