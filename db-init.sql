-- PersonTypes

CREATE TABLE PersonTypes (
	personTypeId SERIAL PRIMARY KEY NOT NULL,
	personTypeName VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX personTypeName_lower ON PersonTypes(lower(personTypeName));

INSERT INTO PersonTypes VALUES (0, 'farmer');
INSERT INTO PersonTypes VALUES (1, 'trader');

-- Attributes

CREATE TABLE Attributes (
	attrId SERIAL PRIMARY KEY NOT NULL,
	attrName VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX attrName_lower ON Attributes(lower(attrName));

INSERT INTO Attributes VALUES (0, 'username');
INSERT INTO Attributes VALUES (1, 'password');
INSERT INTO Attributes VALUES (2, 'paymentFrequency');
INSERT INTO Attributes VALUES (3, 'notes');

-- PersonTypeAttributes

CREATE TABLE PersonTypeAttributes (
	personTypeId SERIAL REFERENCES PersonTypes(personTypeId) NOT NULL,
	attrId SERIAL REFERENCES Attributes(attrId) NOT NULL
);

	-- farmer
INSERT INTO PersonTypeAttributes VALUES (0, 2); -- paymentFrequency
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

CREATE TABLE PersonAttributes (
	personUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	attrId SERIAL REFERENCES Attributes(attrId) NOT NULL,
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

CREATE TABLE ProductTypes (
	productTypeUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	productName VARCHAR(255) NOT NULL,
	productUnits VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX productNames_lower ON ProductTypes(lower(productName));

-- ProductTransactions

CREATE TABLE ProductTransactions (
	productTransactionUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	datetime TIMESTAMP WITH TIME ZONE NOT NULL,
	toPersonUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	fromPersonUuid UUID REFERENCES Persons(personUuid) NOT NULL,
	productTypeUuid UUID REFERENCES ProductTypes(productTypeUuid) NOT NULL,
	amountOfProduct REAL NOT NULL,
	costPerUnit MONEY NOT NULL
);

-- Loans

CREATE TABLE Loans (
	loanUuid UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	moneyTransactionUuid UUID REFERENCES MoneyTransactions(moneyTransactionUuid) NOT NULL
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
	productTypeUuid UUID REFERENCES ProductTypes(productTypeUuid) NOT NULL,
	amountOfProduct REAL NOT NULL,
	transportId VARCHAR(255),
	datetime TIMESTAMP WITH TIME ZONE NOT NULL
);

