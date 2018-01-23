-- PersonTypes
	-- all the different types a person can be

CREATE TABLE PersonTypes (
	personTypeId SERIAL PRIMARY KEY NOT NULL,
	personTypeName VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX personTypeName_lower ON PersonTypes(lower(personTypeName));

	INSERT INTO PersonTypes VALUES (0, 'farmer');
	INSERT INTO PersonTypes VALUES (1, 'trader');

-- PersonAttributeKinds
	--  all the different kinds of attributes a person can have

CREATE TABLE PersonAttributeKinds (
	attrId SERIAL PRIMARY KEY NOT NULL,
	attrName VARCHAR(255) NOT NULL
);

	CREATE UNIQUE INDEX personAttrName_lower ON PersonAttributeKinds(lower(attrName));

	INSERT INTO PersonAttributeKinds VALUES (0, 'username');
	INSERT INTO PersonAttributeKinds VALUES (1, 'passwordHash');
	INSERT INTO PersonAttributeKinds VALUES (2, 'payment frequency');
	INSERT INTO PersonAttributeKinds VALUES (3, 'notes');

-- PersonTypeAttributes
	-- what kinds of attributes a type of person has

CREATE TABLE PersonTypeAttributes (
	personTypeId SERIAL REFERENCES PersonTypes(personTypeId) NOT NULL,
	attrId SERIAL REFERENCES PersonAttributeKinds(attrId) NOT NULL
);

	-- farmer
	INSERT INTO PersonTypeAttributes VALUES (0, 2); -- payment frequency
	INSERT INTO PersonTypeAttributes VALUES (0, 3); -- notes
	-- trader
	INSERT INTO PersonTypeAttributes VALUES (1, 0); -- username
	INSERT INTO PersonTypeAttributes VALUES (1, 1); -- password

-- Person

CREATE TABLE Persons (
	personUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	firstName VARCHAR(255),
	middleName VARCHAR(255),
	lastName VARCHAR(255),
	phoneNumber VARCHAR(20),
	phoneArea VARCHAR(20),
	phoneCountry VARCHAR(20),
	personTypeId SERIAL REFERENCES PersonTypes(personTypeId)
);

-- PersonAttributes
	-- the values of the attributes that a specific person has

CREATE TABLE PersonAttributes (
	personUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	attrId SERIAL REFERENCES PersonAttributeKinds(attrId) NOT NULL,
	attrValue VARCHAR(255)
);

-- MoneyTransactions

CREATE TABLE MoneyTransactions (
	moneyTransactionUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	datetime TIMESTAMP WITH TIME ZONE NOT NULL,
	toPersonUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	fromPersonUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	amount MONEY NOT NULL
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
	datetime TIMESTAMP WITH TIME ZONE NOT NULL,
	toPersonUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	fromPersonUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	productTypeId SERIAL REFERENCES ProductTypes(productTypeId) NOT NULL,
	amountOfProduct REAL NOT NULL,
	costPerUnit MONEY NOT NULL
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
	INSERT INTO ProductTypeTransactionAttributes VALUES(0, 0, 'milk density grams per millilitre');

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
	datetime TIMESTAMP WITH TIME ZONE NOT NULL
);

