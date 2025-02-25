CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS Users(
    id UUID DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    account_non_locked BOOLEAN DEFAULT TRUE,
    account_non_expired BOOLEAN DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Markets(
    id UUID DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (id)
);

CREATE TABLE Addresses(
    id UUID DEFAULT gen_random_uuid(),
    country VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(255),
    complement VARCHAR(255),
    UNIQUE (country, state, city, neighborhood, street, number, complement),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Market_Addresses(
    id UUID DEFAULT gen_random_uuid(),
    market_id UUID NOT NULL,
    address_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    UNIQUE (address_id),
    PRIMARY KEY (id),
    FOREIGN KEY (market_id) REFERENCES Markets(id),
    FOREIGN KEY (address_id) REFERENCES Addresses(id)
);

CREATE TABLE IF NOT EXISTS Products(
    id UUID DEFAULT gen_random_uuid(),
    brand VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    UNIQUE (brand, name),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Market_Products(
    id UUID DEFAULT gen_random_uuid(),
    market_id UUID NOT NULL,
    product_id UUID NOT NULL,
    url VARCHAR(255),
    price FLOAT,
    unit_measure VARCHAR(255),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    UNIQUE (market_id, product_id),
    PRIMARY KEY (id),
    FOREIGN KEY (market_id) REFERENCES Markets(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Offers(
    id UUID DEFAULT gen_random_uuid(),
    offer_type_id UUID NOT NULL,
    market_product_id UUID NOT NULL,
    price FLOAT NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    UNIQUE (offer_type_id, market_product_id),
    PRIMARY KEY (id),
    FOREIGN KEY (market_product_id) REFERENCES Market_Products(id)
);

CREATE TABLE IF NOT EXISTS Offer_Types(
    id UUID DEFAULT gen_random_uuid(),
    market_id UUID,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    UNIQUE (market_id, name),
    PRIMARY KEY (id),
    FOREIGN KEY (market_id) REFERENCES Markets(id)
);

CREATE TABLE IF NOT EXISTS Offer_Rules(
    id UUID DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL,
    min_quantity INTEGER,
    max_quantity INTEGER,
    charged_quantity INTEGER,
    unit_measure VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('UTC', now()),
    updated_at TIMESTAMPTZ,
    UNIQUE (offer_id),
    PRIMARY KEY (id),
    FOREIGN KEY (offer_id) REFERENCES Offers(id)
);