import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { WalletProvider } from '../contexts/WalletContext'
import { ContractProvider } from '../contexts/ContractContext'
import { ToastProvider } from '../contexts/ToastContext'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>糖尿病匿名统计分析平台</title>
        <meta name="description" content="基于 FHEVM 的糖尿病患者匿名数据统计分析平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      
      <ToastProvider>
        <WalletProvider>
          <ContractProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
              <Component {...pageProps} />
            </div>
          </ContractProvider>
        </WalletProvider>
      </ToastProvider>
    </>
  )
}