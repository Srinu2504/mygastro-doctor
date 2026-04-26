document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loading-state');
    const content = document.getElementById('profile-content');
    const btnLogout = document.getElementById('btnLogout');

    btnLogout.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

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
        experience: {
            yearsOfExperience: 15,
            careerHistory: [
                { title: "Senior Consultant", organization: "Apollo Hospitals", startYear: "2018", endYear: "Present" },
                { title: "Gastroenterologist", organization: "Global Health", startYear: "2014", endYear: "2018" }
            ]
        }
    };

    // Simulate loading
    setTimeout(() => {
        populateHeader(mockData);
        populateExperience(mockData);
        populateQualifications(mockData);
        populateExpertise(mockData);

        loader.style.display = 'none';
        content.style.display = 'block';
        content.classList.add('visible');
        btnLogout.style.display = 'inline-block';
    }, 500);

    function populateHeader(data) {
        document.getElementById('profName').textContent = `${data.prefix || ''} ${data.firstName} ${data.lastName}`;
        document.getElementById('profPrimarySpec').textContent = data.specialization?.primarySpeciality || 'Gastroenterologist';

        document.getElementById('profLicense').textContent = data.licenseNumber || 'Not provided';
        document.getElementById('profPhone').textContent = data.phone || 'N/A';
        document.getElementById('profEmail').textContent = data.email || 'N/A';
        document.getElementById('profLangs').textContent = data.languages ? data.languages.join(', ') : 'English';

        const initialsEl = document.getElementById('profInitials');
        const photoEl = document.getElementById('profPhoto');

        if (data.photoUrl) {
            photoEl.src = data.photoUrl;
            photoEl.style.display = 'block';
            initialsEl.style.display = 'none';
        } else {
            const f = data.firstName ? data.firstName.charAt(0).toUpperCase() : '';
            const l = data.lastName ? data.lastName.charAt(0).toUpperCase() : '';
            initialsEl.textContent = (f || l) ? (f + l) : 'DR';
            photoEl.style.display = 'none';
            initialsEl.style.display = 'inline';
        }
    }

    function populateExperience(data) {
        const exp = data.experience || {};
        document.getElementById('profExpYears').textContent = `${exp.yearsOfExperience || 0} Years`;

        const cList = document.getElementById('profCareerList');
        cList.innerHTML = '';
        if (exp.careerHistory && exp.careerHistory.length > 0) {
            exp.careerHistory.forEach(item => {
                const text = typeof item === 'object' 
                    ? `<strong>${item.title}</strong> at ${item.organization} (${item.startYear} - ${item.endYear})`
                    : item;
                cList.innerHTML += `<li>${text}</li>`;
            });
        } else {
            cList.innerHTML = `<li style="color:var(--muted); list-style:none; padding:0;">No history recorded</li>`;
        }
    }

    function populateQualifications(data) {
        const q = data.qualifications || {};
        const dList = document.getElementById('profDegreesList');
        const fList = document.getElementById('profFellowshipsList');

        dList.innerHTML = '';
        if (q.degrees && q.degrees.length > 0) {
            q.degrees.forEach(item => {
                const text = typeof item === 'object'
                    ? `<strong>${item.degree}</strong>, ${item.institution} (${item.year}) - ${item.location || 'N/A'}`
                    : item;
                dList.innerHTML += `<li>${text}</li>`;
            });
        } else {
            dList.innerHTML = `<li style="color:var(--muted); list-style:none; padding:0;">Not provided</li>`;
        }

        fList.innerHTML = '';
        if (q.fellowships && q.fellowships.length > 0) {
            q.fellowships.forEach(item => {
                const text = typeof item === 'object'
                    ? `<strong>${item.name}</strong>, ${item.institution} (${item.year})`
                    : item;
                fList.innerHTML += `<li>${text}</li>`;
            });
        } else {
            fList.innerHTML = `<li style="color:var(--muted); list-style:none; padding:0;">No fellowships recorded</li>`;
        }
    }

    function populateExpertise(data) {
        const subs = data.specialization?.subSpecialities || [];
        const sWrap = document.getElementById('profSubSpecsWrap');
        if (subs.length > 0) {
            sWrap.innerHTML = subs.map(s => `<span class="profile-chip">${s}</span>`).join('');
            document.getElementById('profNoSub').style.display = 'none';
        } else {
            sWrap.innerHTML = '';
            document.getElementById('profNoSub').style.display = 'block';
        }

        const expert = data.areasOfExpertise || {};
        const cWrap = document.getElementById('profConditionsWrap');
        const pWrap = document.getElementById('profProceduresWrap');
        const errExp = document.getElementById('profNoExp');

        let handled = false;

        if (expert.conditions && expert.conditions.length > 0) {
            cWrap.innerHTML = expert.conditions.map(c => `<span class="profile-chip">${c}</span>`).join('');
            handled = true;
        } else {
            cWrap.innerHTML = '<span style="font-size:0.8rem;color:var(--muted);">None listed</span>';
        }

        if (expert.procedures && expert.procedures.length > 0) {
            pWrap.innerHTML = expert.procedures.map(p => `<span class="profile-chip">${p}</span>`).join('');
            handled = true;
        } else {
            pWrap.innerHTML = '<span style="font-size:0.8rem;color:var(--muted);">None listed</span>';
        }

        if (!handled) {
            errExp.style.display = 'block';
        }
    }
});
