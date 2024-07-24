const cds = require('@sap/cds')

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
        this.on("checkStatus", async () => {
            const workflowContent = {
                "definitionId": "us10.e0e29c8atrial.capprocessautomation.cAP",
                "context": {
                    "bookid": "12",
                    "authorname": "K. Robert"
                }
            };
            const SPA_API = await cds.connect.to('processautomation');
            const workflowResult = await SPA_API.send('POST', '/workflow/rest/v1/workflow-instances', JSON.stringify(workflowContent),
                {
                    "Content-Type": "application/json"
                });
            const result ={
                status :workflowResult.status,
                id: workflowResult.id
            } 
            return result;
        })
        this.on("cancelWorkflowInstance",async(req) =>{
            const id = req.data.id;
            const workflowContent = {
                    "id": id,
                    "deleted": true
            };
            const SPA_API = await cds.connect.to('processautomation');
            const result = await SPA_API.send('PATCH', '/workflow/rest/v1/workflow-instances',
             JSON.stringify(workflowContent),{
                "Content-Type": "application/json"
            });
            return result.status;
        })

        await super.init()
    }
}

module.exports = CatalogService