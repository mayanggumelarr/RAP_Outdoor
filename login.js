// login.js

document.addEventListener("DOMContentLoaded", () => {
  // Ambil elemen form login
  const loginForm = document.querySelector(".login-form");

  // Pastikan form login ada di halaman ini
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Mencegah form submission default (reload halaman)

      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");

      const username = usernameInput.value;
      const password = passwordInput.value;

      // Basic validation (opsional, bisa ditambah lebih lanjut)
      if (!username || !password) {
        alert("Username dan password tidak boleh kosong.");
        return; // Hentikan proses jika ada input kosong
      }

      try {
        // Siapkan data untuk dikirim ke PHP dalam format URL-encoded
        // Ini sesuai dengan cara PHP membaca dari $_POST
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        // Kirim permintaan login ke proses_login.php
        const response = await fetch("proses_login.php", {
          method: "POST",
          // header 'Content-Type' akan otomatis diatur oleh fetch
          // saat body adalah URLSearchParams
          body: formData,
        });

        // Cek apakah respons HTTP sukses (status 200 OK)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Menguraikan respons JSON dari server
        const data = await response.json();

        if (data.success) {
          alert(data.message); // Tampilkan pesan sukses dari server

          // --- INI BAGIAN KRUSIAL: SIMPAN USER_ID KE LOCALSTORAGE ---
          if (data.user_id) {
            localStorage.setItem("rapRentUser", data.user_id);
            console.log("User ID saved to localStorage:", data.user_id);
            // Anda bisa menambahkan tampilan visual untuk user yang sudah login di header, dll.
          } else {
            console.warn(
              "Login successful, but user_id was not returned by the server. Check proses_login.php."
            );
          }
          // --- AKHIR BAGIAN KRUSIAL ---

          // Redirect ke halaman katalog setelah login berhasil
          window.location.href = "katalog.html";
        } else {
          // Login gagal, tampilkan pesan error dari server
          alert(data.message);
        }
      } catch (error) {
        console.error("Login Error:", error);
        // Pesan error umum untuk pengguna
        alert(
          "Terjadi kesalahan saat login. Silakan coba lagi. (Cek console untuk detail lebih lanjut)"
        );
      }
    });
  } else {
    console.warn("Login form with class 'login-form' not found on this page.");
  }
});
