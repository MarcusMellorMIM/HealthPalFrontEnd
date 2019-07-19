// Auth functions getting and translating the JWT token
const headers = {
  "Content-Type": "application/json",
  "Accepts": "application/json"
};

export const login = (baseUrl, user_name, password) => {
  // WORKTODO - CONSIDER IMPROVING GETCONFIG FUNCTION TO BUILD OBJECT

  return fetch( `${baseUrl}/auth/create`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ user_name, password })
  })
  .then(res => res.json())
  .catch(err => { console.log(err)});

};

export const getCurrentUser = (baseUrl, token) => {
// WORKTODO -- CHANGE THIS TO USE THE API.JS GETJWT FUNCTION

console.log({ ...headers, Authorization: token })
console.log(`${baseUrl}/auth/show`)

return fetch(`${baseUrl}/auth/show`, {
    headers: { ...headers, Authorization: token }
  }).then(res => res.json())
  .catch(err => { console.log(err) })

};
