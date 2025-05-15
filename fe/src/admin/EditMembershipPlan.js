import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Card } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMembershipPlan = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/membership-plans/`)
      .then(({ data }) => {
        form.setFieldsValue(data);
      })
      .catch(() => {
        message.error('Failed to load membership plan');
      });
  }, [id, form]);

  const onFinish = (values) => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/membership-plans/`, values)
      .then(() => {
        message.success('Membership plan updated successfully');
        navigate('/'); // Change this to your plans list route if needed
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.error || 'Failed to update membership plan';
        message.error(errMsg);
      });
  };

  return (
    <Card title="Edit Membership Plan" style={{ maxWidth: 500, margin: '40px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ price: 0 }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter the plan title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the plan description' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price (₹)"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditMembershipPlan;
