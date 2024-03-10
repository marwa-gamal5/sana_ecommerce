import * as React from 'react';
import Order from '../../components/order/order';
import withAuth from '../../components/withAuth/withAuth';
import { useRouter } from 'next/router';
import { useEffect} from 'react';
import axiosInstance from '../../axiosConfig/instance';

function OrderPage() {

    const router = useRouter();
    const token = localStorage.getItem("token");

  async function CheckOut() {
 
      axiosInstance.post('payment/set_order', {
        token: token,
      }, {
        headers: {
          "Authorization": `Token ${token}`
        }
      }).then(res => {
        if(res.data.error){
          showAlert(listRef.current[res.data.error], "error");
        }else {
          router.push('/order');
        }
      }).catch(err => {
        console.log(err);
      });

}

  useEffect(() => {
    if (token) {
      CheckOut()
    }
  }, []);



  return (
    <>
      <section className={`py-5`}>
        <div className='container my-5'>
          <Order />
        </div>
      </section>
    </>
  )
}
// export default OrderPage;

export default withAuth(OrderPage);



