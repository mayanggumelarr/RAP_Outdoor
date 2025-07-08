document.addEventListener("DOMContentLoaded", async () => {
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav ul li a");
  const loginButton = document.querySelector(".login-button");

  // Highlight navigation
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (
      link.getAttribute("href") === currentPath ||
      (currentPath === "" && link.getAttribute("href") === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  document.getElementById("hamburgerBtn")?.addEventListener("click", () => {
    document.querySelector("nav ul")?.classList.toggle("show");
  });

  if (loginButton) {
    loginButton.classList.toggle("active", currentPath === "login.html");
  }

  // --------- ✅ CEK LOGIN STATUS DARI SERVER (via PHP session) ---------
  let isLoggedIn = false;

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("check_session.php");
      const data = await response.json();
      isLoggedIn = data.loggedIn;

      if (loginButton) {
        if (isLoggedIn) {
          loginButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
          loginButton.onclick = () => {
            window.location.href = "logout.php"; // logout pakai server
          };
        } else {
          loginButton.innerHTML = '<i class="fas fa-user"></i> Login';
          loginButton.onclick = () => {
            window.location.href = "login.html";
          };
        }
      }
    } catch (error) {
      console.error("Gagal mengecek status login:", error);
    }
  };

  await checkLoginStatus(); // cek status login di awal

  // --- Cart Management Logic (using localStorage) ---
  let cart = [];

  try {
    const storedCart = localStorage.getItem("rapRentCart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    if (!Array.isArray(cart)) throw new Error("Cart is not an array");
  } catch (error) {
    console.warn("Error loading cart from localStorage:", error);
    cart = [];
  }

  const updateCartCount = () => {
    const cartItemCountElement = document.getElementById("cartItemCount");
    if (!cartItemCountElement) return;

    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    cartItemCountElement.textContent = totalItems;
    cartItemCountElement.style.display = totalItems > 0 ? "flex" : "none";
  };

  const saveCart = () => {
    try {
      localStorage.setItem("rapRentCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
    updateCartCount();
  };

  // --- Login Page Specific Logic (TAMBAHAN PENTING INI) ---
  if (currentPath === "login.html") {
    const loginForm = document.querySelector(".login-form");

    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Mencegah form submission default (reload halaman)

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
          alert("Username dan password tidak boleh kosong.");
          return;
        }

        try {
          const formData = new URLSearchParams();
          formData.append("username", username);
          formData.append("password", password);

          const response = await fetch("proses_login.php", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ message: response.statusText }));
            throw new Error(
              `HTTP error! Status: ${response.status} - ${errorData.message}`
            );
          }

          const data = await response.json();

          if (data.success) {
            alert(data.message);

            // --- BARIS KRUSIAL: SIMPAN USER_ID KE LOCALSTORAGE ---
            if (data.user_id) {
              localStorage.setItem("rapRentUser", data.user_id);
              console.log("User ID saved to localStorage:", data.user_id);
            } else {
              console.warn(
                "Login successful, but user_id was not returned by the server. Check proses_login.php."
              );
            }
            // --- AKHIR BARIS KRUSIAL ---

            window.location.href = "katalog.html"; // Redirect ke halaman katalog
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error("Login Error:", error);
          alert(
            "Terjadi kesalahan saat login. Silakan coba lagi. (Cek console untuk detail lebih lanjut)"
          );
        }
      });
    }
  }
  // --- Akhir Login Page Specific Logic ---

  // --- Katalog Page Specific Logic ---
  if (currentPath === "katalog.html") {
    const productGrid = document.getElementById("productGrid");

    if (productGrid) {
      productGrid.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart-btn")) {
          // isLoggedin sudah didapatkan dari checkLoginStatus() di awal
          if (!isLoggedIn) {
            alert(
              "Anda harus login terlebih dahulu untuk menambahkan barang ke keranjang!"
            );
            window.location.href = "login.html"; // Redirect to login page
            return; // Stop eksekusi
          }

          const productItem = event.target.closest(".product-item");
          const productName = productItem.dataset.name;
          const productPrice = parseInt(productItem.dataset.price);

          const existingItem = cart.find((item) => item.name === productName);

          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push({
              name: productName,
              price: productPrice,
              quantity: 1,
            });
          }
          saveCart();
          showPopupMessage(`${productName} ditambahkan ke keranjang!`);
        }
      });
    }

    // --- Duplikasi Kode di Katalog Page ---
    // Anda memiliki blok kode ini dua kali di script.js Anda.
    // Hapus salah satu blok ini untuk menghindari duplikasi dan potensi bug.
    // Saya akan mengasumsikan Anda ingin menjaga yang pertama.
    // Jika ada elemen yang tidak ada di halaman login (seperti categoryList, searchInput),
    // kode tersebut akan secara otomatis dilewati karena if (element) check.

    const productItems = document.querySelectorAll(".product-item");
    const categoryList = document.getElementById("categoryList");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Search
    const filterProducts = () => {
      const searchTerm = searchInput.value.toLowerCase();
      productItems.forEach((item) => {
        const name = item.dataset.name.toLowerCase();
        const category = item.dataset.category.toLowerCase();
        item.style.display =
          name.includes(searchTerm) || category.includes(searchTerm)
            ? "block"
            : "none";
      });
    };

    if (searchInput && searchButton) {
      searchButton.addEventListener("click", filterProducts);
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          filterProducts();
        }
      });
    }

    // Filter Kategori
    if (categoryList) {
      categoryList.addEventListener("click", (e) => {
        const clickedLi = e.target.closest("li");
        if (!clickedLi || !clickedLi.dataset.category) return;

        const selectedCategory = clickedLi.dataset.category
          .trim()
          .toLowerCase();

        document
          .querySelectorAll("#categoryList li")
          .forEach((li) => li.classList.remove("active"));
        clickedLi.classList.add("active");

        productItems.forEach((item) => {
          const itemCategory = item.dataset.category.trim().toLowerCase();
          item.style.display =
            itemCategory === selectedCategory || selectedCategory === "all" // Tambah "all" kategori
              ? "block"
              : "none";
        });

        if (searchInput) searchInput.value = "";
      });
    }
  }

  // --- Checkout Page Specific Logic ---
  if (currentPath === "checkout.html") {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      alert("Anda harus login/register terlebih dahulu!");
      window.location.href = "login.html";
      return; // Stop further execution for checkout page
    }

    const cartItemsContainer = document.getElementById("cartItems");
    const finalOrderSummary = document.getElementById("finalOrderSummary");
    const totalPriceElement = document.getElementById("totalPrice");
    const rentalDurationInput = document.getElementById("rentalDuration");
    const agreeTermsCheckbox = document.getElementById("agreeTerms");
    const orderButton = document.getElementById("orderButton");
    const documentUploadInput = document.getElementById("documentUpload");
    const fileNameDisplay = document.getElementById("fileNameDisplay");

    const renderCartItems = () => {
      cartItemsContainer.innerHTML = ""; // Clear previous items
      if (cart.length === 0) {
        cartItemsContainer.innerHTML =
          '<p class="empty-cart-message">Keranjang Anda kosong. Silakan pilih barang dari <a href="katalog.html">Katalog</a>.</p>';
        return;
      }

      cart.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
                  <div class="cart-item-info">
                      <h4>${item.name}</h4>
                      <p>Harga per hari: Rp${item.price.toLocaleString(
                        "id-ID"
                      )},-</p>
                  </div>
                  <div class="cart-item-qty">
                      <button class="qty-minus" data-index="${index}">-</button>
                      <input type="number" value="${
                        item.quantity
                      }" min="1" data-index="${index}">
                      <button class="qty-plus" data-index="${index}">+</button>
                  </div>
                  <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash"></i> Hapus</button>
              `;
        cartItemsContainer.appendChild(itemElement);
      });
    };

    const updateFinalSummary = () => {
      finalOrderSummary.innerHTML = "";
      let subtotal = 0;
      const duration = parseInt(rentalDurationInput.value) || 1;

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity * duration;
        subtotal += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${item.name} x ${item.quantity} (${duration} hari)</td>
                  <td>Rp${itemTotal.toLocaleString("id-ID")},-</td>
              `;
        finalOrderSummary.appendChild(row);
      });

      totalPriceElement.textContent = `Rp${subtotal.toLocaleString("id-ID")},-`;
      updateOrderButtonState();
    };

    const updateOrderButtonState = () => {
      const hasItems = cart.length > 0;
      const hasDocument = documentUploadInput.files.length > 0;
      const agreedToTerms = agreeTermsCheckbox.checked;
      orderButton.disabled = !(hasItems && hasDocument && agreedToTerms);
    };

    // Event Listeners for Cart Management
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (target.classList.contains("qty-minus")) {
        const index = parseInt(target.dataset.index);
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCart();
          renderCartItems();
          updateFinalSummary();
        }
      } else if (target.classList.contains("qty-plus")) {
        const index = parseInt(target.dataset.index);
        cart[index].quantity++;
        saveCart();
        renderCartItems();
        updateFinalSummary();
      } else if (target.classList.contains("remove-item-btn")) {
        const index = parseInt(target.dataset.index);
        if (
          confirm(`Yakin ingin menghapus ${cart[index].name} dari keranjang?`)
        ) {
          cart.splice(index, 1);
          saveCart();
          renderCartItems();
          updateFinalSummary();
        }
      }
    });

    cartItemsContainer.addEventListener("change", (event) => {
      if (event.target.tagName === "INPUT" && event.target.type === "number") {
        const index = parseInt(event.target.dataset.index);
        let newQuantity = parseInt(event.target.value);
        if (newQuantity < 1 || isNaN(newQuantity)) {
          newQuantity = 1;
        }
        cart[index].quantity = newQuantity;
        saveCart();
        renderCartItems(); // Re-render to update input value visually if it was invalid
        updateFinalSummary();
      }
    });

    // Event Listener for Rental Duration
    rentalDurationInput.addEventListener("input", updateFinalSummary);

    // Event Listener for Document Upload
    documentUploadInput.addEventListener("change", () => {
      if (documentUploadInput.files.length > 0) {
        const files = Array.from(documentUploadInput.files);
        const fileNames = files.map((file) => file.name).join(", ");
        fileNameDisplay.textContent = `File dipilih: ${fileNames}`;

        // Basic file size and type validation (client-side only)
        const totalSize = files.reduce((sum, file) => sum + file.size, 0); // in bytes
        const maxSize = 5 * 1024 * 1024; // 5 MB

        let validFiles = true;
        files.forEach((file) => {
          const fileType = file.type;
          const validTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/zip",
            "application/x-rar-compressed",
            "application/octet-stream",
          ]; // octet-stream for .rar fallback

          if (
            !validTypes.includes(fileType) &&
            !(file.name.endsWith(".zip") || file.name.endsWith(".rar"))
          ) {
            validFiles = false;
          }
        });

        if (!validFiles) {
          alert(
            "Format file tidak didukung. Hanya JPG, JPEG, PNG, PDF, ZIP, RAR yang diizinkan."
          );
          documentUploadInput.value = ""; // Clear selection
          fileNameDisplay.textContent = "Belum ada file yang dipilih.";
        } else if (totalSize > maxSize) {
          alert("Ukuran total file melebihi batas 5MB.");
          documentUploadInput.value = ""; // Clear selection
          fileNameDisplay.textContent = "Belum ada file yang dipilih.";
        }
      } else {
        fileNameDisplay.textContent = "Belum ada file yang dipilih.";
      }
      updateOrderButtonState();
    });

    // Event Listener for Terms Agreement
    agreeTermsCheckbox.addEventListener("change", updateOrderButtonState);

    // Event Listener for Order Button (Simulasi)
    orderButton.addEventListener("click", async () => {
      // Make this async
      if (orderButton.disabled) return;

      const duration = parseInt(rentalDurationInput.value) || 1;
      let subtotal = 0;

      // Hitung total harga
      cart.forEach((item) => {
        subtotal += item.price * item.quantity * duration;
      });

      const orderData = {
        user_id: localStorage.getItem("rapRentUser") || "guest",
        durasi: duration,
        catatan: document.getElementById("notes")?.value || "",
        total_harga: subtotal,
        items: cart.map((item) => ({
          nama_barang: item.name,
          quantity: item.quantity,
          harga: item.price,
          subtotal: item.price * item.quantity * duration,
        })),
      };

      console.log("Sending order data:", orderData); // Debug log

      // Kirim data ke backend
      try {
        const response = await fetch("order_process.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          throw new Error(
            errorData.message ||
              `HTTP error! Status: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.success) {
          alert("✅ Pesanan Berhasil: " + data.message);

          if (data.resi) {
            // ✅ Buka file PDF di tab baru
            window.open(data.resi, "_blank");

            // ✅ Unduh otomatis juga
            const link = document.createElement("a");
            link.href = data.resi;
            link.download = ""; // bisa diganti jadi 'resi.pdf'
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          // Kosongkan keranjang dan reset form HANYA jika pesanan berhasil
          cart = [];
          saveCart();
          renderCartItems();
          updateFinalSummary();
          rentalDurationInput.value = 1;
          documentUploadInput.value = "";
          fileNameDisplay.textContent = "Belum ada file yang dipilih.";
          agreeTermsCheckbox.checked = false;
          if (document.getElementById("notes"))
            document.getElementById("notes").value = ""; // Reset notes jika ada
          updateOrderButtonState();
        } else {
          alert("❌ Gagal Membuat Pesanan: " + data.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert(
          "❌ Terjadi kesalahan teknis. Tidak dapat terhubung ke server. " +
            error.message
        );
      }
    });

    // Initial rendering on page load
    renderCartItems();
    updateFinalSummary();
    updateCartCount(); // Also update count on checkout page load
    updateOrderButtonState();
  }

  // Call updateCartCount on every page load to ensure correct display
  updateCartCount();

  // Popup logic (click outside to close)
  function showPopupMessage(message) {
    const popupOverlay = document.getElementById("popupOverlay");
    const popupMessage = document.getElementById("popupMessage");

    if (popupOverlay && popupMessage) {
      popupMessage.textContent = message;
      popupOverlay.classList.remove("hidden");

      // Klik di luar box akan menutup popup
      popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
          popupOverlay.classList.add("hidden");
        }
      });

      // Auto-close (opsional)
      setTimeout(() => {
        popupOverlay.classList.add("hidden");
      }, 3000); // otomatis hilang dalam 3 detik
    }
  }
});
