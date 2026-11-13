(function() {
    // DOM elements
    const form = document.getElementById('studentForm');
    const successDiv = document.getElementById('successMessage');

    // Fields
    const fullName = document.getElementById('fullName');
    const studentId = document.getElementById('studentId');
    const institutionalEmail = document.getElementById('institutionalEmail');
    const personalEmail = document.getElementById('personalEmail');
    const mobile = document.getElementById('mobile');
    const emergencyName = document.getElementById('emergencyName');
    const password = document.getElementById('password');
    const dob = document.getElementById('dob');
    const units = document.getElementById('units');
    const gpa = document.getElementById('gpa');
    const degreeSelect = document.getElementById('degreeProgram');
    const agreeTerms = document.getElementById('agreeTerms');
    const proofFile = document.getElementById('proofFile');
    const extracurricular = document.getElementById('extracurricular');

    // Radio groups
    const yearRadios = document.getElementsByName('yearLevel');
    const statusRadios = document.getElementsByName('enrollStatus');
    const labCheckboxes = document.querySelectorAll('input[name="labCourses"]');

    // Error message spans
    const errFullName = document.getElementById('error-fullName');
    const errStudentId = document.getElementById('error-studentId');
    const errInstEmail = document.getElementById('error-institutionalEmail');
    const errPersonalEmail = document.getElementById('error-personalEmail');
    const errMobile = document.getElementById('error-mobile');
    const errEmergency = document.getElementById('error-emergencyName');
    const errPassword = document.getElementById('error-password');
    const errDob = document.getElementById('error-dob');
    const errUnits = document.getElementById('error-units');
    const errGpa = document.getElementById('error-gpa');
    const errYear = document.getElementById('error-yearLevel');
    const errStatus = document.getElementById('error-enrollStatus');
    const errLab = document.getElementById('error-labCourses');
    const errAgree = document.getElementById('error-agreeTerms');
    const errDegree = document.getElementById('error-degreeProgram');
    const errProofFile = document.getElementById('error-proofFile');
    const errExtracurricular = document.getElementById('error-extracurricular');

    // Allowed MIME types & extensions for the file upload
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
    const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf'];

    // ✅ File size limit changed to 2 MB
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    // ----- SET DATE CONSTRAINTS (MIN / MAX) -----
    function setDateConstraints() {
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0];
        dob.setAttribute('max', maxDate);

        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const minDateStr = minDate.toISOString().split('T')[0];
        dob.setAttribute('min', minDateStr);
    }
    setDateConstraints();

    // ----- HELPERS -----
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
        form.querySelectorAll('input, select, textarea').forEach(input => input.classList.remove('error'));
    }

    function setError(field, message, errorSpan) {
        if (field) field.classList.add('error');
        if (errorSpan) errorSpan.textContent = message;
    }

    // ----- VALIDATION -----
    function validateForm() {
        clearErrors();
        let isValid = true;

        // 1. Full Name
        if (!fullName.value.trim()) {
            setError(fullName, 'Full name is required.', errFullName);
            isValid = false;
        } else if (fullName.value.trim().length < 2) {
            setError(fullName, 'Name must be at least 2 characters.', errFullName);
            isValid = false;
        }

        // 2. Student ID / LRN
        if (!studentId.value.trim()) {
            setError(studentId, 'Student ID / LRN is required.', errStudentId);
            isValid = false;
        } else if (studentId.value.trim().length < 4) {
            setError(studentId, 'ID must be at least 4 characters.', errStudentId);
            isValid = false;
        }

        // 3. Institutional email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!institutionalEmail.value.trim()) {
            setError(institutionalEmail, 'Institutional email is required.', errInstEmail);
            isValid = false;
        } else if (!emailRegex.test(institutionalEmail.value.trim())) {
            setError(institutionalEmail, 'Enter a valid email address.', errInstEmail);
            isValid = false;
        }

        // 4. Personal email
        if (!personalEmail.value.trim()) {
            setError(personalEmail, 'Personal email is required.', errPersonalEmail);
            isValid = false;
        } else if (!emailRegex.test(personalEmail.value.trim())) {
            setError(personalEmail, 'Enter a valid email address.', errPersonalEmail);
            isValid = false;
        }

        // 5. Mobile
        const mobileVal = mobile.value.trim();
        if (!mobileVal) {
            setError(mobile, 'Mobile number is required.', errMobile);
            isValid = false;
        } else if (!/^[0-9]{11}$/.test(mobileVal)) {
            setError(mobile, 'Must be exactly 11 digits (e.g., 09171234567).', errMobile);
            isValid = false;
        }

        // 6. Emergency Contact Name
        if (!emergencyName.value.trim()) {
            setError(emergencyName, 'Emergency contact name is required.', errEmergency);
            isValid = false;
        } else if (emergencyName.value.trim().length < 2) {
            setError(emergencyName, 'Contact name is too short.', errEmergency);
            isValid = false;
        }

        // 7. Password
        if (!password.value) {
            setError(password, 'Password is required.', errPassword);
            isValid = false;
        } else if (password.value.length < 8) {
            setError(password, 'Password must be at least 8 characters.', errPassword);
            isValid = false;
        }

        // 8. Date of Birth
        if (!dob.value) {
            setError(dob, 'Date of birth is required.', errDob);
            isValid = false;
        } else {
            const selectedDate = new Date(dob.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

            if (selectedDate > today) {
                setError(dob, 'Date of birth cannot be in the future.', errDob);
                isValid = false;
            } else if (selectedDate < minDate) {
                setError(dob, 'Date of birth cannot be more than 100 years ago.', errDob);
                isValid = false;
            }
        }

        // 9. Units
        const unitsVal = units.value.trim();
        if (!unitsVal) {
            setError(units, 'Units to enroll is required.', errUnits);
            isValid = false;
        } else {
            const numUnits = Number(unitsVal);
            if (isNaN(numUnits) || !Number.isInteger(numUnits)) {
                setError(units, 'Units must be a whole number.', errUnits);
                isValid = false;
            } else if (numUnits < 3 || numUnits > 24) {
                setError(units, 'Units must be between 3 and 24.', errUnits);
                isValid = false;
            }
        }

        // 10. GPA / GWA
        const gpaVal = gpa.value.trim();
        if (!gpaVal) {
            setError(gpa, 'GPA / GWA is required.', errGpa);
            isValid = false;
        } else {
            const numGpa = Number(gpaVal);
            if (isNaN(numGpa)) {
                setError(gpa, 'Enter a valid number.', errGpa);
                isValid = false;
            } else if (numGpa < 1.00 || numGpa > 5.00) {
                setError(gpa, 'GPA must be between 1.00 and 5.00.', errGpa);
                isValid = false;
            }
        }

        // 11. Year Level
        let yearSelected = false;
        for (let radio of yearRadios) {
            if (radio.checked) { yearSelected = true; break; }
        }
        if (!yearSelected) {
            setError(null, 'Please select your year level.', errYear);
            isValid = false;
        }

        // 12. Enrollment Status
        let statusSelected = false;
        for (let radio of statusRadios) {
            if (radio.checked) { statusSelected = true; break; }
        }
        if (!statusSelected) {
            setError(null, 'Please select enrollment status.', errStatus);
            isValid = false;
        }

        // 13. Lab Courses
        let labChecked = false;
        for (let cb of labCheckboxes) {
            if (cb.checked) { labChecked = true; break; }
        }
        if (!labChecked) {
            setError(null, 'Select at least one laboratory course.', errLab);
            isValid = false;
        }

        // 14. Agree to terms
        if (!agreeTerms.checked) {
            setError(agreeTerms, 'You must agree to the terms and honor code.', errAgree);
            isValid = false;
        }

        // 15. Degree Program
        if (!degreeSelect.value) {
            setError(degreeSelect, 'Please select a degree program.', errDegree);
            isValid = false;
        }

        // 16. File Upload — must be valid type AND ≤ 2 MB
        if (!proofFile.files || proofFile.files.length === 0) {
            setError(proofFile, 'Please upload proof of grades or a 2x2 photo.', errProofFile);
            isValid = false;
        } else {
            const file = proofFile.files[0];
            const fileName = file.name.toLowerCase();
            const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
            const hasValidType = ALLOWED_TYPES.includes(file.type);

            if (!hasValidType && !hasValidExt) {
                setError(proofFile, 'Only PNG, JPEG, or PDF files are allowed.', errProofFile);
                isValid = false;
            } else if (file.size > MAX_FILE_SIZE) {
                setError(proofFile, 'File size must not exceed 2 MB.', errProofFile);
                isValid = false;
            }
        }

        // 17. Extracurricular background / scholarship justification
        const extraVal = extracurricular.value.trim();
        if (!extraVal) {
            setError(extracurricular, 'This field is required.', errExtracurricular);
            isValid = false;
        } else if (extraVal.length < 20) {
            setError(extracurricular, 'Please provide at least 20 characters.', errExtracurricular);
            isValid = false;
        } else if (extraVal.length > 2000) {
            setError(extracurricular, 'Maximum 2000 characters allowed.', errExtracurricular);
            isValid = false;
        }

        return isValid;
    }

    // ----- REAL-TIME VALIDATION -----
    function attachLiveValidation() {
        const validateField = (field, errorSpan, validationFn) => {
            field.addEventListener('blur', function() {
                const msg = validationFn(field.value);
                if (msg) {
                    field.classList.add('error');
                    if (errorSpan) errorSpan.textContent = msg;
                } else {
                    field.classList.remove('error');
                    if (errorSpan) errorSpan.textContent = '';
                }
            });
        };

        validateField(fullName, errFullName, (val) => {
            if (!val.trim()) return 'Full name is required.';
            if (val.trim().length < 2) return 'Name must be at least 2 characters.';
            return '';
        });

        validateField(studentId, errStudentId, (val) => {
            if (!val.trim()) return 'Student ID / LRN is required.';
            if (val.trim().length < 4) return 'ID must be at least 4 characters.';
            return '';
        });

        const emailCheck = (val) => {
            if (!val.trim()) return 'Email is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Enter a valid email address.';
            return '';
        };
        validateField(institutionalEmail, errInstEmail, emailCheck);
        validateField(personalEmail, errPersonalEmail, emailCheck);

        validateField(mobile, errMobile, (val) => {
            if (!val.trim()) return 'Mobile number is required.';
            if (!/^[0-9]{11}$/.test(val.trim())) return 'Must be exactly 11 digits.';
            return '';
        });

        validateField(emergencyName, errEmergency, (val) => {
            if (!val.trim()) return 'Emergency contact name is required.';
            if (val.trim().length < 2) return 'Contact name too short.';
            return '';
        });

        validateField(password, errPassword, (val) => {
            if (!val) return 'Password is required.';
            if (val.length < 8) return 'Password must be at least 8 characters.';
            return '';
        });

        dob.addEventListener('blur', function() {
            errDob.textContent = '';
            dob.classList.remove('error');
            if (!dob.value) {
                errDob.textContent = 'Date of birth is required.';
                dob.classList.add('error');
                return;
            }
            const selected = new Date(dob.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected > today) {
                errDob.textContent = 'Date of birth cannot be in the future.';
                dob.classList.add('error');
            }
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
            if (selected < minDate) {
                errDob.textContent = 'Date cannot be more than 100 years ago.';
                dob.classList.add('error');
            }
        });

        validateField(units, errUnits, (val) => {
            if (!val.trim()) return 'Units required.';
            const n = Number(val);
            if (isNaN(n) || !Number.isInteger(n)) return 'Must be a whole number.';
            if (n < 3 || n > 24) return 'Units must be 3–24.';
            return '';
        });

        validateField(gpa, errGpa, (val) => {
            if (!val.trim()) return 'GPA / GWA is required.';
            const n = Number(val);
            if (isNaN(n)) return 'Enter a valid number.';
            if (n < 1.00 || n > 5.00) return 'GPA must be 1.00 – 5.00.';
            return '';
        });

        degreeSelect.addEventListener('change', function() {
            if (degreeSelect.value) {
                degreeSelect.classList.remove('error');
                errDegree.textContent = '';
            }
        });

        yearRadios.forEach(r => r.addEventListener('change', function() {
            if (this.checked) errYear.textContent = '';
        }));
        statusRadios.forEach(r => r.addEventListener('change', function() {
            if (this.checked) errStatus.textContent = '';
        }));

        labCheckboxes.forEach(cb => cb.addEventListener('change', function() {
            let anyChecked = false;
            labCheckboxes.forEach(c => { if (c.checked) anyChecked = true; });
            if (anyChecked) errLab.textContent = '';
        }));

        agreeTerms.addEventListener('change', function() {
            if (this.checked) {
                errAgree.textContent = '';
                agreeTerms.classList.remove('error');
            }
        });

        // File upload — validated immediately when a file is chosen
        proofFile.addEventListener('change', function() {
            errProofFile.textContent = '';
            proofFile.classList.remove('error');

            if (!proofFile.files || proofFile.files.length === 0) {
                errProofFile.textContent = 'Please upload proof of grades or a 2x2 photo.';
                proofFile.classList.add('error');
                return;
            }

            const file = proofFile.files[0];
            const fileName = file.name.toLowerCase();
            const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
            const hasValidType = ALLOWED_TYPES.includes(file.type);

            if (!hasValidType && !hasValidExt) {
                errProofFile.textContent = 'Only PNG, JPEG, or PDF files are allowed.';
                proofFile.classList.add('error');
            } else if (file.size > MAX_FILE_SIZE) {
                // ✅ 2 MB message
                errProofFile.textContent = 'File size must not exceed 2 MB.';
                proofFile.classList.add('error');
            }
        });

        extracurricular.addEventListener('blur', function() {
            const val = extracurricular.value.trim();
            errExtracurricular.textContent = '';
            extracurricular.classList.remove('error');

            if (!val) {
                errExtracurricular.textContent = 'This field is required.';
                extracurricular.classList.add('error');
            } else if (val.length < 20) {
                errExtracurricular.textContent = 'Please provide at least 20 characters.';
                extracurricular.classList.add('error');
            } else if (val.length > 2000) {
                errExtracurricular.textContent = 'Maximum 2000 characters allowed.';
                extracurricular.classList.add('error');
            }
        });
    }

    attachLiveValidation();

    // ----- SUBMIT HANDLER -----
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isValid = validateForm();

        if (isValid) {
            successDiv.classList.add('show');
            successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            successDiv.classList.remove('show');
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    form.addEventListener('input', function() {
        successDiv.classList.remove('show');
    });

    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorId = 'error-' + this.name;
            const errSpan = document.getElementById(errorId);
            if (errSpan) errSpan.textContent = '';
        });
    });
})();