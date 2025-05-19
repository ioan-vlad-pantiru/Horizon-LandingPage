import '../styles/globals.css'
import Navbar from '../components/Navbar'
import type { AppProps } from 'next/app'
import Footer from "@/components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
            <Footer/>
        </>
    )
}

export default MyApp