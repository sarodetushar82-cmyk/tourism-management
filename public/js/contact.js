/**
 * Contact Us Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please provide your name, email address, and inquiry message.', 'error');
      return;
    }

    const submitBtn = document.getElementById('contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';

    try {
      const res = await apiRequest('/api/contact', 'POST', {
        name,
        email,
        phone,
        subject: subject || 'General Tour Inquiry',
        message
      });

      showToast(res.message, 'success');
      contactForm.reset();

      const successBox = document.getElementById('contact-success-alert');
      if (successBox) {
        successBox.style.display = 'block';
        setTimeout(() => {
          successBox.style.display = 'none';
        }, 5000);
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit your message. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
