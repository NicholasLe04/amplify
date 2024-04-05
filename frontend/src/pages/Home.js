import React, { useEffect } from 'react';
import { isSessionValid, logout } from '../api/AuthAPIUtil.js';

function Home() {

  async function validateSession() {
    const response = await isSessionValid();
    if (response === false) {
      window.location.href = process.env.REACT_APP_FRONTEND_URL;
    }
  }

  useEffect(() => validateSession, [])

  return (
    <div>
      Home
      <button onClick={() => logout()}>logout</button>

    </div>
  )
}

export default Home