import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import style from './Notifications.module.css';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBell } from '@fortawesome/free-solid-svg-icons';
import { getNotificationstCount } from '@/store/actions';
import { useSelector , useDispatch } from 'react-redux';

library.add(faBell);


function Notifications({color}) {

  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);

  const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const [Notifications , setNotifications ] = useState([]);

    const viewNotifications = async () => {
        await axiosInstance.post('user/view_all_notifications', {
            token: token,
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {

            setNotifications(res.data.success);
            let elements = res.data.success.filter((ele)=> ele[3] == false);
            dispatch(getNotificationstCount(elements.length));

        }).catch((err) => {
            console.log("err", err)
        });
    }

    const markAllAsRead = async () => {
      await axiosInstance.post('user/mark_all_as_read', {
          token: token,
      }, {
          headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "application/json"
          }
      }).then(res => {
          viewNotifications();
      }).catch((err) => {
          console.log("err", err)
      });
  }

const notificationsCount = useRef();

notificationsCount.current = useSelector((state)=> state.notificationsCount);

    useEffect(() => {
        if (token != null) {
            viewNotifications();
        }

    }, [token , notificationsCount.current]);


    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('click', handleOutsideClick);
  
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);

    return (
        <>
            <div className={`${style.dropdown}`} ref={dropdownRef}>


                <Nav.Item>
                
                <div className={`p-2 `}>

                    <div className='position-relative' type="button" onClick={toggleDropdown}>
                      <FontAwesomeIcon className={`fs-4 `} icon="bell" style={{ color: color }}    /> 
                      {(notificationsCount.current > 0) ? (
                        <span className={`${style.notification}`}></span>
                      ) : (
                        <></>
                      )}
                    </div>

                  </div>
              </Nav.Item>

                {isOpen && (
                    <div className={`${style.dropdownContent}`}>
                      <div className='d-flex justify-content-between'>
                          <h5>{listRef.current.VAR000112_notifications_AITSP0} ({notificationsCount.current})</h5>
                          <h6 type="button" onClick={markAllAsRead}>{listRef.current.VAR000111_mark_all_as_read_AIT}</h6>
                      </div>
                        {Notifications.map((ele, index) => (
                            (ele[3] == false)?(
                              <Link style={{backgroundColor:"rgba(195, 218, 188, 0.30)"}} className={`${style.note} d-flex`}
                              type="button" onClick={toggleDropdown} key={index} href={`/notifications/${ele[0]}`}>
                                <span style={{backgroundColor:"#5EB645"}}  className={style.polet}></span>
                                <div>
                                  <p>{ele[1]}</p>
                                  <span className={style.date}>{ele[2]}</span>
                                </div>
                                
                            </Link>
                            ):(
                            <Link style={{backgroundColor:"#FFFFFF"}}  className={`${style.note} d-flex`}
                            type="button" onClick={toggleDropdown} key={index} href={`/notifications/${ele[0]}`}>
                              <span style={{backgroundColor:"#BABABA"}} className={style.polet}></span>
                              <div>
                                <p>{ele[1]}</p>
                                <span className={style.date}>{ele[2]}</span>
                              </div>
                               
                            </Link>
                            )
                            
                        ))}
                   
                    </div>
                )}
            </div>


        </>
    )
}

export default Notifications;



