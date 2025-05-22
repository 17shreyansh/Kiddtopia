import React from "react";
import { Typography, Divider, Layout } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const TermsAndConditions = () => {
  return (
    <Layout style={{ padding: "48px 24px", background: "transparent" }}>
      <Content style={{ maxWidth: 960, margin: "50px auto" }}>
        <Typography>
          <Title level={2}>Terms & Conditions – Kiddtopia</Title>
          <Paragraph>
            Welcome to <Text strong>Kiddtopia</Text>, your go-to destination for playful memories,
            immersive VR gaming, educational school tours, and themed celebrations. By accessing and
            using our services, facilities, website, and offerings, you agree to comply with the
            following terms and conditions:
          </Paragraph>

          <Divider />

          <Title level={4}>1. General Use of Services</Title>
          <Paragraph>
            Kiddtopia provides entertainment, gaming, party, and event hosting services for
            children, families, schools, and corporates.
            <br />
            All visitors must follow the rules and instructions provided by our staff to ensure a
            safe and enjoyable experience for everyone.
            <br />
            Entry into the premises implies agreement with our guidelines, including safety,
            hygiene, and conduct protocols.
          </Paragraph>

          <Title level={4}>2. Membership Policy</Title>
          <Paragraph>
            Membership plans are non-refundable, non-transferable, and valid only for the individual
            named during registration.
            <br />
            Kiddtopia reserves the right to revoke membership in case of misuse, inappropriate
            behavior, or violation of center rules.
            <br />
            Memberships cover access to specific play zones and activities as defined in each
            package.
          </Paragraph>

          <Title level={4}>3. Booking & Cancellation</Title>
          <Paragraph>
            Event and party bookings must be confirmed with a 50% advance payment.
            <br />
            Cancellations made 7 days prior to the event will receive a 50% refund. No refunds for
            cancellations made less than 48 hours before the event.
            <br />
            Rescheduling is subject to availability and management discretion.
          </Paragraph>

          <Title level={4}>4. Safety and Supervision</Title>
          <Paragraph>
            Children under the age of 10 must be accompanied by a guardian at all times unless part
            of a supervised school tour or event.
            <br />
            Our trained staff will assist in managing play zones, but Kiddtopia does not assume
            parental responsibility for children during open play hours.
            <br />
            Entry may be restricted to guests under the influence of alcohol or displaying
            inappropriate behavior.
          </Paragraph>

          <Title level={4}>5. Photography & Media</Title>
          <Paragraph>
            Kiddtopia may photograph or film events for promotional purposes. If you do not wish to
            be photographed, kindly inform the staff at entry.
            <br />
            Personal photography is permitted, but professional equipment and shoots require prior
            approval.
          </Paragraph>

          <Title level={4}>6. Damage & Liability</Title>
          <Paragraph>
            Any damage caused to Kiddtopia property, games, or infrastructure due to negligence or
            misconduct will be chargeable.
            <br />
            Kiddtopia is not liable for personal belongings lost or misplaced within the premises.
          </Paragraph>

          <Title level={4}>7. Health & Hygiene</Title>
          <Paragraph>
            Shoes are not allowed in play zones. Socks must be worn at all times.
            <br />
            Children with visible signs of illness may be denied entry in the interest of public
            health.
          </Paragraph>

          <Title level={4}>8. Changes to Terms</Title>
          <Paragraph>
            Kiddtopia reserves the right to update these terms and conditions at any time. Continued
            use of services implies acceptance of changes.
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

export default TermsAndConditions;
