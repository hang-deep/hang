const fs = require('fs');

const manifestPath = './manifest.json';

fs.readFile(manifestPath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }

  if (data.includes('"h5":')) {
    console.log('H5 配置已存在');
    return;
  }

  const newData = data.replace(
    /"vueVersion" : "3"/,
    '"vueVersion" : "3",\n    "h5" : {\n        "devServer" : {\n            "proxy" : {\n                "/api" : {\n                    "target" : "http://127.0.0.1:3000",\n                    "changeOrigin" : true,\n                    "secure" : false\n                }\n            }\n        }\n    }'
  );

  fs.writeFile(manifestPath, newData, (err) => {
    if (err) {
      console.error('写入文件失败:', err);
    } else {
      console.log('修复成功！已添加 H5 代理配置');
    }
  });
});