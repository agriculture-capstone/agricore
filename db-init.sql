-- PersonCategories
	-- all the different types a person can be

CREATE TABLE PersonCategories (
	personCategoryId SERIAL PRIMARY KEY NOT NULL,
	personCategoryName VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX personCategoryName_lower ON PersonCategories(lower(personCategoryName));

	INSERT INTO PersonCategories VALUES (0, 'farmers');
	INSERT INTO PersonCategories VALUES (1, 'traders');
	INSERT INTO PersonCategories VALUES (2, 'admins');
	INSERT INTO PersonCategories VALUES (3, 'monitors');

-- PersonAttributeTypes
	--  all the different types of attributes a person can have

CREATE TABLE PersonAttributeTypes (
	attrId SERIAL PRIMARY KEY NOT NULL,
	attrName VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX personAttrName_lower ON PersonAttributeTypes(lower(attrName));

	INSERT INTO PersonAttributeTypes VALUES (0, 'username');
	INSERT INTO PersonAttributeTypes VALUES (1, 'passwordHash');
	INSERT INTO PersonAttributeTypes VALUES (2, 'paymentFrequency');
	INSERT INTO PersonAttributeTypes VALUES (3, 'notes');

-- PersonCategoryPermissions
	-- Read or write permissions among different PersonCategories
	-- If the row exists, the action is permissible

CREATE TYPE Permission AS ENUM ('read', 'write');

CREATE TABLE PersonCategoryPermissions (
	userCategoryId SERIAL REFERENCES PersonCategories(personCategoryId) NOT NULL,
	targetCategoryId SERIAL REFERENCES PersonCategories(personCategoryId) NOT NULL,
	action Permission NOT NULL,
	UNIQUE(userCategoryId, targetCategoryId, action)
);

	-- farmer
		-- no permisssions
	-- trader
	INSERT INTO PersonCategoryPermissions VALUES (1, 0, 'read'); -- farmers
	INSERT INTO PersonCategoryPermissions VALUES (1, 0, 'write');
	-- admin
	INSERT INTO PersonCategoryPermissions VALUES (2, 0, 'read'); -- farmers
	INSERT INTO PersonCategoryPermissions VALUES (2, 0, 'write');
	INSERT INTO PersonCategoryPermissions VALUES (2, 1, 'read'); -- traders
	INSERT INTO PersonCategoryPermissions VALUES (2, 1, 'write');
	INSERT INTO PersonCategoryPermissions VALUES (2, 2, 'read'); -- admins
	INSERT INTO PersonCategoryPermissions VALUES (2, 2, 'write');
	INSERT INTO PersonCategoryPermissions VALUES (2, 3, 'read'); -- monitors
	INSERT INTO PersonCategoryPermissions VALUES (2, 3, 'write');
	-- monitor
	INSERT INTO PersonCategoryPermissions VALUES (3, 0, 'read'); -- farmers
	INSERT INTO PersonCategoryPermissions VALUES (3, 1, 'read'); -- traders
	INSERT INTO PersonCategoryPermissions VALUES (3, 2, 'read'); -- admins
	INSERT INTO PersonCategoryPermissions VALUES (3, 3, 'read'); -- monitors

-- PersonCategoryAttributes
	-- what types of attributes a category of people have

CREATE TABLE PersonCategoryAttributes (
	personCategoryId SERIAL REFERENCES PersonCategories(personCategoryId) NOT NULL,
	attrId SERIAL REFERENCES PersonAttributeTypes(attrId) NOT NULL
);

	-- farmer
	INSERT INTO PersonCategoryAttributes VALUES (0, 2); -- paymentFrequency
	INSERT INTO PersonCategoryAttributes VALUES (0, 3); -- notes
	-- trader
	INSERT INTO PersonCategoryAttributes VALUES (1, 0); -- username
	INSERT INTO PersonCategoryAttributes VALUES (1, 1); -- password
	-- admin
	INSERT INTO PersonCategoryAttributes VALUES (2, 0); -- username
	INSERT INTO PersonCategoryAttributes VALUES (2, 1); -- password
	-- monitor
	INSERT INTO PersonCategoryAttributes VALUES (3, 0); -- username
	INSERT INTO PersonCategoryAttributes VALUES (3, 1); -- password

-- Person

CREATE TABLE People (
	personUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	personCategoryId SERIAL REFERENCES PersonCategories(personCategoryId),
	firstName VARCHAR(255),
	middleName VARCHAR(255),
	lastName VARCHAR(255),
	phoneNumber VARCHAR(20),
	phoneArea VARCHAR(20),
	phoneCountry VARCHAR(20),
	companyName VARCHAR(255),
	lastModified TIMESTAMP NOT NULL
);

-- PersonAttributes
	-- the values of the attributes that a specific person has

CREATE TABLE PersonAttributes (
	personUuid UUID REFERENCES People(personUuid) NOT NULL,
	attrId SERIAL REFERENCES PersonAttributeTypes(attrId) NOT NULL,
	attrValue VARCHAR(255),
	UNIQUE(personUuid, attrId)
);

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
