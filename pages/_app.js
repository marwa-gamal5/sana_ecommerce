import Layout from '../components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import { Provider } from 'react-redux';
import { useStore } from '../store';
import '../public/styles/modal.css';

function App({ Component, pageProps }) {

  const store = useStore(pageProps.initialReduxState);

  return (
    <HydrationProvider>
      <main>
        <Server>
        </Server>
        <Client>
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </Client>
      </main>
    </HydrationProvider>
  );
}

export default App;



