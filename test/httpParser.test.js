const {httpParser} =require('../lib/httpParser');

describe('httpParser', () => {

	test('should parse a simple request', (done) => {
		const request = ('GET /path HTTP/1.1\r\nHost: localhost:3000\r\n\r\n').toString();
		const req = httpParser(request);
		req.then((result) => {
			expect(result).toEqual({
				method: 'GET',
				path: '/path',
				version: 'HTTP/1.1\r',
				query: {},
			});
			done();
		});
	});
	test('should parse a request with a query string', (done) => {
		const request = ('GET /path?query=string HTTP/1.1\r\nHost: localhost:3000\r\n\r\n').toString();
		const req = httpParser(request);
		req.then((result) => {
			expect(result).toEqual({
				method: 'GET',
				path: '/path',
				version: 'HTTP/1.1\r',
				query: { query: 'string' },

			});
			done();
		});
	});
	test('should parse a POST request with a JSON body', (done) => {
		const request = ('POST /path HTTP/1.1\r\nHost: localhost:3000\r\nContent-Type: application/json\r\n\r\n{"key": "value"}').toString();
		const req = httpParser(request);
		req.then((result) => {
			expect(result).toEqual({
				method: 'POST',
				path: '/path',
				version: 'HTTP/1.1\r',
				query: {},
				body: { key: 'value' },
			});
			done();
		});

	});

	test('should parse a nested JSON body', (done) => {
		const request = ('POST /path HTTP/1.1\r\nHost: localhost:3000\r\nContent-Type: application/json\r\n\r\n{"key": {"nested": "value"}}').toString();
		const req = httpParser(request);
		req.then((result) => {
			expect(result).toEqual({
				method: 'POST',
				path: '/path',
				version: 'HTTP/1.1\r',
				query: {},
				body: { key: { nested: 'value' } },
			});
			done();
		})

	});

});
