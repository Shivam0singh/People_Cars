import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PERSON_WITH_CARS } from '../graphql/queries';
import { Card, Button, Typography } from 'antd';

const { Title } = Typography;

function PersonDetails() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const person = data?.person;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>
        {person.firstName} {person.lastName}
      </Title>

      <Card title="Cars Owned" style={{ backgroundColor: '#fff' }}>
        {person.cars.map((car) => (
          <Card type="inner" key={car.id} title={`${car.year} ${car.make} ${car.model}`} style={{ marginBottom: '10px' }}>
            <p>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(car.price)}</p>
          </Card>
        ))}
      </Card>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/">
          <Button type="primary">GO BACK HOME</Button>
        </Link>
      </div>
    </div>
  );
}

export default PersonDetails;


