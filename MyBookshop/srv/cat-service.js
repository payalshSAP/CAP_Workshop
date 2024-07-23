const cds = require('@sap/cds');
class CatalogService extends cds.ApplicationService {
    async init() {
        const { Books } = this.entities

        this.before('READ', Books, req => {
            console.log(req.path)
        })

        this.after('READ', Books, each => {
            if (each.stock < 20) each.title += ' (only a few left!)'
        })

        this.on('totalStock', async () => {
            const query = SELECT`SUM(stock) as stock`.from(Books)
            return await cds.run(query)
        })

        this.on('submitOrder', async req => {
            const { book, quantity } = req.data

            if (quantity < 1)
                return req.reject(400, 'quantity cannot be less than 1')

            const result = await SELECT.one`stock`.from(Books).where({ ID: book })
            if (result === null)
                return req.error(404, `Book #${book} doesn't exist`)

            let { stock } = result
            if (quantity > stock)
                return req.reject(409, `${quantity} exceeds the stock for book #${book}`)

            await UPDATE(Books, book).with({ stock: { '-=': quantity } })
            stock -= quantity

            return { stock }
        })

        await super.init()
    }
}

class ExternalService extends cds.ApplicationService{
    async init(){
        const { API_BP } = this.entities;
        const headers = {
            'apikey' : "iAhyMIJtbRct0LHABiNLOTfiLNxL4Grt"
        }
        const externalAPI = await cds.connect.to('API_BUSINESS_PARTNERS');
        //  this.on("READ",API_BP,async(req) =>{
        //     console.log('getting data from APIHub S/4 Sandbox system');
        //     console.log('getting data from APIHub S/4 Sandbox system');
        //     const query = req.query;
        //     console.log(query);
        //      return externalAPI.send({query,headers})
        //  })
        // this.before("READ",API_BP,async(req) =>{
        //     const result = await externalAPI.run(SELECT(API_BP).limit(100));
        //     return result;
        // })
      await  super.init();
    }
}

module.exports = {CatalogService,ExternalService}