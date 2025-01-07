const config = {
  apiUrl: import.meta.env.VITE_API_URL,
};

console.log("Environment Variables:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});

export default config;
