const docData = {
    photoFile: null,
    photoChanged: false,
    certFile: null,
    existingPhotoUrl: "",
    existingCertUrl: ""
};

document.addEventListener('DOMContentLoaded', () => {
    // Backend removed: simulating data fetch
    const mockUid = "MOCK_UID_123";
    loadProfileData(mockUid);

    initFormEvents();
    initValidationListeners();
    initBioCounter();
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

function loadProfileData(uid) {
    // Mock Profile Data (Backend Removed)
    const mockData = {
        prefix: "Dr.",
        firstName: "Suresh",
        lastName: "P",
        email: "suresh.p@example.com",
        phone: "+91 98765 43210",
        licenseNumber: "MD-882299",
        bio: "Specialist Gastroenterologist with over 15 years of experience in advanced endoscopy and liver care. Committed to providing compassionate, evidence-based care to all patients.",
        languages: ["English", "Hindi", "Telugu"],
        photoUrl: "",
        qualifications: {
            degrees: [
                { degree: "MBBS", institution: "AIIMS New Delhi", year: "2010", location: "India" },
                { degree: "MD (Gastroenterology)", institution: "PGI Chandigarh", year: "2014", location: "India" }
            ],
            fellowships: [
                { name: "Advanced Endoscopy", institution: "Mayo Clinic", year: "2016" }
            ]
        },
        specialization: {
            primarySpeciality: "Interventional Endoscopy",
            subSpecialities: ["Therapeutic Endoscopy", "Hepatology", "GI Oncology"]
        },
        areasOfExpertise: {
            conditions: ["Acid Reflux (GERD)", "Liver Cirrhosis", "Crohn's Disease"],
            procedures: ["Upper Endoscopy", "Colonoscopy", "ERCP"]
        },
        practice: {
            clinicName: "Apollo Hospitals",
            city: "Hyderabad"
        },
        consultation: {
            fee: "₹1000",
            availability: "Mon-Sat, 9am-5pm"
        },
        experience: {
            yearsOfExperience: 15,
            careerHistory: [
                { title: "Senior Consultant", organization: "Apollo Hospitals", startYear: "2018", endYear: "Present" },
                { title: "Gastroenterologist", organization: "Global Health", startYear: "2014", endYear: "2018" }
            ]
        }
    };

    setTimeout(() => {
        fillForm(mockData);
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('editFormWrap').style.opacity = '1';
    }, 500);
}

function fillForm(data) {
    document.getElementById('prefix').value = data.prefix || "Dr.";
    document.getElementById('firstName').value = data.firstName || "";
    document.getElementById('lastName').value = data.lastName || "";
    document.getElementById('email').value = data.email || "";
    document.getElementById('phone').value = data.phone || "";
    document.getElementById('gender').value = data.gender || "Male";
    document.getElementById('license').value = data.licenseNumber || "";
    document.getElementById('bio').value = data.bio || "";
    document.getElementById('bioCount').textContent = `${(data.bio || "").length}/500`;
    
    // Photo
    if (data.photoUrl) {
        docData.existingPhotoUrl = data.photoUrl;
        const img = document.getElementById('avatarImage');
        img.src = data.photoUrl;
        img.style.display = 'block';
        document.getElementById('avatarInitials').style.display = 'none';
        document.getElementById('btnRemovePhoto').style.display = 'inline-block';
    }

    // Languages
    if (data.languages) {
        data.languages.forEach(lang => {
            const cb = document.querySelector(`input[name="languages"][value="${lang}"]`);
            if (cb) cb.checked = true;
        });
    }

    // Qualifications
    const q = data.qualifications || {};
    if (q.degrees) q.degrees.forEach(deg => addDegreeRow(deg));
    if (q.fellowships) q.fellowships.forEach(fel => addFellowshipRow(fel));

    // Specialisation
    const s = data.specialization || {};
    document.getElementById('primarySpeciality').value = s.primarySpeciality || "General Gastroenterology";
    if (s.subSpecialities) {
        s.subSpecialities.forEach(val => {
            const chip = document.querySelector(`#subspecialtiesBox .chip[data-val="${val}"]`);
            if (chip) chip.classList.add('selected');
        });
    }

    // Expertise
    const exp = data.areasOfExpertise || {};
    if (exp.conditions) {
        exp.conditions.forEach(val => {
            const chip = document.querySelector(`#conditionsBox .chip[data-val="${val}"]`);
            if (chip) chip.classList.add('selected');
        });
    }
    if (exp.procedures) {
        exp.procedures.forEach(val => {
            const chip = document.querySelector(`#proceduresBox .chip[data-val="${val}"]`);
            if (chip) chip.classList.add('selected');
        });
    }

    // Consultation
    const con = data.consultation || {};
    document.getElementById('consultationFee').value = con.fee || "";
    document.getElementById('availability').value = con.availability || "";

    // Experience
    const practice = data.practice || {};
    document.getElementById('clinicName').value = practice.clinicName || "";
    document.getElementById('city').value = practice.city || "";

    const history = data.experience || {};
    if (history.careerHistory) history.careerHistory.forEach(h => addExperienceRow(h));
    calcYears();
}

// ------------------- EVENT HANDLERS -------------------

function initFormEvents() {
    document.getElementById('filePhoto').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            docData.photoFile = file;
            docData.photoChanged = true;
            const img = document.getElementById('avatarImage');
            img.src = URL.createObjectURL(file);
            img.style.display = 'block';
            document.getElementById('avatarInitials').style.display = 'none';
            document.getElementById('btnRemovePhoto').style.display = 'inline-block';
        }
    });

    document.getElementById('btnRemovePhoto').addEventListener('click', () => {
        docData.photoFile = null;
        docData.photoChanged = true;
        docData.existingPhotoUrl = "";
        document.getElementById('avatarImage').style.display = 'none';
        document.getElementById('avatarInitials').style.display = 'flex';
        document.getElementById('btnRemovePhoto').style.display = 'none';
    });

    document.getElementById('fileCertificate').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            docData.certFile = e.target.files[0];
            validateField(e.target);
        }
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => chip.classList.toggle('selected'));
    });

    document.getElementById('btnAddDegree').addEventListener('click', () => addDegreeRow());
    document.getElementById('btnAddFellowship').addEventListener('click', () => addFellowshipRow());
    document.getElementById('btnAddExperience').addEventListener('click', () => addExperienceRow());

    document.getElementById('btnSaveTop').addEventListener('click', handleSave);
    document.getElementById('btnSaveBottom').addEventListener('click', handleSave);
}

// ------------------- DYNAMIC ROWS -------------------

function generateYearOptions(selected) {
    const currentYear = new Date().getFullYear();
    let opts = '<option value="">Year</option>';
    for (let y = currentYear; y >= 1960; y--) {
        opts += `<option value="${y}" ${selected == y ? 'selected' : ''}>${y}</option>`;
    }
    return opts;
}

function addDegreeRow(data = {}) {
    const list = document.getElementById('degreesList');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="form-row" style="margin-bottom:0;">
        <div class="form-group"><input type="text" class="d-degree" placeholder="Degree" value="${data.degree || ''}" required></div>
        <div class="form-group"><input type="text" class="d-inst" placeholder="Institution" value="${data.institution || ''}" required></div>
      </div>
      <div class="form-row" style="margin-bottom:0; margin-top:1rem;">
        <div class="form-group"><select class="d-year">${generateYearOptions(data.year)}</select></div>
        <div class="form-group"><input type="text" class="d-loc" placeholder="Location" value="${data.location || ''}"></div>
      </div>
      <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    list.appendChild(div);
}

function addFellowshipRow(data = {}) {
    const list = document.getElementById('fellowshipsList');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="form-row" style="margin-bottom:0;">
        <div class="form-group full"><input type="text" class="f-name" placeholder="Fellowship Name" value="${data.name || ''}"></div>
      </div>
      <div class="form-row" style="margin-bottom:0; margin-top:1rem;">
        <div class="form-group"><input type="text" class="f-inst" placeholder="Institution" value="${data.institution || ''}"></div>
        <div class="form-group"><select class="f-year">${generateYearOptions(data.year)}</select></div>
      </div>
      <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    list.appendChild(div);
}

function addExperienceRow(data = {}) {
    const list = document.getElementById('experienceList');
    const div = document.createElement('div');
    div.className = 'dynamic-item exp-item';
    div.innerHTML = `
      <div class="form-row" style="margin-bottom:0;">
        <div class="form-group"><input type="text" class="e-title" placeholder="Job Title" value="${data.title || ''}" required></div>
        <div class="form-group"><input type="text" class="e-org" placeholder="Organization" value="${data.organization || ''}" required></div>
      </div>
      <div class="form-row" style="margin-bottom:0; margin-top:1rem;">
        <div class="form-group"><select class="e-start calc-trigger" required>${generateYearOptions(data.startYear)}</select></div>
        <div class="form-group"><select class="e-end calc-trigger">${generateYearOptions(data.endYear === 'Present' ? '' : data.endYear)}</select></div>
      </div>
      <button type="button" class="remove-btn" onclick="this.parentElement.remove(); calcYears();">Remove</button>
    `;
    list.appendChild(div);
    div.querySelectorAll('.calc-trigger').forEach(el => el.addEventListener('change', calcYears));
}

function calcYears() {
    let minStart = new Date().getFullYear();
    let hasValid = false;
    document.querySelectorAll('.exp-item').forEach(item => {
        const s = parseInt(item.querySelector('.e-start').value);
        if (s) {
            hasValid = true;
            if (s < minStart) minStart = s;
        }
    });
    const yrBox = document.getElementById('totalYears');
    yrBox.value = hasValid ? `${new Date().getFullYear() - minStart} Years` : "0 Years";
}

// ------------------- VALIDATION -------------------

function initValidationListeners() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
}

function validateField(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    let isValid = true;
    if (input.required && !input.value.trim()) isValid = false;
    if (input.id === 'bio' && input.value.length < 10) isValid = false;
    if (input.id === 'fileCertificate' && input.files[0] && input.files[0].size > 5 * 1024 * 1024) isValid = false;

    if (isValid) {
        input.classList.remove('invalid');
        if (errorEl) errorEl.style.display = 'none';
    } else {
        input.classList.add('invalid');
        if (errorEl) errorEl.style.display = 'block';
    }
    return isValid;
}

function validateAll() {
    let allValid = true;
    const required = document.querySelectorAll('[required]');
    required.forEach(input => { if (!validateField(input)) allValid = false; });

    const degrees = document.querySelectorAll('#degreesList .dynamic-item');
    if (degrees.length === 0) {
        document.getElementById('degrees-error').style.display = 'block';
        allValid = false;
    } else {
        document.getElementById('degrees-error').style.display = 'none';
    }

    const exp = document.querySelectorAll('#experienceList .dynamic-item');
    if (exp.length === 0) {
        document.getElementById('experience-error').style.display = 'block';
        allValid = false;
    } else {
        document.getElementById('experience-error').style.display = 'none';
    }

    return allValid;
}

// ------------------- SAVE -------------------

function handleSave() {
    if (!validateAll()) {
        alert("Please fix validation errors before saving.");
        return;
    }

    const btn = document.getElementById('btnSaveBottom');
    btn.disabled = true;
    btn.textContent = "Saving...";

    // Mock Save (Backend Removed)
    setTimeout(() => {
        console.log("Mock: Profile updated successfully (Firebase Removed)");
        const toast = document.getElementById('successToast');
        if (toast) toast.classList.add('show');
        setTimeout(() => window.location.href = 'profile.html', 1500);
    }, 1000);
}

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
