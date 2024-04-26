import { useEffect } from 'react';
import { isSessionValid, logout } from '../api/AuthAPIUtil';
import endpoint from '../endpoints.config';

function Home() {

  async function validateSession() {
    const response = await isSessionValid();
    if (response === false) {
      window.location.href = endpoint.FrontendUrl || '';
    }
  }

  useEffect(() => {validateSession()}, [])

  return (
    <div>
      Home
      <button onClick={() => logout()}>logout</button>

    </div>
  )
}

export default Home