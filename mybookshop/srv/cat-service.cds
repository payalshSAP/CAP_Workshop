using my.bookshop as my from '../db/data-model';

service CatalogService {

    entity Authors as projection on my.Authors;

    entity Books   as
        projection on my.Books {
            *,
            author.name as author_name
        };
    entity workflow{
        status: String;
        id: String;
    }
    function totalStock()                                     returns Integer;
    function checkStatus()                                    returns workflow;
    action cancelWorkflowInstance(id: workflow:id)             returns String;

    action   submitOrder(book : Books:ID, quantity : Integer) returns {
        stock : Integer
    };

}
