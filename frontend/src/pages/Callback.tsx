import { useEffect } from 'react';
import endpoint from '../endpoints.config';

async function login() {
  const code = (new URLSearchParams(window.location.search)).get('code');
  if (code === null) {
    window.location.href = endpoint.FrontendUrl || '';
    return null;
  }
  else {
    return await fetch(endpoint.BackendUrl + "/api/v1/auth/callback?code=" + code, {
      method: 'GET',
      credentials: 'include'
    });
  }
}

function Callback() {

  const useEffectCallbackFunction = async () => {
    const response = await login();
    if (response == null || response.status === 200) { 
      window.location.href = endpoint.FrontendUrl + "/home";
    }
    else {
      window.location.href = endpoint.FrontendUrl || '';
    }
  }

  useEffect(() => {console.log(endpoint.FrontendUrl);useEffectCallbackFunction()}, []);

  return (
    <div>Callback</div>
  )
}

export default Callback