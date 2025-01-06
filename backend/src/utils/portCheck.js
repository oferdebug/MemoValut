import net from 'net';

export const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
      .once('error', err => {
        if (err.code === 'EADDRINUSE') {
          resolve(false);
        } else {
          reject(err);
        }
      })
      .once('listening', () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
};

export const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (!(await checkPort(port))) {
    port++;
  }
  return port;
}; 