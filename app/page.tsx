import { Fragment } from 'react'
import './page.module.css'
import {Header, Chat, Calendar} from '../components'

export default function Home() {
  return (
    <Fragment>
      <Header/>
      <main>
        <Chat/>
        <Calendar/>
      </main>
    </Fragment>
  )
}
