const continents = [
    {
        "_id": 1,
        "name": "Africa"
    },
    {
        "_id": 2,
        "name": "Europe"
    },
    {
        "_id": 3,
        "name": "Asia"
    },
    {
        "_id": 4,
        "name": "North America"
    },
    {
        "_id": 5,
        "name": "South America"
    },
    {
        "_id": 6,
        "name": "Australia"
    },
    {
        "_id": 7,
        "name": "Antarctica"
    }

]

const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $99",
        "array": [0, 99]
    },
    {
        "_id": 2,
        "name": "100 to $999",
        "array": [100, 999]
    },
    {
        "_id": 3,
        "name": "$1000 to $9999",
        "array": [1000, 9999]
    },
    {
        "_id": 4,
        "name": "$10000 to $99999",
        "array": [10000, 99999]
    },
    {
        "_id": 5,
        "name": "More than $100000",
        "array": [100000, 100000000000000000000000]
    }
]




export {
    continents,
    price
}