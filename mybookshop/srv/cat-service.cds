using my.bookshop as my from '../db/data-model';

service CatalogService {

    entity Authors as projection on my.Authors;

    entity Books   as
        projection on my.Books {
            *,
            author.name as author_name
        };

    function totalStock()                                     returns Integer;

    action   submitOrder(book : Books:ID, quantity : Integer) returns {
        stock : Integer
    };

}
