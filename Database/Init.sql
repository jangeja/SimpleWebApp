drop database if exists SimpleWebApp;
create database SimpleWebApp;
SET DATABASE = SimpleWebApp;
create table Person (
   id serial primary key,
   email varchar(30) not null,
   password varchar(50)
);

create table Table1 (
   id serial primary key,
   column1 int,
   column2 decimal,
   column3 bool,
   column4 date,
   column5 timestamp,
   column6 string
);

create table Table2 (
   id serial primary key,
   column1 int,
   column2 decimal,
   column3 bool,
   column4 date,
   column5 timestamp,
   column6 string
);
