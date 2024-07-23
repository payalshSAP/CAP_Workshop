using my.bookshop as my from '../db/data-model';

service CatalogService {

    entity Authors 
    @(restrict :[
          {
                grant : [ 'READ' ],
                to :    [ 'authenticated-user' ]
            },
            {
                grant : [ '*' ],
                to : [ 'Admin' ]
            }
     ])
    as projection on my.Authors;

    entity Books 
         @(restrict :[
          {
                grant : [ 'READ' ],
                to : [ 'authenticated-user' ]
            },
            {
                grant : [ '*' ],
                to : [ 'Admin' ]
            }
     ])  as
        projection on my.Books {
            *,
            author.name as author_name
        };

    function totalStock()                                     returns Integer;

    action   submitOrder(book : Books:ID, quantity : Integer) returns {
        stock : Integer
    };

}


