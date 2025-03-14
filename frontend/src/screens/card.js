import React from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_CAR, GET_CARS } from '../graphql/queries';

const Cards = ({ car, setIsEditModalVisible }) => {
  const [updateCar] = useMutation(UPDATE_CAR, { refetchQueries: [{ query: GET_CARS }] });
  const [form] = Form.useForm();

  const handleUpdate = async (values) => {
    try {
      await updateCar({
        variables: {
          id: car.id,
          year: parseInt(values.year, 10),
          make: values.make,
          model: values.model,
          price: parseFloat(values.price),
        },
      });
      message.success('Car updated successfully!');
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update car!');
      console.error('Mutation Error:', error);
    }
  };
  return (
    <Modal title="Edit Car" visible={true} onCancel={() => setIsEditModalVisible(false)} footer={null}>
      <Form form={form} initialValues={car} onFinish={handleUpdate} layout="vertical">
        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="make" label="Make" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="model" label="Model" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update Car
        </Button>
      </Form>
    </Modal>
  );
};

export default Cards;