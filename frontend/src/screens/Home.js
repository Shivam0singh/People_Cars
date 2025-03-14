import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, Button, Form, Input, Select, message, Modal, Typography, Space } from 'antd';
import { ADD_PERSON, ADD_CAR, GET_PEOPLE, GET_CARS, DELETE_PERSON, DELETE_CAR, UPDATE_PERSON } from '../graphql/queries';
import { Link } from 'react-router-dom';
import EditCarModal from './card';

const { Title } = Typography;
const { Option } = Select;

const Home = () => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE);
  const { data: carsData } = useQuery(GET_CARS);
  const [addPerson] = useMutation(ADD_PERSON);
  const [addCar] = useMutation(ADD_CAR);
  const [deletePerson] = useMutation(DELETE_PERSON);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [updatePerson] = useMutation(UPDATE_PERSON);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isEditPersonModalVisible, setIsEditPersonModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [personForm] = Form.useForm();
  const [carForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleAddPerson = async (values) => {
    try {
      await addPerson({
        variables: { firstName: values.firstName, lastName: values.lastName },
        refetchQueries: [{ query: GET_PEOPLE }, { query: GET_CARS }], // Refetch both queries
      });
      personForm.resetFields();
      message.success('Person added successfully!');
    } catch (error) {
      message.error('Failed to add person!');
    }
  };

  const handleAddCar = async (values) => {
    try {
      await addCar({
        variables: {
          year: parseInt(values.year, 10),
          make: values.make,
          model: values.model,
          price: parseFloat(values.price),
          personId: values.personId,
        },
        refetchQueries: [{ query: GET_CARS }],
      });
      carForm.resetFields();
      message.success('Car added successfully!');
    } catch (error) {
      message.error('Failed to add car!');
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      await deletePerson({
        variables: { id },
        refetchQueries: [{ query: GET_PEOPLE }, { query: GET_CARS }], // Refetch both queries
      });
      message.success('Person deleted successfully!');
    } catch (error) {
      message.error('Failed to delete person!');
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await deleteCar({
        variables: { id },
        refetchQueries: [{ query: GET_CARS }],
      });
      message.success('Car deleted successfully!');
    } catch (error) {
      message.error('Failed to delete car!');
    }
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setIsEditModalVisible(true);
  };

  const handleEditPerson = (person) => {
    setSelectedPerson(person);
    editForm.setFieldsValue({ firstName: person.firstName, lastName: person.lastName });
    setIsEditPersonModalVisible(true);
  };

  const handleUpdatePerson = async (values) => {
    try {
      await updatePerson({
        variables: { id: selectedPerson.id, ...values },
        refetchQueries: [{ query: GET_PEOPLE }, { query: GET_CARS }], // Refetch both queries
      });
      message.success('Person updated successfully!');
      setIsEditPersonModalVisible(false);
    } catch (error) {
      message.error('Failed to update person!');
    }
  };

  const showDeleteModal = (type, id) => {
    setDeleteType(type);
    setDeleteId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'person') {
      handleDeletePerson(deleteId);
    } else if (deleteType === 'car') {
      handleDeleteCar(deleteId);
    }
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>
        People and their Cars 
      </Title>

      <Card title="Add Person" style={{ marginBottom: '20px', backgroundColor: '#fff' }}>
        <Form form={personForm} onFinish={handleAddPerson} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Person
          </Button>
        </Form>
      </Card>

      <Card title="Add Car" style={{ marginBottom: '20px', backgroundColor: '#fff' }}>
        {peopleData?.people?.length > 0 && (
          <Form form={carForm} onFinish={handleAddCar} layout="vertical">
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
            <Form.Item name="personId" label="Person" rules={[{ required: true }]}>
              <Select>
                {peopleData?.people?.map((person) => (
                  <Option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Add Car
            </Button>
          </Form>
        )}
      </Card>

      <Card title="People List" style={{ backgroundColor: '#fff' }}>
        {peopleLoading ? (
          <p>Loading...</p>
        ) : (
          peopleData?.people?.map((person) => (
            <Card
              key={person.id}
              title={`${person.firstName} ${person.lastName}`}
              style={{ marginBottom: '10px', backgroundColor: '#fafafa' }}
              actions={[
                <Button type="primary" danger onClick={() => showDeleteModal('person', person.id)}>
                  Delete Person
                </Button>,
                <Button type="primary" onClick={() => handleEditPerson(person)}>
                  Edit Person
                </Button>,
                <Link to={`/people/${person.id}`}>LEARN MORE</Link>,
              ]}
            >
              {carsData?.cars
                .filter((car) => car.personId === person.id)
                .map((car) => (
                  <Card type="inner" key={car.id} title={`${car.year} ${car.make} ${car.model}`} style={{ marginBottom: '10px' }}>
                    <p>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(car.price)}</p>
                    <Space>
                      <Button type="primary" danger onClick={() => showDeleteModal('car', car.id)}>
                        Delete Car
                      </Button>
                      <Button type="primary" onClick={() => handleEditCar(car)}>
                        Update Car
                      </Button>
                    </Space>
                  </Card>
                ))}
            </Card>
          ))
        )}
      </Card>

      {isEditModalVisible && selectedCar && (
        <EditCarModal car={selectedCar} setIsEditModalVisible={setIsEditModalVisible} />
      )}

      <Modal
        title="Edit Person"
        visible={isEditPersonModalVisible}
        onCancel={() => setIsEditPersonModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleUpdatePerson} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update Person
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Delete Confirmation"
        visible={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this {deleteType}?</p>
      </Modal>
    </div>
  );
};

export default Home;