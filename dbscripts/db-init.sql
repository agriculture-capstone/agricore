-- PeopleCategories
	-- all the different types a People can be

CREATE TABLE PeopleCategories (
	peopleCategoryId SERIAL PRIMARY KEY NOT NULL,
	peopleCategoryName VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX peopleCategoryName_lower ON PeopleCategories(lower(peopleCategoryName));

	INSERT INTO PeopleCategories VALUES (0, 'farmers');
	INSERT INTO PeopleCategories VALUES (1, 'traders');
	INSERT INTO PeopleCategories VALUES (2, 'admins');
	INSERT INTO PeopleCategories VALUES (3, 'monitors');

-- PeopleAttributeTypes
	--  all the different types of attributes a person can have

CREATE TABLE PeopleAttributeTypes (
	attrId SERIAL PRIMARY KEY NOT NULL,
	attrName VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX peopleAttrName_lower ON PeopleAttributeTypes(lower(attrName));

	INSERT INTO PeopleAttributeTypes VALUES (0, 'username');
	INSERT INTO PeopleAttributeTypes VALUES (1, 'hash');
	INSERT INTO PeopleAttributeTypes VALUES (3, 'paymentFrequency');
	INSERT INTO PeopleAttributeTypes VALUES (4, 'notes');

-- PeopleCategoryPermissions
	-- Read or write permissions among different PeopleCategories
	-- If the row exists, the action is permissible

CREATE TYPE Permission AS ENUM ('read', 'write');

CREATE TABLE PeopleCategoryPermissions (
	userCategoryId SERIAL REFERENCES PeopleCategories(peopleCategoryId) NOT NULL,
	targetCategoryId SERIAL REFERENCES PeopleCategories(peopleCategoryId) NOT NULL,
	action Permission NOT NULL,
	UNIQUE(userCategoryId, targetCategoryId, action)
);

	-- farmer
		-- no permisssions
	-- trader
	INSERT INTO PeopleCategoryPermissions VALUES (1, 0, 'read'); -- farmers
	INSERT INTO PeopleCategoryPermissions VALUES (1, 0, 'write');
	-- admin
	INSERT INTO PeopleCategoryPermissions VALUES (2, 0, 'read'); -- farmers
	INSERT INTO PeopleCategoryPermissions VALUES (2, 0, 'write');
	INSERT INTO PeopleCategoryPermissions VALUES (2, 1, 'read'); -- traders
	INSERT INTO PeopleCategoryPermissions VALUES (2, 1, 'write');
	INSERT INTO PeopleCategoryPermissions VALUES (2, 2, 'read'); -- admins
	INSERT INTO PeopleCategoryPermissions VALUES (2, 2, 'write');
	INSERT INTO PeopleCategoryPermissions VALUES (2, 3, 'read'); -- monitors
	INSERT INTO PeopleCategoryPermissions VALUES (2, 3, 'write');
	-- monitor
	INSERT INTO PeopleCategoryPermissions VALUES (3, 0, 'read'); -- farmers
	INSERT INTO PeopleCategoryPermissions VALUES (3, 1, 'read'); -- traders
	INSERT INTO PeopleCategoryPermissions VALUES (3, 2, 'read'); -- admins
	INSERT INTO PeopleCategoryPermissions VALUES (3, 3, 'read'); -- monitors

-- PeopleCategoryAttributes
	-- what types of attributes a category of people have

CREATE TABLE PeopleCategoryAttributes (
	peopleCategoryId SERIAL REFERENCES PeopleCategories(peopleCategoryId) NOT NULL,
	attrId SERIAL REFERENCES PeopleAttributeTypes(attrId) NOT NULL
);

	-- farmer
	INSERT INTO PeopleCategoryAttributes VALUES (0, 3); -- paymentFrequency
	INSERT INTO PeopleCategoryAttributes VALUES (0, 4); -- notes
	-- trader
	INSERT INTO PeopleCategoryAttributes VALUES (1, 0); -- username
	INSERT INTO PeopleCategoryAttributes VALUES (1, 1); -- hash
	-- admin
	INSERT INTO PeopleCategoryAttributes VALUES (2, 0); -- username
	INSERT INTO PeopleCategoryAttributes VALUES (2, 1); -- hash
	-- monitor
	INSERT INTO PeopleCategoryAttributes VALUES (3, 0); -- username
	INSERT INTO PeopleCategoryAttributes VALUES (3, 1); -- hash

-- People

CREATE TABLE People (
	personUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	peopleCategoryId SERIAL REFERENCES PeopleCategories(peopleCategoryId),
	firstName VARCHAR(255),
	middleName VARCHAR(255),
	lastName VARCHAR(255),
	phoneNumber VARCHAR(20),
	phoneArea VARCHAR(20),
	phoneCountry VARCHAR(20),
	companyName VARCHAR(255),
	lastModified TIMESTAMP NOT NULL
);

	INSERT INTO People (personUuid, peopleCategoryId, lastModified)
		VALUES ('98f0f127-6c7f-4641-b464-447e417318d8', 2, '1970-01-01 00:00:00.000Z');

-- PeopleAttributes
	-- the values of the attributes that a specific person has

CREATE TABLE PeopleAttributes (
	personUuid UUID REFERENCES People(personUuid) NOT NULL,
	attrId SERIAL REFERENCES PeopleAttributeTypes(attrId) NOT NULL,
	attrValue VARCHAR(255),
	UNIQUE(personUuid, attrId)
);

	-- default admin
	INSERT INTO PeopleAttributes
		VALUES ('98f0f127-6c7f-4641-b464-447e417318d8', 0, 'admin');
	INSERT INTO PeopleAttributes
		VALUES ('98f0f127-6c7f-4641-b464-447e417318d8', 1, '$2a$11$M3ua2jCZtRNvLKn3zD7CIeDM4EsKqbB7o5ntt.oI6q2AEMXDociP.');

CREATE TYPE Currency AS ENUM ('UGX');

-- MoneyTransactions

CREATE TABLE MoneyTransactions (
	moneyTransactionUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	datetime TIMESTAMP NOT NULL,
	toPersonUuid UUID REFERENCES People(personUuid) NOT NULL,
	fromPersonUuid UUID REFERENCES People(personUuid) NOT NULL,
	amount NUMERIC(30, 2) NOT NULL,
	currency Currency NOT NULL
);

-- ProductTypes
	-- all the different kinds of products

CREATE TABLE ProductTypes (
	productTypeId SERIAL PRIMARY KEY NOT NULL,
	productName VARCHAR(255) NOT NULL,
	productUnits VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX productNames_lower ON ProductTypes(lower(productName));

	INSERT INTO ProductTypes VALUES (0, 'milk', 'litres');

-- ProductTransactions

CREATE TABLE ProductTransactions (
	productTransactionUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	datetime TIMESTAMP NOT NULL,
	toPersonUuid UUID REFERENCES People(personUuid) NOT NULL,
	fromPersonUuid UUID REFERENCES People(personUuid) NOT NULL,
	productTypeId SERIAL REFERENCES ProductTypes(productTypeId) NOT NULL,
	amountOfProduct REAL NOT NULL,
	costPerUnit NUMERIC(20, 2) NOT NULL,
	currency Currency NOT NULL,
	lastModified TIMESTAMP NOT NULL
);

-- ProductTypeTransactionAttributes
	-- the unique kinds of attributes a transaction for a type of product has
	-- example: we track the milk density and milk temperature for all milk type transactions

CREATE TABLE ProductTypeTransactionAttributes (
	productTypeId SERIAL REFERENCES ProductTypes(productTypeId) NOT NULL,
	attrId SERIAL PRIMARY KEY NOT NULL,
	attrName VARCHAR(255) NOT NULL,
	UNIQUE(productTypeId, attrId) -- every product type, may not have duplications of types of attributes
);

	CREATE UNIQUE INDEX productAttrName_lower ON ProductTypeTransactionAttributes(lower(attrName));

	-- milk
	INSERT INTO ProductTypeTransactionAttributes VALUES(0, 0, 'milkDensityGramsPerMillilitre');

-- TransactionAttributes
	-- the values for the unique attributes for every transaction

CREATE TABLE ProductTransactionAttribute (
	productTransactionUuid UUID REFERENCES ProductTransactions(productTransactionUuid) NOT NULL,
	attrId SERIAL REFERENCES ProductTypeTransactionAttributes(attrId) NOT NULL,
	attrValue VARCHAR(255) NOT NULL,
	UNIQUE(productTransactionUuid, attrId) -- for every transaction, all of its attributes must only have one value
);

-- Loans

CREATE TABLE Loans (
	loanUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	moneyTransactionUuid UUID REFERENCES MoneyTransactions(moneyTransactionUuid) NOT NULL,
	dueDate DATE
);

-- LoanPayments

CREATE TABLE LoanPayments (
	loanUuid UUID REFERENCES Loans(loanUuid) NOT NULL,
	moneyTransactionUuid UUID REFERENCES MoneyTransactions(moneyTransactionUuid) NOT NULL,
	UNIQUE(loanUuid, moneyTransactionUuid)
);

-- ProductPayments

CREATE TABLE ProductPayments (
	productTransactionUuid UUID REFERENCES ProductTransactions(productTransactionUuid) NOT NULL,
	moneyTransactionUuid UUID REFERENCES MoneyTransactions(moneyTransactionUuid) NOT NULL
);

-- ProductExports

CREATE TABLE ProductExports (
	productTypeId SERIAL REFERENCES ProductTypes(productTypeId) NOT NULL,
	amountOfProduct REAL NOT NULL,
	transportId VARCHAR(255),
	datetime TIMESTAMP NOT NULL
);
