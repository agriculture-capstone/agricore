--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: attributes; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE attributes (
    attrid integer NOT NULL,
    attriname character varying(255) NOT NULL
);


ALTER TABLE attributes OWNER TO boresha;

--
-- Name: attributes_attrid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE attributes_attrid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE attributes_attrid_seq OWNER TO boresha;

--
-- Name: attributes_attrid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE attributes_attrid_seq OWNED BY attributes.attrid;


--
-- Name: loanpayments; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE loanpayments (
    loanid bigint NOT NULL,
    moneytransactionid bigint NOT NULL
);


ALTER TABLE loanpayments OWNER TO boresha;

--
-- Name: loanpayments_loanid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE loanpayments_loanid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE loanpayments_loanid_seq OWNER TO boresha;

--
-- Name: loanpayments_loanid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE loanpayments_loanid_seq OWNED BY loanpayments.loanid;


--
-- Name: loanpayments_moneytransactionid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE loanpayments_moneytransactionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE loanpayments_moneytransactionid_seq OWNER TO boresha;

--
-- Name: loanpayments_moneytransactionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE loanpayments_moneytransactionid_seq OWNED BY loanpayments.moneytransactionid;


--
-- Name: loans; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE loans (
    loanid bigint NOT NULL,
    moneytransactionid bigint NOT NULL
);


ALTER TABLE loans OWNER TO boresha;

--
-- Name: loans_loanid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE loans_loanid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE loans_loanid_seq OWNER TO boresha;

--
-- Name: loans_loanid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE loans_loanid_seq OWNED BY loans.loanid;


--
-- Name: loans_moneytransactionid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE loans_moneytransactionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE loans_moneytransactionid_seq OWNER TO boresha;

--
-- Name: loans_moneytransactionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE loans_moneytransactionid_seq OWNED BY loans.moneytransactionid;


--
-- Name: moneytransactions; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE moneytransactions (
    moneytransactionid bigint NOT NULL,
    topersonid integer NOT NULL,
    frompersonid integer NOT NULL,
    amount money NOT NULL
);


ALTER TABLE moneytransactions OWNER TO boresha;

--
-- Name: moneytransactions_frompersonid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE moneytransactions_frompersonid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE moneytransactions_frompersonid_seq OWNER TO boresha;

--
-- Name: moneytransactions_frompersonid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE moneytransactions_frompersonid_seq OWNED BY moneytransactions.frompersonid;


--
-- Name: moneytransactions_moneytransactionid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE moneytransactions_moneytransactionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE moneytransactions_moneytransactionid_seq OWNER TO boresha;

--
-- Name: moneytransactions_moneytransactionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE moneytransactions_moneytransactionid_seq OWNED BY moneytransactions.moneytransactionid;


--
-- Name: moneytransactions_topersonid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE moneytransactions_topersonid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE moneytransactions_topersonid_seq OWNER TO boresha;

--
-- Name: moneytransactions_topersonid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE moneytransactions_topersonid_seq OWNED BY moneytransactions.topersonid;


--
-- Name: person; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE person (
    personid integer NOT NULL,
    firstname character varying(255),
    middlename character varying(255),
    lastname character varying(255),
    phonenumber character varying(20),
    phonearea character varying(20),
    phonecountry character varying(20),
    persontypeid integer NOT NULL
);


ALTER TABLE person OWNER TO boresha;

--
-- Name: person_personid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE person_personid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE person_personid_seq OWNER TO boresha;

--
-- Name: person_personid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE person_personid_seq OWNED BY person.personid;


--
-- Name: person_persontypeid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE person_persontypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE person_persontypeid_seq OWNER TO boresha;

--
-- Name: person_persontypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE person_persontypeid_seq OWNED BY person.persontypeid;


--
-- Name: personattributes; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE personattributes (
    personid integer NOT NULL,
    attrid integer NOT NULL,
    attrvalue character varying(255)
);


ALTER TABLE personattributes OWNER TO boresha;

--
-- Name: personattributes_attrid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE personattributes_attrid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE personattributes_attrid_seq OWNER TO boresha;

--
-- Name: personattributes_attrid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE personattributes_attrid_seq OWNED BY personattributes.attrid;


--
-- Name: personattributes_personid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE personattributes_personid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE personattributes_personid_seq OWNER TO boresha;

--
-- Name: personattributes_personid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE personattributes_personid_seq OWNED BY personattributes.personid;


--
-- Name: persontypeattributes; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE persontypeattributes (
    persontypeid integer NOT NULL,
    attrid integer NOT NULL
);


ALTER TABLE persontypeattributes OWNER TO boresha;

--
-- Name: persontypeattributes_attrid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE persontypeattributes_attrid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persontypeattributes_attrid_seq OWNER TO boresha;

--
-- Name: persontypeattributes_attrid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE persontypeattributes_attrid_seq OWNED BY persontypeattributes.attrid;


--
-- Name: persontypeattributes_persontypeid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE persontypeattributes_persontypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persontypeattributes_persontypeid_seq OWNER TO boresha;

--
-- Name: persontypeattributes_persontypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE persontypeattributes_persontypeid_seq OWNED BY persontypeattributes.persontypeid;


--
-- Name: persontypes; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE persontypes (
    persontypeid integer NOT NULL,
    persontypename character varying(255) NOT NULL
);


ALTER TABLE persontypes OWNER TO boresha;

--
-- Name: persontypes_persontypeid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE persontypes_persontypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE persontypes_persontypeid_seq OWNER TO boresha;

--
-- Name: persontypes_persontypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE persontypes_persontypeid_seq OWNED BY persontypes.persontypeid;


--
-- Name: productpayments; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE productpayments (
    producttransactionid bigint NOT NULL,
    moneytransactionid bigint NOT NULL
);


ALTER TABLE productpayments OWNER TO boresha;

--
-- Name: productpayments_moneytransactionid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE productpayments_moneytransactionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE productpayments_moneytransactionid_seq OWNER TO boresha;

--
-- Name: productpayments_moneytransactionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE productpayments_moneytransactionid_seq OWNED BY productpayments.moneytransactionid;


--
-- Name: productpayments_producttransactionid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE productpayments_producttransactionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE productpayments_producttransactionid_seq OWNER TO boresha;

--
-- Name: productpayments_producttransactionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE productpayments_producttransactionid_seq OWNED BY productpayments.producttransactionid;


--
-- Name: producttransactions; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE producttransactions (
    producttransactionid bigint NOT NULL,
    topersonid integer NOT NULL,
    frompersonid integer NOT NULL,
    producttypeid integer NOT NULL,
    amountofproduct real NOT NULL,
    costperunit money NOT NULL
);


ALTER TABLE producttransactions OWNER TO boresha;

--
-- Name: producttransactions_frompersonid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE producttransactions_frompersonid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producttransactions_frompersonid_seq OWNER TO boresha;

--
-- Name: producttransactions_frompersonid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE producttransactions_frompersonid_seq OWNED BY producttransactions.frompersonid;


--
-- Name: producttransactions_producttransactionid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE producttransactions_producttransactionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producttransactions_producttransactionid_seq OWNER TO boresha;

--
-- Name: producttransactions_producttransactionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE producttransactions_producttransactionid_seq OWNED BY producttransactions.producttransactionid;


--
-- Name: producttransactions_producttypeid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE producttransactions_producttypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producttransactions_producttypeid_seq OWNER TO boresha;

--
-- Name: producttransactions_producttypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE producttransactions_producttypeid_seq OWNED BY producttransactions.producttypeid;


--
-- Name: producttransactions_topersonid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE producttransactions_topersonid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producttransactions_topersonid_seq OWNER TO boresha;

--
-- Name: producttransactions_topersonid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE producttransactions_topersonid_seq OWNED BY producttransactions.topersonid;


--
-- Name: producttypes; Type: TABLE; Schema: public; Owner: boresha
--

CREATE TABLE producttypes (
    producttypeid integer NOT NULL,
    productname character varying(255) NOT NULL,
    productunits character varying(255) NOT NULL
);


ALTER TABLE producttypes OWNER TO boresha;

--
-- Name: producttypes_producttypeid_seq; Type: SEQUENCE; Schema: public; Owner: boresha
--

CREATE SEQUENCE producttypes_producttypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producttypes_producttypeid_seq OWNER TO boresha;

--
-- Name: producttypes_producttypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boresha
--

ALTER SEQUENCE producttypes_producttypeid_seq OWNED BY producttypes.producttypeid;


--
-- Name: attributes attrid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY attributes ALTER COLUMN attrid SET DEFAULT nextval('attributes_attrid_seq'::regclass);


--
-- Name: loanpayments loanid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loanpayments ALTER COLUMN loanid SET DEFAULT nextval('loanpayments_loanid_seq'::regclass);


--
-- Name: loanpayments moneytransactionid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loanpayments ALTER COLUMN moneytransactionid SET DEFAULT nextval('loanpayments_moneytransactionid_seq'::regclass);


--
-- Name: loans loanid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loans ALTER COLUMN loanid SET DEFAULT nextval('loans_loanid_seq'::regclass);


--
-- Name: loans moneytransactionid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loans ALTER COLUMN moneytransactionid SET DEFAULT nextval('loans_moneytransactionid_seq'::regclass);


--
-- Name: moneytransactions moneytransactionid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY moneytransactions ALTER COLUMN moneytransactionid SET DEFAULT nextval('moneytransactions_moneytransactionid_seq'::regclass);


--
-- Name: moneytransactions topersonid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY moneytransactions ALTER COLUMN topersonid SET DEFAULT nextval('moneytransactions_topersonid_seq'::regclass);


--
-- Name: moneytransactions frompersonid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY moneytransactions ALTER COLUMN frompersonid SET DEFAULT nextval('moneytransactions_frompersonid_seq'::regclass);


--
-- Name: person personid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY person ALTER COLUMN personid SET DEFAULT nextval('person_personid_seq'::regclass);


--
-- Name: person persontypeid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY person ALTER COLUMN persontypeid SET DEFAULT nextval('person_persontypeid_seq'::regclass);


--
-- Name: personattributes personid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY personattributes ALTER COLUMN personid SET DEFAULT nextval('personattributes_personid_seq'::regclass);


--
-- Name: personattributes attrid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY personattributes ALTER COLUMN attrid SET DEFAULT nextval('personattributes_attrid_seq'::regclass);


--
-- Name: persontypeattributes persontypeid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY persontypeattributes ALTER COLUMN persontypeid SET DEFAULT nextval('persontypeattributes_persontypeid_seq'::regclass);


--
-- Name: persontypeattributes attrid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY persontypeattributes ALTER COLUMN attrid SET DEFAULT nextval('persontypeattributes_attrid_seq'::regclass);


--
-- Name: persontypes persontypeid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY persontypes ALTER COLUMN persontypeid SET DEFAULT nextval('persontypes_persontypeid_seq'::regclass);


--
-- Name: productpayments producttransactionid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY productpayments ALTER COLUMN producttransactionid SET DEFAULT nextval('productpayments_producttransactionid_seq'::regclass);


--
-- Name: productpayments moneytransactionid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY productpayments ALTER COLUMN moneytransactionid SET DEFAULT nextval('productpayments_moneytransactionid_seq'::regclass);


--
-- Name: producttransactions producttransactionid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions ALTER COLUMN producttransactionid SET DEFAULT nextval('producttransactions_producttransactionid_seq'::regclass);


--
-- Name: producttransactions topersonid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions ALTER COLUMN topersonid SET DEFAULT nextval('producttransactions_topersonid_seq'::regclass);


--
-- Name: producttransactions frompersonid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions ALTER COLUMN frompersonid SET DEFAULT nextval('producttransactions_frompersonid_seq'::regclass);


--
-- Name: producttransactions producttypeid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions ALTER COLUMN producttypeid SET DEFAULT nextval('producttransactions_producttypeid_seq'::regclass);


--
-- Name: producttypes producttypeid; Type: DEFAULT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttypes ALTER COLUMN producttypeid SET DEFAULT nextval('producttypes_producttypeid_seq'::regclass);


--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY attributes (attrid, attriname) FROM stdin;
\.


--
-- Data for Name: loanpayments; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY loanpayments (loanid, moneytransactionid) FROM stdin;
\.


--
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY loans (loanid, moneytransactionid) FROM stdin;
\.


--
-- Data for Name: moneytransactions; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY moneytransactions (moneytransactionid, topersonid, frompersonid, amount) FROM stdin;
\.


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY person (personid, firstname, middlename, lastname, phonenumber, phonearea, phonecountry, persontypeid) FROM stdin;
\.


--
-- Data for Name: personattributes; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY personattributes (personid, attrid, attrvalue) FROM stdin;
\.


--
-- Data for Name: persontypeattributes; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY persontypeattributes (persontypeid, attrid) FROM stdin;
\.


--
-- Data for Name: persontypes; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY persontypes (persontypeid, persontypename) FROM stdin;
\.


--
-- Data for Name: productpayments; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY productpayments (producttransactionid, moneytransactionid) FROM stdin;
\.


--
-- Data for Name: producttransactions; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY producttransactions (producttransactionid, topersonid, frompersonid, producttypeid, amountofproduct, costperunit) FROM stdin;
\.


--
-- Data for Name: producttypes; Type: TABLE DATA; Schema: public; Owner: boresha
--

COPY producttypes (producttypeid, productname, productunits) FROM stdin;
\.


--
-- Name: attributes_attrid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('attributes_attrid_seq', 1, false);


--
-- Name: loanpayments_loanid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('loanpayments_loanid_seq', 1, false);


--
-- Name: loanpayments_moneytransactionid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('loanpayments_moneytransactionid_seq', 1, false);


--
-- Name: loans_loanid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('loans_loanid_seq', 1, false);


--
-- Name: loans_moneytransactionid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('loans_moneytransactionid_seq', 1, false);


--
-- Name: moneytransactions_frompersonid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('moneytransactions_frompersonid_seq', 1, false);


--
-- Name: moneytransactions_moneytransactionid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('moneytransactions_moneytransactionid_seq', 1, false);


--
-- Name: moneytransactions_topersonid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('moneytransactions_topersonid_seq', 1, false);


--
-- Name: person_personid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('person_personid_seq', 1, false);


--
-- Name: person_persontypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('person_persontypeid_seq', 1, false);


--
-- Name: personattributes_attrid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('personattributes_attrid_seq', 1, false);


--
-- Name: personattributes_personid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('personattributes_personid_seq', 1, false);


--
-- Name: persontypeattributes_attrid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('persontypeattributes_attrid_seq', 1, false);


--
-- Name: persontypeattributes_persontypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('persontypeattributes_persontypeid_seq', 1, false);


--
-- Name: persontypes_persontypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('persontypes_persontypeid_seq', 1, false);


--
-- Name: productpayments_moneytransactionid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('productpayments_moneytransactionid_seq', 1, false);


--
-- Name: productpayments_producttransactionid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('productpayments_producttransactionid_seq', 1, false);


--
-- Name: producttransactions_frompersonid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('producttransactions_frompersonid_seq', 1, false);


--
-- Name: producttransactions_producttransactionid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('producttransactions_producttransactionid_seq', 1, false);


--
-- Name: producttransactions_producttypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('producttransactions_producttypeid_seq', 1, false);


--
-- Name: producttransactions_topersonid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('producttransactions_topersonid_seq', 1, false);


--
-- Name: producttypes_producttypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: boresha
--

SELECT pg_catalog.setval('producttypes_producttypeid_seq', 1, false);


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (attrid);


--
-- Name: loanpayments loanpayments_loanid_moneytransactionid_key; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loanpayments
    ADD CONSTRAINT loanpayments_loanid_moneytransactionid_key UNIQUE (loanid, moneytransactionid);


--
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (loanid);


--
-- Name: moneytransactions moneytransactions_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY moneytransactions
    ADD CONSTRAINT moneytransactions_pkey PRIMARY KEY (moneytransactionid);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY person
    ADD CONSTRAINT person_pkey PRIMARY KEY (personid);


--
-- Name: persontypes persontypes_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY persontypes
    ADD CONSTRAINT persontypes_pkey PRIMARY KEY (persontypeid);


--
-- Name: producttransactions producttransactions_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions
    ADD CONSTRAINT producttransactions_pkey PRIMARY KEY (producttransactionid);


--
-- Name: producttypes producttypes_pkey; Type: CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttypes
    ADD CONSTRAINT producttypes_pkey PRIMARY KEY (producttypeid);


--
-- Name: loanpayments loanpayments_loanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loanpayments
    ADD CONSTRAINT loanpayments_loanid_fkey FOREIGN KEY (loanid) REFERENCES loans(loanid);


--
-- Name: loanpayments loanpayments_moneytransactionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loanpayments
    ADD CONSTRAINT loanpayments_moneytransactionid_fkey FOREIGN KEY (moneytransactionid) REFERENCES moneytransactions(moneytransactionid);


--
-- Name: loans loans_moneytransactionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY loans
    ADD CONSTRAINT loans_moneytransactionid_fkey FOREIGN KEY (moneytransactionid) REFERENCES moneytransactions(moneytransactionid);


--
-- Name: moneytransactions moneytransactions_frompersonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY moneytransactions
    ADD CONSTRAINT moneytransactions_frompersonid_fkey FOREIGN KEY (frompersonid) REFERENCES persontypes(persontypeid);


--
-- Name: moneytransactions moneytransactions_topersonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY moneytransactions
    ADD CONSTRAINT moneytransactions_topersonid_fkey FOREIGN KEY (topersonid) REFERENCES persontypes(persontypeid);


--
-- Name: person person_persontypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY person
    ADD CONSTRAINT person_persontypeid_fkey FOREIGN KEY (persontypeid) REFERENCES persontypes(persontypeid);


--
-- Name: personattributes personattributes_attrid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY personattributes
    ADD CONSTRAINT personattributes_attrid_fkey FOREIGN KEY (attrid) REFERENCES attributes(attrid);


--
-- Name: personattributes personattributes_personid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY personattributes
    ADD CONSTRAINT personattributes_personid_fkey FOREIGN KEY (personid) REFERENCES person(personid);


--
-- Name: persontypeattributes persontypeattributes_attrid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY persontypeattributes
    ADD CONSTRAINT persontypeattributes_attrid_fkey FOREIGN KEY (attrid) REFERENCES attributes(attrid);


--
-- Name: persontypeattributes persontypeattributes_persontypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY persontypeattributes
    ADD CONSTRAINT persontypeattributes_persontypeid_fkey FOREIGN KEY (persontypeid) REFERENCES persontypes(persontypeid);


--
-- Name: productpayments productpayments_moneytransactionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY productpayments
    ADD CONSTRAINT productpayments_moneytransactionid_fkey FOREIGN KEY (moneytransactionid) REFERENCES moneytransactions(moneytransactionid);


--
-- Name: productpayments productpayments_producttransactionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY productpayments
    ADD CONSTRAINT productpayments_producttransactionid_fkey FOREIGN KEY (producttransactionid) REFERENCES producttransactions(producttransactionid);


--
-- Name: producttransactions producttransactions_frompersonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions
    ADD CONSTRAINT producttransactions_frompersonid_fkey FOREIGN KEY (frompersonid) REFERENCES persontypes(persontypeid);


--
-- Name: producttransactions producttransactions_producttypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions
    ADD CONSTRAINT producttransactions_producttypeid_fkey FOREIGN KEY (producttypeid) REFERENCES producttypes(producttypeid);


--
-- Name: producttransactions producttransactions_topersonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: boresha
--

ALTER TABLE ONLY producttransactions
    ADD CONSTRAINT producttransactions_topersonid_fkey FOREIGN KEY (topersonid) REFERENCES persontypes(persontypeid);


--
-- PostgreSQL database dump complete
--

