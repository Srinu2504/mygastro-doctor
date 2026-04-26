document.addEventListener('DOMContentLoaded', () => {
    const emailSection = document.getElementById('email-section');
    const successSection = document.getElementById('successMessage');
    const sendLinkBtn = document.getElementById('sendLinkBtn');
    const emailInput = document.getElementById('email');
    const errorMsg = document.getElementById('email-error');
    const spinner = document.getElementById('email-spinner');

    if (sendLinkBtn) {
        sendLinkBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (!email || !email.includes('@')) {
                errorMsg.textContent = "Please enter a valid email address.";
                errorMsg.style.display = 'block';
                return;
            }

            errorMsg.style.display = 'none';
            spinner.style.display = 'inline-block';
            sendLinkBtn.disabled = true;

            // Simulate email link sent (Backend removed)
            setTimeout(() => {
                spinner.style.display = 'none';
                emailSection.style.display = 'none';
                successSection.style.display = 'block';
                
                console.log("Mock: Email link sent to " + email);
                // For demo/UI testing purposes, we can add a link to skip to profile or register
                const mockLink = document.createElement('p');
                mockLink.innerHTML = `
                    <div style="margin-top:2rem; padding:1rem; border:1px dashed var(--border); border-radius:8px; font-size:0.85rem;">
                        <p style="margin-bottom:0.5rem; color:var(--muted);">[MOCK NAVIGATION - FIREBASE REMOVED]</p>
                        <a href="register.html" class="btn btn-ghost" style="font-size:0.8rem;">Go to Registration (New Doctor)</a>
                        <a href="profile.html" class="btn btn-ghost" style="font-size:0.8rem;">Go to Profile (Existing Doctor)</a>
                    </div>
                `;
                successSection.appendChild(mockLink);
            }, 800);
        });
    }
});
