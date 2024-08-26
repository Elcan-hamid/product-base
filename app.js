// Product Base Program

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("product-form");
	const listGroup = document.querySelector(".list-group");
	const productCountEl = document.getElementById("length");
	const totalPriceEl = document.getElementById("summary");

	// Load products from storage when DOM is loaded
	loadProductsFromStorage();

	form.addEventListener("submit", handleFormSubmit);
	listGroup.addEventListener("click", handleDeleteProduct);

	function handleFormSubmit(e){
		e.preventDefault();

		const name = document.getElementById("name").value.trim();
		const price = Number(document.getElementById("price").value.trim());

		if(!name || !price){
			alert("Bütün inputlar doldurulmalıdır");
			return;
		} 

		const products = JSON.parse(localStorage.getItem("products")) || [];
		// Get the next ID from localStorage or default to 1
        let nextId = parseInt(localStorage.getItem("nextId")) || 1;

		addProductToList(nextId, name, price);
		addProductToStorage(nextId, name, price);
		updateSummary();

		// Increment nextId and save it back to localStorage
		localStorage.setItem('nextId', nextId+1);
		form.reset();
	}

	function addProductToList(id, name, price){
		const li = document.createElement("li");
		li.className = "list-item";
		li.setAttribute("data-id", id);

		li.innerHTML += `
			${name} (${price} AZN)
			<button id="delete-product" class="btn btn-danger">Sil</button>
		`;

		listGroup.appendChild(li);	
	}

	function addProductToStorage(id, name, price){
		const products = JSON.parse(localStorage.getItem("products")) || [];

		products.push({id, name, price});

		localStorage.setItem("products", JSON.stringify(products));
	}

	function handleDeleteProduct(e){
		if(e.target.id == 'delete-product'){
			const item = e.target.closest('.list-item');
			const id = parseInt(item.getAttribute('data-id'));
			deleteProductFromStorage(id);
			item.remove();
			updateSummary();
		}
	}

	function deleteProductFromStorage(id){
		const products = JSON.parse(localStorage.getItem("products")) || [];

		const filtered = products.filter(product => product.id !== id);

		localStorage.setItem("products", JSON.stringify(filtered));
	}

	function loadProductsFromStorage(){
		const products = JSON.parse(localStorage.getItem("products")) || [];

		products.forEach(product => addProductToList(product.id, product.name, product.price));
		updateSummary();
	}

	function updateSummary(){
		const products = JSON.parse(localStorage.getItem("products")) || [];
		const totalPrice = products.reduce((sum, item) => sum+item.price, 0);

		productCountEl.textContent = products.length;
		totalPriceEl.textContent = totalPrice;
	}
});

