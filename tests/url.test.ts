import { Router } from '../src/index';

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
    expect(bar.data).toBe('123');
    
    const q = router.handle('/foo/bar?q=234');
    expect(q.data).toBe('234');
  });
});

describe('testing wild card routes', () => {
  const router = new Router();
  router.use('/foo/bar/{*path}', (req: any) => {
    return req.params.path;
  });
  router.use('/foo/:file{.:ext}', (req: any) => {
    return {
      fileName: req.params.file,
      ext: req.params.ext
    };
  });

  test('testing {*path} - should be success', () => {
    const path = router.handle('/foo/bar/1/2/3/4').data;
    expect(path).toBe('1/2/3/4');
  });

  test('testing {.:ext} - should be success', () => {
    const val = router.handle('/foo/bird.jpg').data;
    expect(val.fileName).toBe('bird');
    expect(val.ext).toBe('jpg');
  });
});
