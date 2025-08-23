
const kinds = [
    "PM",
    "PK",
    "AC",
    "KS"
]

const customers = [
    { "001": "WIP" },
    { "025": "IPCA" }
]

const certifications = [
    { "001": "GOTS" },
    { "002": "BLUE" },
    { "003": "GREEN" }
]

const units = [
    { "001": "UN" },
    { "002": "PK" },
    { "003": "PAIR" }
]

const currencies = [
    { "001": "EUR" },
    { "002": "USD" },
    { "003": "JPY" },
    { "004": "GBP" }
]

const sustComps = [
    { "001": "ECO" },
    { "002": "WOOL" },
    { "003": "GRTXT" },
]

const brandsPerCustomer = {
    "001": [
        { "001": "WIPTech Pro" },
        { "253": "WIPTech Ultra" },
        { "563": "WIPTech Standard" },
    ],
    "025": [
        { "009": "IPCA 1" },
        { "632": "IPCA 2" },
    ]
}

const colorsPerBrand = {
    "001": [
        { "002": "Pure Red" },
        { "006": "Soft White" },
        { "009": "Sunset Orange" },
    ],
    "253": [
        { "025": "Pure Red" },
        { "085": "Soft White" },
    ],
    "563": [
        { "001": "Black" },
        { "002": "White" },
    ],
    "009": [
        { "001": "Green" },
        { "002": "White" },
    ],
    "632": [
        { "001": "Green" },
        { "002": "White" },
    ]

}

import axios from "axios"
import AxiosMockAdapter from "axios-mock-adapter";


// This sets the mock adapter on the default instance
const mock = new AxiosMockAdapter(axios);


// Mock GET /kinds
mock.onGet("/kinds").reply(200, { success: true, data: kinds });

// Mock GET /create/PK
mock.onGet("/create/PK").reply(200,
    {
        success: true,
        customer: customers,
        certification: certifications,
        unit: units,
        currency: currencies,
        sustComp: sustComps
    });

// Mock GET /customer/:id/brands
mock.onGet(/\/customer\/\d+\/brands/).reply(config => {
    const match = config.url.match(/\/customer\/(\d+)\/brands/);
    const customerId = match ? match[1] : null;

    // Return the brands for the specified customer
    if (customerId && brandsPerCustomer[customerId]) {
        return [200, { success: true, data: brandsPerCustomer[customerId] }];
    } else {
        return [404, { success: false, message: "Nenhuma marca encontrada" }];
    }
});

// Mock GET /brand/:id/colors
mock.onGet(/\/brand\/\d+\/colors/).reply(config => {
    const match = config.url.match(/\/brand\/(\d+)\/colors/);
    const brandId = match ? match[1] : null;

    // Return the colors for the specified brand
    if (brandId && colorsPerBrand[brandId]) {
        return [200, { success: true, data: colorsPerBrand[brandId] }];
    } else {
        return [404, { success: false, message: "Nenhuma cor encontrada" }];
    }
});



axios.get("/create/PK").then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
