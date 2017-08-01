drop database if exists SimpleWebApp;
create database SimpleWebApp;
SET DATABASE = SimpleWebApp;
create table Person (
   -- id STRING PRIMARY KEY DEFAULT to_hex(unique_rowid()),
   id serial primary key,
   email varchar(30) not null,
   password varchar(50)
);

create table Table1 (
   -- id STRING PRIMARY KEY DEFAULT to_hex(unique_rowid()),
   id serial primary key,
   column1 int,
   column2 decimal,
   column3 bool,
   column4 date,
   column5 timestamp,
   column6 string
);

create table Table2 (
   -- id STRING PRIMARY KEY DEFAULT to_hex(unique_rowid()),
   id serial primary key,
   column1 int,
   column2 decimal,
   column3 bool,
   column4 date,
   column5 timestamp,
   column6 string
);

grant all on SimpleWebApp.* to test_user;
grant all on SimpleWebApp.* to test_user;
