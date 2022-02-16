const app = require('./index')

const server = app.listen(process.env.PORT || 8080, (err) => {
    let port = server.address().port;
    if (err) throw err
    console.log('Server running on port', port)
})