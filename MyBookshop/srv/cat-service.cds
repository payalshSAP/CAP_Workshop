using my.bookshop as my from '../db/data-model';

service CatalogService {
    entity Books as projection on my.Books;
    entity Authors as projection on my.Authors;
    function totalStock()                                     returns Integer;

     action   submitOrder(book : Books:ID, quantity : Integer) returns {
         stock : Integer
     };
}
