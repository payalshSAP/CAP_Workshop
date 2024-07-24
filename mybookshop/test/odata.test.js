const cds = require('@sap/cds/lib')

const { GET } = cds.test()
const expect = require('chai').expect

describe('My Bookstore APIs', () => {
    it('serves $metadata documents in v4', async () => {
        const { headers, status, data } = await GET`/odata/v4/catalog/$metadata`
        expect(status).to.be.equal(200)
        expect(headers).to.be.contain({
            'content-type': 'application/xml',
            'odata-version': '4.0',
        })
        expect(data).to.contain('<EntitySet Name="Books" EntityType="CatalogService.Books">')
    })
    it('supports $select', async () => {
        const { data } = await GET(`/odata/v4/catalog/Books`, {
            params: { $select: `ID,title` },
        })
        expect(data.value).to.eql([
            { ID: 201, title: 'Wuthering Heights', IsActiveEntity: true },
            { ID: 207, title: 'Jane Eyre', IsActiveEntity: true },
            { ID: 251, title: 'The Raven', IsActiveEntity: true },
            { ID: 252, title: 'Eleonora', IsActiveEntity: true },
            { ID: 271, title: 'Catweazle', IsActiveEntity: true },
        ])
    })
    it('supports $value requests', async () => {
        const { data } = await GET`/odata/v4/catalog/Authors/150/name/$value`
        expect(data).to.equal('Edgar Allen Poe')
    })
    it('supports $top/$skip paging', async () => {
        const { data: p1 } = await GET`/odata/v4/catalog/Books?$select=title&$top=3`
        expect(p1.value).to.eql([
            { ID: 201, title: 'Wuthering Heights', IsActiveEntity: true },
            { ID: 207, title: 'Jane Eyre', IsActiveEntity: true },
            { ID: 251, title: 'The Raven', IsActiveEntity: true },
        ])
        const { data: p2 } = await GET`/odata/v4/catalog/Books?$select=title&$skip=3`
        expect(p2.value).to.eql([
            { ID: 252, title: 'Eleonora', IsActiveEntity: true },
            { ID: 271, title: 'Catweazle', IsActiveEntity: true },
        ])
    })
    it('correctly sums up totalStock', async () => {
        const calculatedTotalStock = (await GET`/odata/v4/catalog/totalStock()`).data.value.stock
        const stockValues = (await GET`/odata/v4/catalog/Books`).data.value.map(book => book.stock)

        let totalStock = 0;
        for (const stock of stockValues) totalStock += stock;

        expect(calculatedTotalStock).to.eql(totalStock)
    })

})