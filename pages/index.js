import Head from 'next/head'
import styles from './index.module.css'

import { useSession } from "next-auth/react"
import Send from '../components/send'
import NavBar from '../components/navbar'

export default function Home() {
  const { data: session }= useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>SMS Sender</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <NavBar />

        <h1 className={styles.title}>
          SMS Sender
        </h1>


        { session.user?.roles?.includes('Sender') ? (
          <Send />
        ): (
          <p>You are not authorized to send messages</p>
        ) }
      </main>

      <footer>
        Powered by{' Team Orca '}
      </footer>
    </div>
  )
}

Home.auth = true
