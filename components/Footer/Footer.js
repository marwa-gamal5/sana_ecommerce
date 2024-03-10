import * as React from 'react';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';

function Footer() {

  
  const listRef = React.useRef({});
  listRef.current = useSelector((state) => state.webList);
  // {listRef.current.VAR000002_about_AITSP000000000}

  return (
    <>

      <footer className={`${styles.footer}`}>
        <div className='container py-5'>
          <div className='row '>
            <div className='col-lg-4'>
              <ul className='list-unstyled'>
                <li>{listRef.current.VAR000137_customer_service_AIT}</li>
                <li>{listRef.current.VAR000138_terms_and_privacy_po}</li>
                <li>{listRef.current.VAR000139_terms_of_service_AIT}</li>
                <li>{listRef.current.VAR000140_delivery_and_returns}</li>
                <li>{listRef.current.VAR000141_refund_policy_AITSP0}</li>
              </ul>
            </div>

            <div className='col-lg-4'>
              <ul className='list-unstyled'>
                <li>{listRef.current.VAR000002_about_AITSP000000000}</li>

              </ul>
            </div>

            <div className='col-lg-4'>
              <ul className='list-unstyled'>
                <li>{listRef.current.VAR000004_contact_us_AITSP0000}</li>
                <li>
                  <FontAwesomeIcon className={`${styles.footerIcon} mx-1`} icon={faPhone} />
                  01145729686 -01009340010</li>
                <li>
                  <FontAwesomeIcon className={`${styles.footerIcon} mx-1`} icon={faEnvelope} />
                  {listRef.current.VAR000142_mail_to_AITSP0000000} : sales@elbarakafactory.com</li>
                <li>
                  <FontAwesomeIcon className={`${styles.footerIcon} mx-1`} icon={faMapMarkerAlt} />
                  Industrial Zone, Block 31, Nagaa Hammadi, Qena </li>

              </ul>
            </div>
          </div>
        </div>

      </footer>

    </>
  )

}


export default Footer;