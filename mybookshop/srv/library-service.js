const cds = require ('@sap/cds')

module.exports = cds.service.impl ((srv) => {
  
  srv.on('sap/bookshop/test/demo/books/created', async (msg) => {  
    const messagePayload = JSON.stringify(msg.data)
    console.log('===> Received message : ' + messagePayload)
  })
})