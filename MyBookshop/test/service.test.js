const cds = require("@sap/cds");
//const expect = require('chai').expect;
const path = require("path");
const {expect} = cds.test();
describe('My Bookshop - Consuming services locally',() =>{
    it('bootstrapped the database successfully ',() =>{
        const {CatalogService} = cds.services;
        const { Books} = cds.entities;
        expect(CatalogService).to.exist;
       // expect(Authors).to.exist;
        expect(Books).to.exist;
    });
    it('allows reading from local services using cds.ql',async() => {
        const CatalogService = await cds.connect.to('CatalogService');
        const authors = await CatalogService.read(`Authors`,a =>{
            a.name,a.books((b) => {b.title})
        }).where(`name like`,'E%');
        expect(authors).to.containSubset([   
            {
                name:'Edgar Allen Poe',
                books:[
                    {
                        title:'The Raven'
                    },
                    {
                        title:'Eleonora'
                    }
                ]
            }
        ])

    }) 

})