// API functions and for generic fetch requests
const HEADERS = { headers: { "Content-Type": "application/json",
                            Accept: "application/json" } }

export const getJWTHeaders = () => {
  // Set the header to include the JWT token
  const token = localStorage.getItem("token");
  let headers={}
  Object.assign(headers,HEADERS )
  Object.assign(headers.headers, {Authorization:token })

  return headers
}

export const getConfigObj = ( method, body_detail=null ) => {
// Create the fetch object that includes the header and body
  let headers = getJWTHeaders();
  Object.assign(headers,  {method:method})
  let configObj={}
  if (body_detail) {
    Object.assign (configObj, headers, {body:JSON.stringify({ detail: body_detail })})
  } else {
    Object.assign (configObj, headers)
  }

  return configObj
}
