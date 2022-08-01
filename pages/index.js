import Head from 'next/head'
import styles from './index.module.css'

import Send from '../components/send'
import LoginButton from '../components/loginButton'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SMS Sender</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <LoginButton />
        <h1 className={styles.title}>
          SMS Sender
        </h1>

        <Send />
      </main>

      <footer>
        Powered by{' Team Orca '}
      </footer>
    </div>
  )
}

Home.auth = true
