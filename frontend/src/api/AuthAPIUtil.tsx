import endpoint from '../endpoints.config';

async function isSessionValid(): Promise<boolean> {
  let response = await fetch('http://localhost:8080/api/v1/auth/session/validate', {
    method: 'GET',
    credentials: 'include'
  });
  const jsonResponse = await response.json();
  if (jsonResponse.status === "valid") {
    return true;
  } else {
    return false;
  }
}

async function logout(): Promise<void> {
  await fetch(endpoint.BackendUrl + "/api/v1/auth/logout", {
    method: 'GET',
    credentials: 'include'
  });
  window.location.href = endpoint.FrontendUrl;
}

export { isSessionValid, logout };