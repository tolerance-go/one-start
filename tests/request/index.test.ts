/** 注意 server 重复注册相同 url 接口不会覆盖 */
import createTestServer from 'create-test-server';
import request from '../../packages/request/src/index';

type PromiseType<T> = T extends Promise<infer P> ? P : T;

describe('request', () => {
  let server: PromiseType<ReturnType<typeof createTestServer>>;
  let prevWindow: typeof window;
  let prevHref: string;
  let prevGetItem: (key: string) => string | null;

  beforeAll(async () => {
    prevWindow = global.window;
    prevHref = prevWindow.location.href;
    prevGetItem = prevWindow.localStorage.getItem;

    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: prevHref,
      },
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: prevGetItem,
      },
    });

    server = await createTestServer();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    global.window.location.href = prevHref;
    global.window.localStorage.getItem = prevGetItem;
  });

  const prefix = (api: string) => `${server.url}${api}`;

  it('401', async () => {
    server.get('/test/0', (req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      res.status(401);
      res.send();
    });

    await request(prefix('/test/0'), {
      method: 'get',
      ignoreValidateToken: true,
    });

    expect(global.window.location.href).toBe('/user/login');
  });

  it('ignoreValidateToken', async () => {
    server.get('/test/1', (req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      res.send();
    });

    await request(prefix('/test/1'), {
      method: 'get',
      ignoreValidateToken: true,
    });

    expect(global.window.location.href).toBe(prevHref);

    await request(prefix('/test/1'), {
      method: 'get',
    });

    expect(global.window.location.href).toBe('/user/login');
  });

  it('token payload', async () => {
    server.get('/test/2', (req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      res.send({
        token: req.headers.authorization,
      });
    });

    const token = 'mock token';
    global.window.localStorage.getItem = () => JSON.stringify({ token });

    const { data } = await request(prefix('/test/2'), {
      method: 'get',
    });

    expect(global.window.location.href).toBe(prevHref);
    expect(data).toStrictEqual({
      token: `Bearer ${token}`,
    });
  });

  it('ignoreErrorTips', async () => {
    server.get('/test/3', (req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      res.status(500);
      res.send();
    });

    const errorTipsCustomHandler = jest.fn();

    await request(prefix('/test/3'), {
      method: 'get',
      ignoreErrorTips: true,
      errorTipsCustomHandler,
    });

    expect(errorTipsCustomHandler).toHaveBeenCalledTimes(0);
  });

  it('errorTipsCustomHandler', async () => {
    server.get('/test/4', (req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      res.status(500);
      res.send();
    });

    const errorTipsCustomHandler = jest.fn();

    await request(prefix('/test/3'), {
      method: 'get',
      errorTipsCustomHandler,
    });

    expect(errorTipsCustomHandler).toHaveBeenCalled();
  });
});
