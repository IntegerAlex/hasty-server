import Response from './response';

describe('Response', () => {
  it('should have a default status code of 200', () => {
    const response = new Response();
    expect(response.statusCode).toBe(200);
  });

  it('should set the status code correctly', () => {
    const response = new Response();
    response.status(404);
    expect(response.statusCode).toBe(404);
  });

  it('should set headers correctly', () => {
    const response = new Response();
    response.setHeader('Content-Type', 'application/json');
    expect(response.headers['Content-Type']).toBe('application/json');
  });

  it('should send a response with a body', () => {
    const response = new Response();
    const body = 'Hello, World!';
    response.send(body);
    expect(response.socket.write).toHaveBeenCalledTimes(1);
    expect(response.socket.write).toHaveBeenCalledWith(`HTTP/1.1 200 OK\nContent-Length: ${body.length}\n\n${body}`);
  });
});