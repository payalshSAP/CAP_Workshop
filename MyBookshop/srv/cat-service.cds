using my.bookshop as my from '../db/data-model';
using {API_BUSINESS_PARTNERS as external_BP} from './external/API_BUSINESS_PARTNERS';

service CatalogService {
    entity Books as projection on my.Books{
        *,
        author.name as AuthorName
    };
    entity Authors as projection on my.Authors;
    function totalStock()                                     returns Integer;

     action   submitOrder(book : Books:ID, quantity : Integer) returns {
         stock : Integer
     };

}
service ExternalService{
  entity API_BP as projection on external_BP.A_BusinessPartner{
    BusinessPartner,Customer,Supplier,AcademicTitle,AuthorizationGroup,
    BusinessPartnerGrouping,BusinessPartnerName
  };
}
