import * as React from 'react';
import { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {getShowSearch } from '@/store/actions';
import style from './search.module.css';
import axiosInstance from '../../axiosConfig/instance';
import Link from 'next/link';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import closeImage from '../../public/assets/image/exit-icon.webp'

library.add(faSearch);

import { useRouter } from 'next/router';

function Search() {

    const listRef = React.useRef({});
    listRef.current = useSelector((state) => state.webList);  

    const router = useRouter();

    const dispatch = useDispatch();

    const [results, setResults] = useState([]);
    const [input, setInput] = useState("");

    const [testFill, setTestFill] = useState(false);

    const viewAllProduct = async (value) => {
        await axiosInstance.post('store/search_products_list',{
            name:value
        }).then(res => {

           if(res.data.success.length > 0){
        
                localStorage.setItem("lang_w",res.data.lang_w);

                setResults(res.data.success);
                setTestFill(true);
                return;
           }

           
        }).catch((err) => {
            console.log("err", err)
        });
    }


    const handleChange = (value) => {

        setInput(value);

        setTimeout(() => {
        },1000);

        if(value.length>=3){
            viewAllProduct(value);
        }

    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if(testFill == true){
                router.push(`/search/${input}`);
            }

        }
      };


    return (
        <>
            <section className={`${style.login}`}>

                <div className={`${style.search_bar_container}`}>

                    <div className={`${style.input_wrapper}`}>
                        <FontAwesomeIcon className={`${style.searchIcon} fs-3 p-2`}  icon={faSearch}
                        onClick={() => dispatch(getShowSearch(true))}/>
                        
                        <input
                            placeholder= {listRef.current.VAR000020_search_AITSP00000000}
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {results && results.length > 0 &&
                        <div className={`${style.results_list}`}>
                            {results.map((result, id) => {
                                return (
                                    <Link href={`/search/${result.name}`} key={id} className={`${style.search_result} text-decoration-none`}>{result.name}</Link>
                                )
                            })}
                        </div>

                    }

                    <button className={`${style.close}`} onClick={() => dispatch(getShowSearch(false))} >
                        <Image src={closeImage} alt="close Image" style={{ width:"40px" , height:"40px" }}  />  
                    </button>

                </div>
            </section>
        </>
    )
}

export default Search;