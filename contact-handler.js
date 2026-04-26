// contact-handler.js
// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'DGeIcEQcKgYOe4xLu';
const EMAILJS_SERVICE_ID = 'service_tgytz9c';
const EMAILJS_TEMPLATE_ID = 'template_k6k7jhc';
const RECIPIENT_EMAIL = 'xmk9854@gmail.com';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const toast = document.getElementById('toast');

  // Utility functions
  const showToast = (text, timeout = 3500) => {
    toast.textContent = text;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, timeout);
  };

  const setStatus = (text, isError = false) => {
    statusEl.textContent = text;
    statusEl.style.color = isError ? '#b00020' : '#118c4f';
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', false);

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();
    const honeypot = form.querySelector('#website').value.trim();

    // Honeypot check for bots
    if (honeypot) return;

    // Validation
    if (!name || !email || !message) {
      setStatus('Vui lòng điền đầy đủ tên, email và nội dung.', true);
      return;
    }
    if (!validateEmail(email)) {
      setStatus('Email không hợp lệ.', true);
      return;
    }
    if (message.length > 5000) {
      setStatus('Nội dung quá dài.', true);
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span>Đang gửi...';

    try {
      // Prepare template parameters
      const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone || 'N/A',
        subject: subject || 'No subject',
        message: message,
        reply_to: email,
        to_email: RECIPIENT_EMAIL
      };

      // Send email via EmailJS
      const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      if (result.status === 200) {
        // Success
        setStatus('Gửi thành công! Cảm ơn bạn.', false);
        showToast('Gửi thành công!');
        form.reset();
      } else {
        throw new Error('EmailJS submission failed');
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      const errorMessage = err.text || 'Không thể gửi email';
      setStatus('Lỗi kết nối. Vui lòng thử lại sau.', true);
      showToast(`Lỗi: ${errorMessage}`, 5000);
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  });
})();