export default {
  'GET /always-error': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500);
    res.send();
  },
};
