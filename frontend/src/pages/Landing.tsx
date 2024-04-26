import { useEffect } from 'react';
import { isSessionValid } from '../api/AuthAPIUtil';
import endpoint from '../endpoints.config';

function Landing() {

  async function validateSession() {
    const response = await isSessionValid();
    if (response === true) {
      window.location.href = endpoint.FrontendUrl + "/home";
    }
  }

  useEffect(() => {validateSession()}, []);

  return (
    <div>
      Landing
      <button onClick={() => {
        // Fetch the Spotify Auth URL and redirect user
        fetch('http://localhost:8080/api/v1/auth/authorize')
        .then(response => response.text())
        .then(data =>{window.location.href = data})
      }}>login</button>
    </div>
  )
}

export default Landing