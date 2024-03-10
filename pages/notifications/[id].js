import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import axiosInstance from '../../axiosConfig/instance';

import { useRouter } from 'next/router';

import style from './Notifications.module.css';

import { getNavbarColor, getNotificationstCount } from '../../store/actions';

function Search() {

    const listRef = React.useRef({});
    listRef.current = useSelector((state) => state.webList);  



    const token = localStorage.getItem("token");
    const dispatch = useDispatch();


    const [Notification, setNotification] = useState({});

    const router = useRouter();
    const { id } = router.query;

    const viewOneNotifications = async () => {
        await axiosInstance.post('user/view_one_notifications', {
            token: token,
            id: id
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            setNotification(res.data.success);
            viewNotifications();
        }).catch((err) => {
            console.log("err", err)
        });
    }


    const viewNotifications = async () => {
        await axiosInstance.post('user/view_all_notifications', {
            token: token,
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            let elements = res.data.success.filter((ele)=> ele[3] == false);
            dispatch(getNotificationstCount(elements.length));

        }).catch((err) => {
            console.log("err", err)
        });
    }

    useEffect(() => {
        dispatch(getNavbarColor("#0B2802"));
        if (id) {
            viewOneNotifications();
        }
    }, [id]);


    return (
        <>
            <section className='mainSction'>

                <div className='container'>

                    <div className={`${style.about} `}>

                        <div className={`${style.underLay} mb-3 position-relative`}>
                            <h2>{listRef.current.VAR000112_notifications_AITSP0}</h2>
                        </div>

                    </div>

                    <div className={` mb-5`}>

                        <div className={`${style.note} `}>
                         
                            <div  className={style.polet}>

                            </div>
                            <div>
                                <h5>{Notification.title}</h5>
                                <p>{Notification.body}</p>
                                <span className={style.date}>{Notification.date}</span>
                            </div>

                        </div>



                    </div>


                </div>
            </section >
        </>
    )
}

export default Search;