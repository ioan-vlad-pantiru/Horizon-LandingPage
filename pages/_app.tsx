import '../styles/globals.css'
import Navbar from '../components/Navbar'
import type { AppProps } from 'next/app'
import Footer from "@/components/Footer";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Horizon – AI Motorcycle Helmet HUD</title>
                <meta name="description" content="Horizon is an AI-powered motorcycle helmet heads-up display that enhances your ride with augmented reality." />
                <link rel="icon" href="/horizon-logo.ico"/>
                <link rel="apple-touch-icon" href="/horizon-logo.ico" />
                <link rel="shortcut icon" href="/horizon-logo.ico" />
            </Head>
            <Navbar />
            <Component {...pageProps} />
            <Footer/>
        </>
    )
}

export default MyApp