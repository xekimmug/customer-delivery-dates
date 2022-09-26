# Customer Delivery Dates

## Assumptions (Imaginations :D)

- Delivery cannot be booked for same day, i.e. only upcoming 14 days from and including tomorrow are
  calculated. Hence, the day you place your order does not count as -1 to the "daysInAdvance"
  </br>
- As long as one or more products cannot be delivered on that date, the entire date will be regarded as unavailable
  </br>
- According to the document, "All external products need to be ordered 5 days in advance", therefore the "daysInAdvance"
  for external products in dataset will be disregarded, even if it is set to a value not equals to 5
  </br>
- Each Friday is "green delivery"
  </br>
- This app is acting as backend APIs communicating with a frontend, request payload shall be minimized and the internal
  details (e.g. productType, daysInAdvance) shall not be exposed directly via network, hence only product ids are
  exchanged for security and privacy concerns
  </br>
- This app is an MVP (Minimal Viable Product) version 1, there are surely things that can be further implemented when it
  is being deployed to real environment, including but not limited to: use of logging framework, linters, prettier,
  husky, and setups of DB, Docker, CDCI, AWS etc.
  </br>
- Available products with details are simply simulated by a JSON file "realProducts.json" under directory "data". The
  other file "testProducts.json" is test data.
  </br>

## Design Pattern

Repository-Service Pattern

## Use

"npm start" will start the server, and it reads the dataset in ./data/realProducts.json to simulate database/storage
data.
Please see package.json for more scripts including unit- and integration- tests

