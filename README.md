## Online Demo
https://master.dibs5sykotrsv.amplifyapp.com/

## Tech stacks
I tried to keep external packages to a minimum and take as much advantage of AWS as I could. These are the stacks I arrived at:

### Backend Tech Stack
  - **AWS Amplify** for quick scaffolding and CI/CD
  - **GraphQL API** with **AWS AppSync** for user management
  - **REST API** in **Typescript** with **Lambda** for location service
  - **IpData** to get users' location info
  - **AWS Amazon DynamoDB** for storage

### Frontend Tech Stack  
  - **TypeScript + Vue 3** with **GraphQL code generation**
  - **TailwindCSS** for styling
  - **Vueuse** for utility functions
  - **Vite** for quick builds and dev server
  - **Cypress** for **E2E tests**
  - **Jest** for **Unit tests**
  - **Storybook** to create a simple component catalog
  - **Google Maps Javascript** API to handle maps

### Features
  - Full users CRUD
  - Client and server side filtering
  - Infinite loading with query params
  - Loading and error states
  - Animated modal (you can also press ESC to quit)
  - When deleting, creating or updating an user no additional queries are run. The changes are applied locally.
  - Map preview moves to the supplied address
  - Storybook with base components
  - Responsive pages

### Things I wanted to do but didn't have the time
  - Better test coverage. Only the basic CRUD operations are covered in the E2E tests, and only the base components have unit tests.
  - "Two-way" binding between map and address field. Currently only typing the address updates the map. I wanted to click on the map and have an address generated from this action.
  - Sentry for logging and tracking errors.
  - Better tab navigation. Currently you can navigate through the cards' buttons using tab, but when a modal opens the focus isn't stolen.
  - Clear button inside text search field. (nitpicking)

I appreciate any feedback!