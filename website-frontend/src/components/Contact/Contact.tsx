// contact page
import { useState } from "react";
import "./Contact.css";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post("/api/contact/send", formData);

      setSubmitStatus({
        success: true,
        message:
          "Your message has been sent successfully! We will get back to you soon.",
      });

      // Reset form data
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Failed to send your message. Please try again later.",
      });
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container dark:bg-gray-800">
      <div className="contact-header dark:bg-gray-800">
        <h1 className="dark:text-white">Contact Us</h1>
        <p className="dark:text-gray-300">
          Get in touch with our research team
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info dark:bg-gray-700 dark:border-gray-600">
          <div className="info-section">
            <h3 className="dark:text-white">Laboratory Address</h3>
            <p className="dark:text-gray-300">
              <i className="fas fa-map-marker-alt dark:text-blue-400"></i>
              Department of Computer Science
              <br />
              University Campus
              <br />
              City, Country
            </p>
          </div>

          <div className="info-section">
            <h3 className="dark:text-white">Contact Information</h3>
            <p className="dark:text-gray-300">
              <i className="fas fa-phone dark:text-blue-400"></i>
              +1 234 567 890
            </p>
            <p className="dark:text-gray-300">
              <i className="fas fa-envelope dark:text-blue-400"></i>
              research@laboratory.edu
            </p>
          </div>

          <div className="info-section">
            <h3 className="dark:text-white">Office Hours</h3>
            <p className="dark:text-gray-300">
              <i className="fas fa-clock dark:text-blue-400"></i>
              Monday - Friday: 9:00 AM - 5:00 PM
            </p>
          </div>

          <div className="social-links">
            <a
              href="#"
              className="social-link dark:bg-gray-600 dark:text-blue-400 dark:hover:bg-gray-500"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="social-link dark:bg-gray-600 dark:text-blue-400 dark:hover:bg-gray-500"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="#"
              className="social-link dark:bg-gray-600 dark:text-blue-400 dark:hover:bg-gray-500"
            >
              <i className="fab fa-researchgate"></i>
            </a>
          </div>
        </div>

        <div className="contact-form dark:bg-gray-700 dark:border-gray-600">
          <h2 className="dark:text-white">Send us a Message</h2>
          {submitStatus && (
            <div
              className={`status-message ${submitStatus.success ? "success" : "error"}`}
            >
              {submitStatus.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="dark:text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="dark:text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
                className="dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="dark:text-white">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Message subject"
                required
                className="dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="dark:text-white">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                required
                rows={6}
                className="dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="submit-button dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
