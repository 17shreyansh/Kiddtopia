import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Card, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const ServiceEditPage = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Fetch JWT token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      message.error("Authentication token not found. Please login.");
    }
  }, []);

  // Fetch current data once token is available
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          form.setFieldsValue({
            heading: res.data.heading,
          });
          // Ensure that the image object is correctly structured and add 'preview' for display
          const formattedServices = res.data.services.map(service => ({
            ...service,
            image: service.image || { src: '', cloudinaryPublicId: undefined, alt: '' },
            preview: service.image?.src || '', // Use existing Cloudinary URL for preview
            newImageBase64: null, // Initialize for new uploads
          }));
          setServices(formattedServices || []);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch services data:", error);
        message.error("Failed to fetch services data.");
      });
  }, [form, token]);

  // Handle form submit
  const onFinish = async (values) => {
    setLoading(true);

    // Prepare services data for the backend
    const servicesToSubmit = services.map(service => {
      // Create a clean service object for submission
      const serviceData = {
        title: service.title,
        description: service.description,
        image: {
          src: service.image?.src, // Existing Cloudinary URL
          cloudinaryPublicId: service.image?.cloudinaryPublicId, // Existing Cloudinary Public ID
          alt: service.image?.alt || '',
        },
      };

      // If a new image was uploaded (base64 data exists), override the image object
      if (service.newImageBase64) {
        serviceData.image = {
          data: service.newImageBase64, // Send base64 data for new image
          alt: service.title || 'Service image', // Use title as alt text
        };
      }
      return serviceData;
    });

    // Validation: Ensure every service has an image (old or new)
    for (let i = 0; i < servicesToSubmit.length; i++) {
      const service = servicesToSubmit[i];
      if (!service.image || (!service.image.src && !service.image.data)) {
        message.error(`Service ${i + 1} must have an image.`);
        setLoading(false);
        return;
      }
    }

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/services`, {
        heading: values.heading,
        services: servicesToSubmit, // Send the array of service objects
      }, {
        headers: {
          "Content-Type": "application/json", // Explicitly set to JSON
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Services updated successfully!");
    } catch (e) {
      console.error("Update failed:", e);
      message.error("Update failed: " + (e.response?.data?.error || e.message));
    }
    setLoading(false);
  };

  // Handle service field change (title, description)
  const handleServiceChange = (idx, key, value) => {
    const newServices = [...services];
    newServices[idx][key] = value;
    setServices(newServices);
  };

  // Handle image upload - converts file to base64 for sending to backend
  const handleImageChange = (idx, file) => {
    if (!file) return false;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newServices = [...services];
      newServices[idx].newImageBase64 = reader.result; // Store the base64 string
      newServices[idx].preview = reader.result; // For displaying local preview
      newServices[idx].image = { src: '', cloudinaryPublicId: undefined, alt: '' }; // Clear old Cloudinary info
      setServices(newServices);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      message.error("Failed to read image file.");
    };
    return false; // Prevent Ant Design's default upload behavior
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
                  onChange={(e) => handleServiceChange(idx, "title", e.target.value)}
                  placeholder="Title"
                  style={{ marginBottom: 8 }}
                />
                <TextArea
                  value={service.description}
                  onChange={(e) => handleServiceChange(idx, "description", e.target.value)}
                  rows={3}
                  placeholder="Description"
                  style={{ marginBottom: 8 }}
                />
                <Upload
                  beforeUpload={(file) => handleImageChange(idx, file)}
                  showUploadList={false}
                >
                  <Button icon={<PlusOutlined />}>Upload Image</Button>
                </Upload>
                {service.preview && ( // Display preview if available
                  <img
                    src={service.preview}
                    alt={service.title || "Service image preview"}
                    style={{ width: 80, height: 80, objectFit: 'cover', marginTop: 8, borderRadius: '8px' }}
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
          onClick={() => setServices([...services, { title: "", description: "", image: null, preview: '', newImageBase64: null }])}
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
