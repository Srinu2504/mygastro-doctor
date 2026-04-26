let currentStep = 1;
const totalSteps = 5;

// Registration State Cache
const docData = {
    photoFile: null,
    photoChanged: false,
    certFile: null
};

document.addEventListener('DOMContentLoaded', () => {
    // Backend removed: skipping Auth check. 
    // Fill debug email if not present
    const emailInput = document.getElementById('email');
    if (emailInput && !emailInput.value) emailInput.value = "doctor@example.com";

    initNavigation();
    initAvatar();
    initCertificate();
    initChips();
    initDynamicLists();
    initValidationListeners();
    initBioCounter();

    // Initial rows
    addDegreeRow();
    addExperienceRow();
});

function initBioCounter() {
    const bio = document.getElementById('bio');
    const bioCount = document.getElementById('bioCount');
    if (bio && bioCount) {
        bio.addEventListener('input', () => {
            bioCount.textContent = `${bio.value.length}/500`;
        });
    }
}

function initNavigation() {
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');

    btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (!validateStep(currentStep)) return;
            currentStep++;
            if (currentStep === totalSteps) populateReview();
            updateUI();
        } else {
            document.getElementById('confirmModal').style.display = 'flex';
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    document.getElementById('btnCancelSubmit').addEventListener('click', () => {
        document.getElementById('confirmModal').style.display = 'none';
    });

    document.getElementById('btnConfirmSubmit').addEventListener('click', () => {
        document.getElementById('confirmModal').style.display = 'none';
        btnNext.textContent = "Saving Profile...";
        btnNext.disabled = true;
        
        // Mock submission
        setTimeout(() => {
            console.log("Mock: Profile submitted successfully (Firebase Removed)");
            window.location.href = 'profile.html';
        }, 1000);
    });
}

function updateUI() {
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    btnNext.textContent = currentStep === totalSteps ? 'Finalize & Submit' : `Continue to Step ${currentStep + 1}`;

    document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`step-${currentStep}`).classList.add('active');

    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((ind, index) => {
        const stepNum = index + 1;
        ind.className = 'step-indicator';
        if (stepNum === currentStep) ind.classList.add('active');
        if (stepNum < currentStep) ind.classList.add('completed');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ------------------- VALIDATION -------------------

function initValidationListeners() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    });
}

function validateField(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let customMsg = "";

    if (input.required && !input.value.trim()) {
        isValid = false;
    } else if (input.type === 'email' && input.value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(input.value)) {
            isValid = false;
            customMsg = "Please enter a valid email address";
        }
    } else if (input.id === 'license' && input.value) {
        if (input.value.length < 5) {
            isValid = false;
            customMsg = "License number seems too short";
        }
    } else if (input.id === 'bio' && input.value) {
        if (input.value.length < 10) {
            isValid = false;
        }
    }

    if (isValid) {
        input.classList.remove('invalid');
        if (errorEl) {
            errorEl.style.display = 'none';
            if (customMsg) errorEl.textContent = customMsg;
        }
    } else {
        input.classList.add('invalid');
        if (errorEl) {
            if (customMsg) errorEl.textContent = customMsg;
            errorEl.style.display = 'block';
        }
    }
    return isValid;
}

function validateStep(step) {
    let stepValid = true;
    const currentCard = document.getElementById(`step-${step}`);
    const inputs = currentCard.querySelectorAll('[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) stepValid = false;
    });

    if (step === 1) {
        const cert = document.getElementById('fileCertificate');
        if (!cert.files[0]) {
            showError('fileCertificate', "Certificate is required");
            stepValid = false;
        } else {
            const file = cert.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showError('fileCertificate', "File size must be less than 5MB");
                stepValid = false;
            }
        }
    }

    if (step === 2) {
        const degrees = document.querySelectorAll('#degreesList .dynamic-item');
        if (degrees.length === 0) {
            document.getElementById('degrees-error').style.display = 'block';
            stepValid = false;
        } else {
            document.getElementById('degrees-error').style.display = 'none';
            // Validate dynamic inputs
            degrees.forEach(item => {
                const d = item.querySelector('.d-degree');
                const i = item.querySelector('.d-inst');
                if (!d.value.trim()) { d.classList.add('invalid'); stepValid = false; }
                if (!i.value.trim()) { i.classList.add('invalid'); stepValid = false; }
            });
        }
    }

    if (step === 4) {
        const exp = document.querySelectorAll('#experienceList .dynamic-item');
        if (exp.length === 0) {
            document.getElementById('experience-error').style.display = 'block';
            stepValid = false;
        } else {
            document.getElementById('experience-error').style.display = 'none';
            exp.forEach(item => {
                const t = item.querySelector('.e-title');
                const o = item.querySelector('.e-org');
                const s = item.querySelector('.e-start');
                const e = item.querySelector('.e-end');
                
                if (!t.value.trim()) { t.classList.add('invalid'); stepValid = false; }
                if (!o.value.trim()) { o.classList.add('invalid'); stepValid = false; }
                if (!s.value) { s.classList.add('invalid'); stepValid = false; }
                
                if (s.value && e.value && parseInt(s.value) > parseInt(e.value)) {
                    e.classList.add('invalid');
                    alert("Start year cannot be after end year.");
                    stepValid = false;
                }
            });
        }
    }

    return stepValid;
}

function showError(id, msg) {
    const el = document.getElementById(`${id}-error`);
    const input = document.getElementById(id);
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
    }
    if (input) input.classList.add('invalid');
}

// ------------------- LOGIC -------------------

function initAvatar() {
    const fName = document.getElementById('firstName');
    const lName = document.getElementById('lastName');
    const initialsEl = document.getElementById('avatarInitials');
    const updateInitials = () => {
        if (!docData.photoFile && !docData.photoChanged) {
            const f = fName.value.trim().charAt(0).toUpperCase();
            const l = lName.value.trim().charAt(0).toUpperCase();
            initialsEl.textContent = (f || l) ? (f + l) : 'DR';
        }
    };
    fName.addEventListener('input', updateInitials);
    lName.addEventListener('input', updateInitials);

    const filePhoto = document.getElementById('filePhoto');
    const avatarImg = document.getElementById('avatarImage');
    const btnRemove = document.getElementById('btnRemovePhoto');

    filePhoto.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("Avatar image should be less than 2MB");
                filePhoto.value = "";
                return;
            }
            docData.photoFile = file;
            docData.photoChanged = true;
            avatarImg.src = URL.createObjectURL(file);
            avatarImg.style.display = 'block';
            initialsEl.style.display = 'none';
            btnRemove.style.display = 'inline-block';
        }
    });

    btnRemove.addEventListener('click', () => {
        docData.photoFile = null;
        docData.photoChanged = false;
        avatarImg.src = "";
        avatarImg.style.display = 'none';
        initialsEl.style.display = 'block';
        btnRemove.style.display = 'none';
        filePhoto.value = "";
        updateInitials();
    });
}

function initCertificate() {
    const certInput = document.getElementById('fileCertificate');
    certInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            docData.certFile = e.target.files[0];
            validateField(certInput);
        }
    });
}

function initChips() {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
        });
    });
}

function initDynamicLists() {
    document.getElementById('btnAddDegree').addEventListener('click', addDegreeRow);
    document.getElementById('btnAddFellowship').addEventListener('click', addFellowshipRow);
    document.getElementById('btnAddExperience').addEventListener('click', addExperienceRow);
}

function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    let opts = '<option value="">Year</option>';
    for (let y = currentYear; y >= 1960; y--) {
        opts += `<option value="${y}">${y}</option>`;
    }
    return opts;
}

function addDegreeRow() {
    const list = document.getElementById('degreesList');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="form-row" style="margin-bottom:0;">
        <div class="form-group"><input type="text" class="d-degree" placeholder="Degree (e.g. MBBS)" required></div>
        <div class="form-group"><input type="text" class="d-inst" placeholder="Institution" required></div>
      </div>
      <div class="form-row" style="margin-bottom:0; margin-top:1rem;">
        <div class="form-group"><select class="d-year">${generateYearOptions()}</select></div>
        <div class="form-group"><input type="text" class="d-loc" placeholder="Location"></div>
      </div>
      ${list.children.length > 0 ? `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>` : ''}
    `;
    list.appendChild(div);
}

function addFellowshipRow() {
    const list = document.getElementById('fellowshipsList');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="form-row" style="margin-bottom:0;">
        <div class="form-group full"><input type="text" class="f-name" placeholder="Fellowship Topic/Name"></div>
      </div>
      <div class="form-row" style="margin-bottom:0; margin-top:1rem;">
        <div class="form-group"><input type="text" class="f-inst" placeholder="Institution"></div>
        <div class="form-group"><select class="f-year">${generateYearOptions()}</select></div>
      </div>
      <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    list.appendChild(div);
}

function addExperienceRow() {
    const list = document.getElementById('experienceList');
    const warn = document.getElementById('expWarning');

    const ends = list.querySelectorAll('.e-end');
    let hasCurrent = false;
    ends.forEach(e => { if (!e.value) hasCurrent = true; });
    if (hasCurrent && list.children.length > 0) {
        warn.style.display = 'block';
        return;
    }
    warn.style.display = 'none';

    const div = document.createElement('div');
    div.className = 'dynamic-item exp-item';
    div.innerHTML = `
      <div class="form-row" style="margin-bottom:0;">
        <div class="form-group"><input type="text" class="e-title" placeholder="Job Title" required></div>
        <div class="form-group"><input type="text" class="e-org" placeholder="Organization" required></div>
      </div>
      <div class="form-row" style="margin-bottom:0; margin-top:1rem;">
        <div class="form-group"><select class="e-start calc-trigger" required>${generateYearOptions()}</select></div>
        <div class="form-group"><select class="e-end calc-trigger">${generateYearOptions()}</select>
        <span style="font-size:0.75rem; color:var(--muted);">Leave blank for Current</span></div>
      </div>
      ${list.children.length > 0 ? `<button type="button" class="remove-btn" onclick="this.parentElement.remove(); calcYears();">Remove</button>` : ''}
    `;
    list.appendChild(div);
    div.querySelectorAll('.calc-trigger').forEach(el => el.addEventListener('change', calcYears));
}

function calcYears() {
    let minStart = new Date().getFullYear();
    let maxEnd = new Date().getFullYear();
    let hasValid = false;

    document.querySelectorAll('.exp-item').forEach(item => {
        const s = parseInt(item.querySelector('.e-start').value);
        let e = parseInt(item.querySelector('.e-end').value);
        if (!e) e = new Date().getFullYear();
        if (s) {
            hasValid = true;
            if (s < minStart) minStart = s;
        }
    });

    const yrBox = document.getElementById('totalYears');
    if (!hasValid) {
        yrBox.value = "0 Years";
    } else {
        let total = maxEnd - minStart;
        if (total < 1) total = 1;
        yrBox.value = `${total} Years`;
    }
}

// ------------------- REVIEW -------------------

function populateReview() {
    const rc = document.getElementById('reviewContainer');
    rc.innerHTML = '';
    const d = collectFormData();

    const blocks = [
        {
            title: "1. Personal Information",
            step: 1,
            html: `
              <div class="review-grid">
                <div><div class="review-label">Full Name</div><div>${d.prefix} ${d.firstName} ${d.lastName}</div></div>
                <div><div class="review-label">Contact</div><div>${d.email}${d.phone ? '<br>' + d.phone : ''}</div></div>
                <div><div class="review-label">Medical License</div><div>${d.licenseNumber}</div></div>
                <div><div class="review-label">Gender / Lang</div><div>${d.gender || 'N/A'} | ${d.languages.join(', ')}</div></div>
              </div>
              <div style="margin-top:1rem;"><div class="review-label">Bio</div><div style="font-size:0.9rem;">${d.bio}</div></div>
            `
        },
        {
            title: "2. Qualifications", step: 2,
            html: `
              <div class="review-label">Degrees</div>
              <ul style="margin:0 0 1rem; padding-left:1.2rem;">
                ${d.qualifications.degrees.map(deg => `<li>${deg.degree}, ${deg.institution} (${deg.year || 'N/A'}) - ${deg.location || 'N/A'}</li>`).join('')}
              </ul>
              ${d.qualifications.fellowships.length > 0 ? `
                <div class="review-label">Fellowships</div>
                <ul style="margin:0; padding-left:1.2rem;">
                  ${d.qualifications.fellowships.map(f => `<li>${f.name}, ${f.institution} (${f.year || 'N/A'})</li>`).join('')}
                </ul>
              ` : ''}
            `
        },
        {
            title: "3. Specialisation & Consultation", step: 3,
            html: `
              <div class="review-grid">
                <div style="grid-column: span 2;"><div class="review-label">Primary Speciality</div><div>${d.specialization.primarySpeciality}</div></div>
                <div><div class="review-label">Consultation Fee</div><div>${d.consultation.fee}</div></div>
                <div><div class="review-label">Availability</div><div>${d.consultation.availability}</div></div>
                <div style="grid-column: span 2;"><div class="review-label">Expertise</div><div>${d.areasOfExpertise.conditions.join(', ') || 'None'}</div></div>
              </div>
            `
        },
        {
            title: "4. Experience & Practice", step: 4,
            html: `
              <div class="review-grid" style="margin-bottom:1rem;">
                <div><div class="review-label">Clinic Name</div><div>${d.practice.clinicName}</div></div>
                <div><div class="review-label">City</div><div>${d.practice.city}</div></div>
              </div>
              <div class="review-label">Career History (Total: ${d.experience.yearsOfExperience} yrs)</div>
              <ul style="margin:0; padding-left:1.2rem;">
                ${d.experience.careerHistory.map(h => `<li>${h.title} at ${h.organization} (${h.startYear} - ${h.endYear})</li>`).join('')}
              </ul>
            `
        }
    ];

    blocks.forEach(b => {
        const div = document.createElement('div');
        div.className = 'review-block';
        div.innerHTML = `
            <div class="review-header">
                <h3>${b.title}</h3>
                <span class="review-edit" onclick="window.goToStep(${b.step})">Edit</span>
            </div>
            <div class="review-content">${b.html}</div>
        `;
        rc.appendChild(div);
    });
}

window.goToStep = (step) => {
    currentStep = step;
    updateUI();
};

function collectFormData() {
    const checkedLangs = Array.from(document.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value);
    if (!checkedLangs.includes("English")) checkedLangs.unshift("English");

    const degrees = Array.from(document.querySelectorAll('#degreesList .dynamic-item')).map(item => ({
        degree: item.querySelector('.d-degree').value.trim(),
        institution: item.querySelector('.d-inst').value.trim(),
        year: item.querySelector('.d-year').value,
        location: item.querySelector('.d-loc').value.trim()
    })).filter(d => d.degree && d.institution);

    const fellowships = Array.from(document.querySelectorAll('#fellowshipsList .dynamic-item')).map(item => ({
        name: item.querySelector('.f-name').value.trim(),
        institution: item.querySelector('.f-inst').value.trim(),
        year: item.querySelector('.f-year').value
    })).filter(f => f.name);

    const careerHistory = Array.from(document.querySelectorAll('#experienceList .dynamic-item')).map(item => ({
        title: item.querySelector('.e-title').value.trim(),
        organization: item.querySelector('.e-org').value.trim(),
        startYear: item.querySelector('.e-start').value,
        endYear: item.querySelector('.e-end').value || "Present"
    })).filter(h => h.title && h.organization);

    return {
        prefix: document.getElementById('prefix').value,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        gender: document.getElementById('gender').value,
        licenseNumber: document.getElementById('license').value.trim(),
        bio: document.getElementById('bio').value.trim(),
        languages: checkedLangs,
        qualifications: { degrees, fellowships },
        specialization: {
            primarySpeciality: document.getElementById('primarySpeciality').value,
            subSpecialities: Array.from(document.querySelectorAll('#subspecialtiesBox .chip.selected')).map(c => c.getAttribute('data-val'))
        },
        areasOfExpertise: {
            conditions: Array.from(document.querySelectorAll('#conditionsBox .chip.selected')).map(c => c.getAttribute('data-val')),
            procedures: Array.from(document.querySelectorAll('#proceduresBox .chip.selected')).map(c => c.getAttribute('data-val'))
        },
        practice: {
            clinicName: document.getElementById('clinicName').value.trim(),
            city: document.getElementById('city').value.trim()
        },
        consultation: {
            fee: document.getElementById('consultationFee').value.trim(),
            availability: document.getElementById('availability').value.trim()
        },
        experience: {
            yearsOfExperience: parseInt(document.getElementById('totalYears').value) || 0,
            careerHistory
        }
    };
}
