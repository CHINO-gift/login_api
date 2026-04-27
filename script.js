const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(event) {
event.preventDefault();

emailError.textContent = "";
passwordError.textContent = "";
loginMessage.textContent = "";

const email = emailInput.value.trim();
const password = passwordInput.value.trim();

let hasError = false;

if (email === "") {
emailError.textContent = "El correo es obligatorio";
hasError = true;
} else if (!validarEmail(email)) {
emailError.textContent = "Ingresa un correo válido";
hasError = true;
}

if (password === "") {
passwordError.textContent = "La contraseña es obligatoria";
hasError = true;
} else if (password.length < 4) {
passwordError.textContent = "La contraseña debe tener mínimo 4 caracteres";
hasError = true;
}

if (hasError) return;

try {
const response = await fetch("http://localhost:3000/api/auth/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
email: email,
password: password
})
});

const data = await response.json();

if (!response.ok) {
loginMessage.textContent = data.message || "Correo o contraseña incorrectos";
loginMessage.style.color = "red";
return;
}

localStorage.setItem("token", data.token);
localStorage.setItem("usuario", JSON.stringify(data.user));

loginMessage.textContent = "Login exitoso";
loginMessage.style.color = "green";

setTimeout(() => {
if (data.user.role === "admin") {
window.location.href = "admin.html";
} else if (data.user.role === "coach") {
window.location.href = "coach.html";
} else {
window.location.href = "usuario.html";
}
}, 1000);

} catch (error) {
loginMessage.textContent = "No hay conexión con el servidor";
loginMessage.style.color = "red";
}
});

function validarEmail(email) {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email);
}