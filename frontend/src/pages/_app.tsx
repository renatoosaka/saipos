import { ToastContainer } from 'react-toastify';
import { ApplicationProvider } from '../context'

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <ApplicationProvider>
      <Component {...pageProps} />
      <ToastContainer/>
    </ApplicationProvider>
  )
}

export default MyApp
