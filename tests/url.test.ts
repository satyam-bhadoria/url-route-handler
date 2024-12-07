const { Router } = require('../dist/cjs');

describe('testing router use method', () => {
  test('should be success', () => {
    const router = new Router();
    router.use('/foo/:bar', (req: any) => {
      return req;
    });
    expect(true);
  });
});

describe('testing router handle method', () => {
  const router = new Router();
  router.use('/foo/bar', (req: any) => {
    return req.query.q;
  });
  router.use('/foo/:bar', (req: any) => {
    return req.params.bar;
  });
  test('should be success', () => {
    const bar = router.handle('/foo/123');
    expect(bar).toBe('123');
    
    const q = router.handle('/foo/bar?q=234');
    expect(q).toBe('234');
  });
});
