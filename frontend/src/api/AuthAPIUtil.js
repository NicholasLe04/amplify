async function isSessionValid() {
  let response = await fetch('http://localhost:8080/api/v1/auth/session/validate', {
    method: 'GET',
    credentials: 'include'
  });
  response = await response.json();
  if (response.status === "valid") {
    return true;
  }
  else {
    return false;
  }
}

async function logout() {
  await fetch(process.env.REACT_APP_BACKEND_URL + "/api/v1/auth/logout", {
    method: 'GET',
    credentials: 'include'
  });
  window.location.href = process.env.REACT_APP_FRONTEND_URL;
}

export { isSessionValid, logout };