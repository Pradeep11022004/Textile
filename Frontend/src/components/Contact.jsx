
import { useState } from "react";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Contact form UI is ready. Connect a backend to send messages.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        <div className="contact-heading">
          <p>WE WOULD LOVE TO HEAR FROM YOU</p>
          <h2>Get in Touch</h2>
          <span>
            Have a question about our collections? Send us a message.
            We're here to help.
          </span>
        </div>

        <div className="contact-content">

          {/* Contact Information */}
          <div className="contact-info">
            <h3>Let's Talk</h3>
            <p>
              Whether you're looking for the perfect fabric or need
              assistance with an order, feel free to contact us.
            </p>

            <div className="contact-info-item">
              <span className="contact-icon">✉</span>
              <div>
                <strong>Email</strong>
                <p>Contact us through the form</p>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="contact-icon">◈</span>
              <div>
                <strong>Our Promise</strong>
                <p>Quality textiles and customer support</p>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="contact-icon">⌖</span>
              <div>
                <strong>Brand</strong>
                <p>Aura Textile</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="What is your message about?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-input-group">
              <label>Your Message</label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message <span>→</span>
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}

export default Contact;
