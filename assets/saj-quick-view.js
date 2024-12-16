
/*
-Listen to change in input options
-Add checked attribute on selected options
*/
document.querySelectorAll('.ny-box').forEach(productBox => {
    // Select Color and Size radios *within the current product box*
    const radioButtonsColor = productBox.querySelectorAll('input[name="Color"]');
    const radioButtonsSize = productBox.querySelectorAll('input[name="Size"]');

    // Function to handle radio button selection within the product box
    function handleRadioChange(radioGroup) {
    radioGroup.forEach(radio => {
        radio.addEventListener('change', function() {
        // Uncheck all radios in the current group (within the same product box)
        radioGroup.forEach(r => r.removeAttribute('checked',''));

        // Check the clicked radio button
        this.setAttribute('checked','');
        });
    });
    }

    // Apply scoped radio change logic to both groups
    handleRadioChange(radioButtonsColor);
    handleRadioChange(radioButtonsSize);
});


/*
-Function that finds the varient id that match the options set
-Insert the varient id in form
-Display image with varient image and varient pricing
*/
// Root container for the product grid
var root = document.querySelector('.quick-view-block');

// Loop through each product box
root.querySelectorAll('.ny-box').forEach(productBox => {
  // Parse the product JSON
  let productData = null;

  try {
    productData = JSON.parse(productBox.dataset.product);
  } catch (error) {
    console.error('Invalid JSON in data-product:', productBox.dataset.product, error);
    return; // Skip this product box
  }


  // Add event listener for radio buttons within the current product box
  productBox.querySelectorAll('.main-product-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Collect selected options within the current product box
      let selectedOptions = [];
      productBox.querySelectorAll('.main-product-option input[type="radio"]:checked').forEach(radio => {
        selectedOptions.push(radio.value);
      });

      // Find the matching variant
      let matchedVariant = productData.variants.find(variant => {
        return variant.options.every((option, index) => option === selectedOptions[index]);
      });

      if (matchedVariant) {
        // Update the hidden input with the new variant ID
        productBox.querySelector('.main-product-id').value = matchedVariant.id;

        // Optionally update other UI elements (price, image, etc.)
        productBox.querySelector('.ny-popup-content p:nth-child(2)').textContent = matchedVariant.price;

        if (matchedVariant.featured_image) {
          console.log('link'+ matchedVariant.featured_image.src)
          productBox.querySelector('.ny-popup-image img').setAttribute('src', matchedVariant.featured_image.src);
        }
      }
    });
  });
});


 /*
 -Ajax add to cart
 -Prevent default form submission
 -Post FormData using Ajax
 - Update the cart icon value 
 */ 
const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

addToCartForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
    // Prevent normal submission
    event.preventDefault();
    console.log(form)
    // Submit form with ajax
    await fetch("/cart/add", {
        method: "post",
        body: new FormData(form),
    });

    // Get new cart object
    const res = await fetch("/cart.json");
    console.log(res)
    const cart = await res.json();

    // Update cart count
    document.querySelectorAll(".cart-count-bubble span").forEach((el) => {
        el.textContent = cart.item_count;
    });

    // Display message
    const message = document.createElement("p");
    message.classList.add("added-to-cart");
    message.textContent = "Added to cart!";
    form.appendChild(message);
    });
});


/*
Accordian for Size Color Option
*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".ny-box").forEach(productBox => {
    const toggleButton = productBox.querySelector(".ny-accordion-toggle");
    const toggleForm = productBox.querySelector(".ny-popup-form");
    const accordionContent = productBox.querySelector(".ny-size-wrapper");
    const toggleSelect = productBox.querySelectorAll(".ny-field-Size label");

    toggleButton.addEventListener("click", () => {
      const isOpen = accordionContent.style.display === "block";

      // Toggle visibility of this product's accordion
      accordionContent.style.display = isOpen ? "none" : "block";

      // Toggle arrow direction
      toggleButton.classList.toggle("open", !isOpen);
      toggleForm.classList.toggle("open", !isOpen);
    });

    toggleSelect.forEach(label => {
      label.addEventListener("click", () => {
        const isOpen = accordionContent.style.display === "block";
        const placeholder = productBox.querySelector(".ny-placeholder");

        // Toggle visibility of this product's accordion
        accordionContent.style.display = isOpen ? "none" : "block";

        // Toggle arrow direction
        toggleButton.classList.toggle("open", !isOpen);
        toggleForm.classList.toggle("open", !isOpen);
        if (placeholder) {
          // Update the placeholder text with the clicked label's text
          placeholder.textContent = label.textContent.trim();
          placeholder.style.margin = "auto";
        }
      });
    });

  });
}); 

/*
- Popup is Hidden by Default
- This control the opening and closing of Popup
*/
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.classList.add("ny-overlay");
  document.body.appendChild(overlay); // Append the overlay to the body

  document.querySelectorAll('.ny-box').forEach(productBox => {
    const viewForm = productBox.querySelector(".ny-selection-box");
    const closeForm = productBox.querySelector(".ny-close");
    const OpenForm = productBox.querySelector(".pointer img");

    // Add event listener to open the form
    OpenForm.addEventListener("click", () => {
      viewForm.classList.add("open"); // Adds the 'open' class
      overlay.classList.add("visible"); // Shows the overlay
      document.body.style.overflow = "hidden"; // Prevents body scrolling
    });

    // Add event listener to close the form
    closeForm.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevents the event from bubbling up
      viewForm.classList.remove("open"); // Removes the 'open' class
      overlay.classList.remove("visible"); // Hides the overlay
      document.body.style.overflow = ""; // Restores body scrolling
    });

    // Close overlay on click
    overlay.addEventListener("click", () => {
      viewForm.classList.remove("open");
      overlay.classList.remove("visible");
      document.body.style.overflow = "";
    });
  });
});
