const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

app.get('/api/test', (req, res) => {
  res.json({ code: 200, message: '测试成功', data: 'Hello World' })
})

app.listen(port, () => {
  console.log(`测试服务运行在 http://localhost:${port}`)
})
