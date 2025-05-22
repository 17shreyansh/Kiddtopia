import React from "react";
import { Typography, Divider, Layout } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
  return (
    <Layout style={{ padding: "48px 24px", background: "transparent" }}>
      <Content style={{ maxWidth: 960, margin: "50px auto" }}>
        <Typography>
          <Title level={2}>Privacy Policy – Kiddtopia</Title>
          <Paragraph>
            At <Text strong>Kiddtopia</Text>, we value your privacy and are committed to protecting
            your personal information. This policy outlines how we collect, use, store, and
            safeguard your data when you interact with our website, events, memberships, or
            services.
          </Paragraph>

          <Divider />

          <Title level={4}>1. Information We Collect</Title>
          <Paragraph>
            We may collect the following types of information:
            <br />
            – Personal Identification Information: Name, email, phone number, child’s name/age, etc.
            <br />
            – Payment Details: Processed only through secure third-party payment gateways.
            <br />
            – Event & Booking Information: Preferences, guest details, selected packages.
            <br />
            – Device & Browsing Data: IP address, browser, location, usage activity.
          </Paragraph>

          <Title level={4}>2. How We Use Your Information</Title>
          <Paragraph>
            Your data is used strictly for the following purposes:
            <br />
            – To confirm bookings and reservations.
            <br />
            – To provide personalized event planning or membership services.
            <br />
            – To send updates, offers, or important changes.
            <br />
            – To enhance user experience and website performance.
            <br />
            – For safety and proper record-keeping during visits.
          </Paragraph>

          <Title level={4}>3. Data Sharing Policy</Title>
          <Paragraph>
            We do not sell your personal data.
            <br />
            Limited data may be shared with trusted vendors for service execution.
            <br />
            We only disclose data to legal authorities when required by law.
          </Paragraph>

          <Title level={4}>4. Cookies and Analytics</Title>
          <Paragraph>
            Kiddtopia uses cookies to monitor site performance and enhance your experience.
            <br />
            These cookies do not store personal information and can be managed in your browser
            settings.
          </Paragraph>

          <Title level={4}>5. Data Protection & Security</Title>
          <Paragraph>
            All data is stored securely with encryption where applicable.
            <br />
            Transactions are processed via SSL-secured networks.
            <br />
            We follow industry best practices to prevent unauthorized access or breaches.
          </Paragraph>

          <Title level={4}>6. Your Rights</Title>
          <Paragraph>
            You have the right to:
            <br />
            – Request access to your personal data.
            <br />
            – Ask for corrections or updates.
            <br />
            – Opt-out of marketing communications.
            <br />
            – Request deletion of your data, where legally applicable.
          </Paragraph>

          <Title level={4}>7. Children's Privacy</Title>
          <Paragraph>
            We take child privacy seriously. All information related to minors is voluntarily
            provided by parents/guardians and used only for service delivery.
          </Paragraph>

          <Title level={4}>8. Policy Updates</Title>
          <Paragraph>
            This policy may be updated periodically. Continued use of our services implies
            acceptance of changes.
          </Paragraph>

          <Divider />

          <Title level={4}>Contact Us</Title>
          <Paragraph>
            Kiddtopia, Sector 138, Noida
            <br />
            📧 <a href="mailto:kiddtopia132@gmail.com">kiddtopia132@gmail.com</a>
            <br />
            WhatsApp: <a href="https://wa.me/919266233778">+91-9266233778</a>
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
