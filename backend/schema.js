const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    deletePerson(id: ID!): Person
    updateCar(id: ID!, year: Int!, make: String!, model: String!, price: Float!): Car
    deleteCar(id: ID!): Car
    updatePerson(id: ID!, firstName: String, lastName: String): Person
  }
`;

let people = [
  { id: '1', firstName: 'Bill', lastName: 'Gates' },
  { id: '2', firstName: 'Steve', lastName: 'Jobs' },
  { id: '3', firstName: 'Linux', lastName: 'Torvalds' },
];

let cars = [
  { id: '1', year: '2019', make: 'Toyota', model: 'Corolla', price: 40000, personId: '1' },
  { id: '2', year: '2018', make: 'Lexus', model: 'LX 600', price: 13000, personId: '1' },
  { id: '3', year: '2017', make: 'Honda', model: 'Civic', price: 20000, personId: '1' },
  { id: '4', year: '2019', make: 'Acura', model: 'MDX', price: 60000, personId: '2' },
  { id: '5', year: '2018', make: 'Ford', model: 'Focus', price: 35000, personId: '2' },
  { id: '6', year: '2017', make: 'Honda', model: 'Pilot', price: 45000, personId: '2' },
  { id: '7', year: '2019', make: 'Volkswagen', model: 'Golf', price: 40000, personId: '3' },
  { id: '8', year: '2018', make: 'Kia', model: 'Sorento', price: 45000, personId: '3' },
  { id: '9', year: '2017', make: 'Volvo', model: 'XC40', price: 55000, personId: '3' }
];

const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (parent, args) => people.find(person => person.id === args.id),
    car: (parent, args) => cars.find(car => car.id === args.id)
  },

  Person: {
    cars: (parent) => cars.filter(car => car.personId === parent.id)
  },

  Mutation: {
    addPerson: (parent, args) => {
      const newPerson = {
        id: String(people.length + 1),
        firstName: args.firstName,
        lastName: args.lastName
      };
      people.push(newPerson);
      return newPerson;
    },
    addCar: (parent, args) => {
   
      const newCar = {
        id: String(cars.length + 1),
        year: args.year,
        make: args.make,
        model: args.model,
        price: args.price,  
        personId: args.personId,
      };
   
      cars.push(newCar);
   
      return newCar;
    },
   
      deletePerson: (parent, args) => {
        try {
          const personIndex = people.findIndex(person => person.id === args.id);
          if (personIndex === -1) return null;
          const deletedPerson = people.splice(personIndex, 1)[0];
    
         
          cars = cars.filter(car => car.personId !== args.id);

          return deletedPerson;
        } catch (error) {
          throw new Error("Failed to delete person");
        }
      }, 
      updateCar: (_, { id, year, make, model, price }) => {
        const carIndex = cars.findIndex(car => car.id === id);
        if (carIndex === -1) throw new Error('Car not found');
        cars[carIndex] = { ...cars[carIndex], year, make, model, price };
        return cars[carIndex];
      },

      deleteCar: (_, { id }) => {
        const carIndex = cars.findIndex(car => car.id === id);
        if (carIndex === -1) throw new Error('Car not found');
        
        const deletedCar = cars[carIndex]; 
        cars.splice(carIndex, 1); 
    
        return deletedCar; 
    },
    updatePerson: (parent, args) => {
      const person = people.find(p => p.id === args.id);
      if (!person) throw new Error('Person not found');
      if (args.firstName) person.firstName = args.firstName;
      if (args.lastName) person.lastName = args.lastName;
      return person;
    },

    
    
  }
};

module.exports = { typeDefs, resolvers };