import React, { useEffect } from 'react'

async function login() {
  const code = (new URLSearchParams(window.location.search)).get('code');
  if (code === null) {
    window.location.href = process.env.REACT_APP_FRONTEND_URL;
    return null;
  }
  else {
    return await fetch(process.env.REACT_APP_BACKEND_URL + "/api/v1/auth/callback?code=" + code, {
      method: 'GET',
      credentials: 'include'
    });
  }
}

function Callback() {

  const useEffectCallbackFunction = async () => {
    const response = await login();
    if (response == null || response.status === 200) { 
      window.location.href = process.env.REACT_APP_FRONTEND_URL + "/home";
    }
    else {
      window.location.href = process.env.REACT_APP_FRONTEND_URL;
    }
  }

  useEffect(() => useEffectCallbackFunction, []);

  return (
    <div>Callback</div>
  )
}

export default Callback