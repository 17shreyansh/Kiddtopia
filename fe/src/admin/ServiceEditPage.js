import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Card, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const ServiceEditPage = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch current data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`).then(res => {
      if (res.data) {
        form.setFieldsValue({
          heading: res.data.heading,
        });
        setServices(res.data.services || []);
      }
    });
  }, [form]);

  // Handle form submit
  const onFinish = async (values) => {
    setLoading(true);

    // Validation: Ensure every service has an image (old or new)
    for (const service of services) {
      if (!service.image && !service.newImage) {
        message.error("All services must have an image.");
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("heading", values.heading);
    formData.append("services", JSON.stringify(services));

    // Append new images
    services.forEach((service) => {
      if (service.newImage) {
        formData.append("images", service.newImage);
      }
    });

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/services`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Services updated!");
    } catch (e) {
      message.error("Update failed");
    }
    setLoading(false);
  };

  // Handle service change
  const handleServiceChange = (idx, key, value) => {
    const newServices = [...services];
    newServices[idx][key] = value;
    setServices(newServices);
  };

  // Handle image upload
  const handleImageChange = (idx, file) => {
    const newServices = [...services];
    newServices[idx].newImage = file;
    setServices(newServices);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Card title="Heading">
        <Form.Item name="heading" label="Heading" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Card>

      <Card title="Services" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          {services.map((service, idx) => (
            <Col span={12} key={idx}>
              <Card
                title={`Service ${idx + 1}`}
                style={{ marginBottom: 16 }}
                extra={
                  <Button
                    danger
                    onClick={() => setServices(services.filter((_, i) => i !== idx))}
                  >
                    Delete
                  </Button>
                }
              >
                <Input
                  value={service.title}
                  onChange={e => handleServiceChange(idx, "title", e.target.value)}
                  placeholder="Title"
                  style={{ marginBottom: 8 }}
                />
                <TextArea
                  value={service.description}
                  onChange={e => handleServiceChange(idx, "description", e.target.value)}
                  rows={3}
                  placeholder="Description"
                  style={{ marginBottom: 8 }}
                />
                <Upload
                  beforeUpload={file => {
                    handleImageChange(idx, file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<PlusOutlined />}>Upload Image</Button>
                </Upload>
                {(service.newImage || service.image) && (
                  <img
                    src={
                      service.newImage
                        ? URL.createObjectURL(service.newImage)
                        : `${process.env.REACT_APP_BACKEND_URL}/uploads/${service.image}`
                    }
                    alt=""
                    style={{ width: 80, marginTop: 8 }}
                  />
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() =>
            setServices([...services, { title: "", description: "", image: "" }])
          }
        >
          Add Service
        </Button>
      </Card>

      <Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: 24 }}>
        Save Changes
      </Button>
    </Form>
  );
};

export default ServiceEditPage;
