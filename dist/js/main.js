document.addEventListener('DOMContentLoaded', () => {
	const gridContainer = document.querySelector('.grid-container');
	const showMoreBtn = document.querySelector('.btn-more') || document.querySelector('.btn-block .btn');
	const form = document.querySelector('.form-block form');
	const checkboxField = document.querySelector('.checkbox-field');

	let currentPage = 1;
	const usersPerPage = 6;
	let totalPages = 1;
	let loading = false;
	let moreLoaded = false;

	async function fetchUsers(page = 1) {
		try {
			const res = await fetch(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=${usersPerPage}`);
			if (!res.ok) throw new Error('Network error when fetching users');
			const data = await res.json();
			totalPages = Math.ceil(data.total_users / usersPerPage);
			return data.users || [];
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	function renderUsers(users, append = true) {
		if (!append) gridContainer.innerHTML = '';
		users.forEach(user => {
			const card = document.createElement('div');
			card.classList.add('card');
			card.innerHTML = `
			<div class="photo-holder">
			<img src="${user.photo}" alt="${user.name}">
			</div>
			<span class="name-holder">${user.name}</span>
			<p>
			${user.position}<br/>
			<a href="mailto:${user.email}">${user.email}</a><br/>
			<a href="tel:${user.phone}">${user.phone}</a>
			</p>
			`;
			gridContainer.appendChild(card);
		});
	}

	async function loadUsers({reset = false} = {}) {
		if (loading) return;
		loading = true;

		if (reset) {
			currentPage = 1;
			gridContainer.innerHTML = '';
		}

		const users = await fetchUsers(currentPage);
		renderUsers(users, !reset && currentPage > 1);

		if (currentPage >= totalPages) {
			if (showMoreBtn) showMoreBtn.style.display = 'none';
		} else {
			if (showMoreBtn) showMoreBtn.style.display = '';
		}

		loading = false;
	}

	if (showMoreBtn) {
		showMoreBtn.addEventListener('click', (e) => {
			if (e) e.preventDefault();
			currentPage++;
			moreLoaded = true;
			loadUsers();
		});
	}

	loadUsers({reset: true});

	async function fetchPositions() {
		try {
			const res = await fetch('https://frontend-test-assignment-api.abz.agency/api/v1/positions');
			if (!res.ok) throw new Error('Positions fetch failed');
			const data = await res.json();
			return data.positions || [];
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	function renderPositions(positions) {
		checkboxField.innerHTML = '<legend>Select your position</legend>';
		positions.forEach(pos => {
			const label = document.createElement('label');
			label.setAttribute('for', `pos-${pos.id}`);
			label.innerHTML = `
			<input type="radio" id="pos-${pos.id}" name="position_id" value="${pos.id}" />
			<span class="checkmark"></span>
			${pos.name}
			`;
			checkboxField.appendChild(label);
		});
	}

	fetchPositions().then(renderPositions);

	const fileInput = document.querySelector(".default_doc");
	const uploadBtn = document.querySelector(".btn-upload");
	const fileNameField = document.querySelector(".file-name");

	uploadBtn.addEventListener("click", function () {
		fileInput.click();
	});

	fileInput.addEventListener("change", function () {
		if (fileInput.files.length > 0) {
			fileNameField.value = fileInput.files[0].name;
		} else {
			fileNameField.value = "";
		}
	});


	// Validation helpers
	function checkImageDimensions(file) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = function() {
				const w = img.naturalWidth;
				const h = img.naturalHeight;
				URL.revokeObjectURL(img.src);
				resolve({w, h});
			};
			img.onerror = function() {
				URL.revokeObjectURL(img.src);
				reject(new Error('Invalid image file'));
			};
			img.src = URL.createObjectURL(file);
		});
	}

	function clearErrors(formEl) {
		formEl.querySelectorAll('.error-msg').forEach(el => el.remove());
		formEl.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
		formEl.querySelectorAll('[data-error-hidden="1"]').forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-error-hidden');
		});
	}

	function showError(target, message, options = {}) {
		const el = typeof target === 'string' ? document.querySelector(target) : target;

		if (options.replacePlaceholder && el) {
			el.classList.add('error');
			el.value = '';
			el.placeholder = message;
			return;
		}

		const errorEl = document.createElement('div');
		errorEl.className = 'error-msg';
		errorEl.textContent = message;

		if (options.replaceLabelSelector) {
			const label = document.querySelector(options.replaceLabelSelector);
			if (label) {
				label.style.display = 'none';
				label.setAttribute('data-error-hidden', '1');
				label.insertAdjacentElement('afterend', errorEl);
				return;
			}
		}

		if (options.after) {
			const afterEl = typeof options.after === 'string' ? document.querySelector(options.after) : options.after;
			if (afterEl) {
				afterEl.insertAdjacentElement('afterend', errorEl);
				return;
			}
		}

		if (el) {
			el.classList.add('error');
			el.insertAdjacentElement('afterend', errorEl);
		}
	}

	// Validation
	async function validateForm(formEl) {
		clearErrors(formEl);

		const nameInput = formEl.querySelector('input[name="first-name"]');
		const emailInput = formEl.querySelector('input[name="email"]');
		const phoneInput = formEl.querySelector('input[name="phone"]');
		const positionInputs = formEl.querySelectorAll('input[name="position_id"]');
		const fileInput = formEl.querySelector('input[name="document"]');
		const fileNameEl = formEl.querySelector('.file-name');
		const file = fileInput?.files?.[0];

		let valid = true;

		// Name
		const name = nameInput.value.trim();
		if (name.length < 2 || name.length > 60) {
			showError(nameInput, "Name must be between 2 and 60 characters.");
			valid = false;
		}

		// Email
		const email = emailInput.value.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
			showError(emailInput, "Invalid email format or too long.");
			valid = false;
		}

		// Phone
		const phone = phoneInput.value.trim();
		if (!/^\+380\d{9}$/.test(phone)) {
			showError(phoneInput, "Phone must match +380XXXXXXXXX.", {
				replaceLabelSelector: 'label[for="phone"]'
			});
			valid = false;
		}

		// Position
		const position = Array.from(positionInputs).find(r => r.checked);
		if (!position) {
			const lastLabel = checkboxField.querySelector('label:last-of-type');
			showError(lastLabel, "Please select a position.", { after: lastLabel });
			valid = false;
		}

		// File
		if (!file) {
			showError(fileNameEl, "Please upload a photo.", { replacePlaceholder: true });
			valid = false;
		} else {
			if (!['image/jpeg','image/jpg'].includes(file.type)) {
				showError(fileNameEl, "Photo must be JPG/JPEG.", { replacePlaceholder: true });
				valid = false;
			}
			if (file.size > 5 * 1024 * 1024) {
				showError(fileNameEl, "Photo must be less than 5MB.", { replacePlaceholder: true });
				valid = false;
			}
			try {
				const {w, h} = await checkImageDimensions(file);
				if (w < 70 || h < 70) {
					showError(fileNameEl, "Photo dimensions must be at least 70x70 px.", { replacePlaceholder: true });
					valid = false;
				}
			} catch {
				showError(fileNameEl, "Unable to read image dimensions.", { replacePlaceholder: true });
				valid = false;
			}
		}

		return valid;
	}

	// Register
	async function getToken() {
		const res = await fetch('https://frontend-test-assignment-api.abz.agency/api/v1/token');
		if (!res.ok) throw new Error('Token request failed');
		const data = await res.json();
		return data.token;
	}

	async function registerUser(formEl) {
		try {
			const token = await getToken();
			const fd = new FormData();
			fd.append('name', formEl.querySelector('input[name="first-name"]').value.trim());
			fd.append('email', formEl.querySelector('input[name="email"]').value.trim());
			fd.append('phone', formEl.querySelector('input[name="phone"]').value.trim());
			fd.append('position_id', formEl.querySelector('input[name="position_id"]:checked').value);
			fd.append('photo', formEl.querySelector('input[name="document"]').files[0]);

			const res = await fetch('https://frontend-test-assignment-api.abz.agency/api/v1/users', {
				method: 'POST',
				headers: {
					'Token': token
				},
				body: fd
			});

			const data = await res.json();
			return {ok: res.ok, data};
		} catch (err) {
			console.error(err);
			return {ok:false, error: err.message};
		}
	}

	// Form Submit
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
		if (submitBtn) submitBtn.disabled = true;

		const isValid = await validateForm(form);
		if (!isValid) {
			if (submitBtn) submitBtn.disabled = false;
			return;
		}

		const result = await registerUser(form);
		if (result.ok && result.data && result.data.success) {
			form.outerHTML = `
			<div class="success-block">
				<span class="success-msg">User successfully registered!</span>
				<div class="success-img">
					<img src="../images/img-01.svg" alt="">
				</div>
			</div>
			`;

			if (moreLoaded) {
				moreLoaded = false;
			}

			currentPage = 1;
			await loadUsers({reset: true});

		} else {
			const msg = result.data?.message || result.error || 'Registration failed';
			const formTop = form.querySelector('fieldset') || form;
			showError(formTop, msg);
		}

		if (submitBtn) submitBtn.disabled = false;
	});
});
