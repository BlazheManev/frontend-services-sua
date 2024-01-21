export const baseUrl = process.env.NODE_ENV === 'development' 
  ? process.env.REACT_APP_LOCAL_API 
  : process.env.REACT_APP_DOCKER_API;
