namespace my.bookshop;
using {managed} from '@sap/cds/common';

entity Books :managed{
  key ID : Integer;
  title  : String;
  stock  : Integer;
  price : Decimal;
  author : Association to Authors;
}

entity Authors :managed{
  key ID: Integer;
  name : String    @mandatory;
  dateOfBirth:Date;
  nationality:String;
  books :Association to many Books on books.author = $self;
}


