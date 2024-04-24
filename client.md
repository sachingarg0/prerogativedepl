<% layout('./layouts/boilerplate.ejs') %>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100%;
    font-family: Helvetica, sans-serif;
  }
  .buy {
    margin-top: 4.5rem;
    height: 86vh;
    width: 100%;
    text-align: center;
  }
  .coupon-apply-heading {
    display: inline-block;
    font-weight: 600;
    font-size: 70px;
    background: -webkit-linear-gradient(#6d0ea8, #c60987);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 2.5rem;
  }
  .coupon-apply-sub-heading {
    font-weight: 500;
    font-size: 30px;
    margin-bottom: 2.5rem;
  }
  .coupon-apply-span {
    font-weight: 600;
    font-size: 30px;
    background: -webkit-linear-gradient(#6d0ea8, #c60987);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .coupon-input {
    border: 2px solid #ddd;
    border-radius: 50px;
    padding: 10px;
    transition: all 0.4s ease-in-out;
    outline: none;
    text-align: center;
  }
  .coupon-input:focus {
    border: 2px solid #6d0ea8;
    outline: none;
  }
  .coupon-form-submit {
    border: none;
    background-color: #6d0ea8;
    color: #fff;
    border-radius: 50px;
    padding: 10px 15px;
    transition: all 0.4s ease-in-out;
    outline: none;
  }
  .coupon-form-submit:hover {
    cursor: pointer;
    outline: none;
    background-color: #c60987;
  }
  .coupon_course_img {
    height: 250px;
    width: 400px;
    background-color: red;
    margin: 3rem auto 3rem auto;
    border-radius: 10px;
    overflow: hidden;
    filter: drop-shadow(0px 1px 8px #68686872);
  }
  .coupon_course_img img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .discounted-price {
    text-decoration: none;
    background: -webkit-linear-gradient(#6d0ea8, #c60987);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    display: block; /* Ensure that it's displayed as a block element */
  }
  .flash-message {
    position: fixed;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 2px solid #6d0ea8;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: none;
  }
  .form_coupon_next {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>

<div class="buy">
  <!--! ******************Form*********************  -->
  <div class="form_coupon_next">
    <form action="/<%= Course._id %>/details/payment" method="post">
      <label for="name">Name</label>
      <input type="text" name="Student[name]" id="name" />
      <label for="mobile">Mobile No.</label>
      <input type="tel" name="Student[mobile]" id="mobile" />
      <label for="email">Email</label>
      <input type="email" name="Student[email]" id="email" />
      <label for="year">Year</label>
      <input type="number" name="Student[year]" id="year" />
      <label for="crname">Course Name</label>
      <input type="text" name="Student[coursename]" id="crname" />
      <% if(!discountedPrice) {%>
      <input type="submit" value="Pay for ₹ <%= Course.discounted_price %>" />
      <% } %> <% if(discountedPrice) {%>
      <input type="submit" value="Pay for ₹ <%= discountedPrice %>" />
      <% } %>
    </form>
  </div>

  <div class="flash-message" id="flashMessage">Please enter a coupon code.</div>
  <h1 class="coupon-apply-heading">Welcome To <%= Course.title %></h1>
  <!-- Update the discounted price with a new class -->
  <h3 class="coupon-apply-sub-heading">
    Your Course Cost
    <!-- Apply the discounted-price class here -->
    <span class="discounted-price">₹ <%= Course.discounted_price %></span>
    <% if(discountedPrice) {%>
    <!-- New span for the updated discounted price -->
    <span class="coupon-apply-span">₹ <%= discountedPrice %></span>
    <% } %>
  </h3>
  <div class="coupon_course_img">
    <img src="<%= Course.image %>" alt="" />
  </div>
  <form action="/<%= Course._id %>/details" method="post">
    <input
      type="text"
      placeholder="Coupon"
      name="Coupon"
      class="coupon-input"
    />
    <button class="coupon-form-submit">Apply Coupon</button>
  </form>
</div>

<script>
  // JavaScript to handle coupon submission
  document.addEventListener("DOMContentLoaded", function () {
    const couponForm = document.querySelector("form");
    const flashMessage = document.getElementById("flashMessage");

    couponForm.addEventListener("submit", function (event) {
      const couponInput = document.querySelector(".coupon-input");
      if (!couponInput.value.trim()) {
        event.preventDefault(); // Prevent form submission
        flashMessage.style.display = "block"; // Show flash message
        setTimeout(function () {
          flashMessage.style.display = "none"; // Hide flash message after 3 seconds
        }, 3000);
      }
    });
  });
</script>
<script>
  // JavaScript to update the discounted price
  // This script will run after the page is loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Get the span element containing the discounted price
    const discountedPriceElement = document.querySelector(".coupon-apply-span");
    // Get the span element containing the original price
    const originalPriceElement = document.querySelector(".discounted-price");
    // Set the original price as strikethrough
    // Set the original price color to gray
    originalPriceElement.style.color = "#888";
    // Replace the content of the original price element with the content of the discounted price element
    originalPriceElement.innerHTML = discountedPriceElement.innerHTML;
    discountedPriceElement.innerHTML = "";
  });
</script>

<!-- ********************************************************************** -->

<% layout('./layouts/boilerplate.ejs') %>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100%;
    font-family: Helvetica, sans-serif;
  }
  .buy {
    margin-top: 4.5rem;
    height: 86vh;
    width: 100%;
    text-align: center;
  }
  .coupon-apply-heading {
    display: inline-block;
    font-weight: 600;
    font-size: 70px;
    background: -webkit-linear-gradient(#6d0ea8, #c60987);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 2.5rem;
  }
  .coupon-apply-sub-heading {
    font-weight: 500;
    font-size: 30px;
    margin-bottom: 2.5rem;
  }
  .coupon-apply-span {
    font-weight: 600;
    font-size: 30px;
    background: -webkit-linear-gradient(#6d0ea8, #c60987);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .coupon-input {
    border: 2px solid #ddd;
    border-radius: 50px;
    padding: 10px;
    transition: all 0.4s ease-in-out;
    outline: none;
    text-align: center;
  }
  .coupon-input:focus {
    border: 2px solid #6d0ea8;
    outline: none;
  }
  .coupon-form-submit {
    border: none;
    background-color: #6d0ea8;
    color: #fff;
    border-radius: 50px;
    padding: 10px 15px;
    transition: all 0.4s ease-in-out;
    outline: none;
  }
  .coupon-form-submit:hover {
    cursor: pointer;
    outline: none;
    background-color: #c60987;
  }
  .coupon_course_img {
    height: 250px;
    width: 400px;
    background-color: red;
    margin: 3rem auto 3rem auto;
    border-radius: 10px;
    overflow: hidden;
    filter: drop-shadow(0px 1px 8px #68686872);
  }
  .coupon_course_img img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .discounted-price {
    text-decoration: none;
    background: -webkit-linear-gradient(#6d0ea8, #c60987);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    display: block; /* Ensure that it's displayed as a block element */
  }
  .flash-message {
    position: fixed;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 2px solid #6d0ea8;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: none;
  }
  .form_coupon_next {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
<div class="buy">
  <!-- Flash message for coupon -->
  <div class="flash-message" id="couponMessage" style="display: none"></div>

  <!-- Student Info Form -->
  <form
    action="/<%= Course._id %>/details/payment"
    method="post"
    id="studentForm"
  >
    <label for="name">Name</label>
    <input type="text" name="Student[name]" id="name" required />
    <label for="mobile">Mobile No.</label>
    <input type="tel" name="Student[mobile]" id="mobile" required />
    <label for="email">Email</label>
    <input type="email" name="Student[email]" id="email" required />
    <label for="year">Year</label>
    <input type="number" name="Student[year]" id="year" required />
    <label for="crname">Course Name</label>
    <input type="text" name="Student[coursename]" id="crname" required />

    <!-- Main Submit Button -->
    <button type="submit" id="submitButton" class="submit-button">Pay</button>

  </form>

  <!-- Apply Coupon Form -->
  <form action="/<%= Course._id %>/details" method="post" id="couponForm">
    <input
      type="text"
      placeholder="Coupon"
      name="Coupon"
      id="coupon"
      class="coupon-input"
    />
    <button type="submit" id="applyCoupon" class="coupon-form-submit">
      Apply Coupon
    </button>
  </form>

  <!-- Display applied coupon -->

<% if(couponName) { %>

  <div class="applied-coupon" id="appliedCoupon">
    <span class="coupon-name"><%= couponName %></span>
    <button class="remove-coupon" onclick="removeCoupon()">x</button>
  </div>
  <% } %>
</div>

<script>
  // Function to show applied coupon
  function showAppliedCoupon(couponName) {
    const couponMessage = document.getElementById("couponMessage");
    const appliedCoupon = document.getElementById("appliedCoupon");
    const couponSpan = document.querySelector(".coupon-apply-span");
    const discountedPrice = document.getElementById("discountedPrice");

    // Display applied coupon
    couponMessage.innerText = `Coupon "${couponName}" applied successfully!`;
    couponMessage.style.display = "block";
    appliedCoupon.innerHTML = `
      <span class="coupon-name">${couponName}</span>
      <button class="remove-coupon" onclick="removeCoupon()">x</button>
    `;
    appliedCoupon.style.display = "block";
    couponSpan.style.display = "inline-block";
    discountedPrice.style.display = "none"; // Hide original price
  }

  // Function to remove applied coupon
  function removeCoupon() {
    const couponInput = document.getElementById("coupon");
    const couponMessage = document.getElementById("couponMessage");
    const appliedCoupon = document.getElementById("appliedCoupon");
    const couponSpan = document.querySelector(".coupon-apply-span");
    const discountedPrice = document.getElementById("discountedPrice");

    // Clear coupon input field
    couponInput.value = "";
    // Hide applied coupon and discounted price
    appliedCoupon.style.display = "none";
    if (couponSpan) {
      couponSpan.style.display = "none";
    }
    if (discountedPrice) {
      // Check if discountedPrice exists
      discountedPrice.style.display = "inline-block"; // Show original price
    }
    // Clear coupon message
    couponMessage.style.display = "none";
  }

  // Event listener for apply coupon button
  /*document
    .getElementById("applyCoupon")
    .addEventListener("click", async function () {
      const couponInput = document.getElementById("coupon");
      const couponName = couponInput.value.trim();

      // Check if the coupon name is provided
      if (couponName) {
        // Submit the coupon form
        document.getElementById("couponForm").submit();
      } else {
        // No coupon name provided, show error message
        const couponMessage = document.getElementById("couponMessage");
        couponMessage.innerText = "Please enter a coupon code.";
        couponMessage.style.display = "block";
      }
    });*/

  // Event listener for form submission
  document
    .getElementById("submitButton")
    .addEventListener("click", function () {
      // Submit the student info form
      document.getElementById("studentForm").submit();
    });
</script>

<!-- ********************************** client_next -->

<% layout('./layouts/boilerplate.ejs') %>

<style>
  /* Global styles */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
  }

  /* Main card container */
  .main-card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 50px;
  }

  /* Left side containing the course image */
  .left-side {
    flex: 1;
    padding-right: 20px;
  }

  /* Course image */
  .course-image {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .course-image img {
    object-fit: cover;
    width: 100%;
  }

  /* Right side containing the form */
  .right-side {
    flex: 1;
    padding-left: 20px;
  }

  /* Form container */
  .form-container {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  /* Form input fields */
  .form-input {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  /* Form input fields on focus */
  .form-input:focus {
    border-color: #c60987;
  }

  /* Submit button */
  .submit-button {
    background-color: #c60987;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 20px;
  }

  /* Submit button hover effect */
  .submit-button:hover {
    background-color: #e20c9a;
  }

  /* Flash message */
  .flash-message {
    margin-top: 20px;
    padding: 10px;
    background-color: #ffe6e6;
    border: 1px solid #ff3333;
    border-radius: 5px;
    display: none;
  }
  .applied-coupon {
    display: inline-block;
  }
  .coupon-name {
    background: #bbb;
    padding: 10px 15px;
    border-radius: 10px;
  }
  .remove-coupon {
    border: none;
    background: #000;
    color: #fff;
    border: 2px solid transparent;
    border-radius: 20px;
    height: 30px;
    width: 30px;
    transition: all 0.2s ease-in-out;
  }
  .remove-coupon:hover {
    background: #ddd;
    border: 2px solid #000;
    color: #000;
    border-radius: 20px;
  }
</style>

<div class="main-card">
  <!-- Left side with the course image -->
  <div class="left-side">
    <div class="course-image">
      <img src="<%= Course.image %>" alt="Course Image" />
    </div>
  </div>

  <!-- Right side containing the form -->
  <div class="right-side">
    <div class="form-container">
      <!-- Flash message for coupon -->
      <div class="flash-message" id="couponMessage"></div>

      <!-- Student Info Form -->
      <form
        action="/<%= Course._id %>/details/payment"
        method="post"
        id="studentForm"
      >
        <input
          type="text"
          name="Student[name]"
          class="form-input"
          placeholder="Name"
          required
        /><br />
        <input
          type="tel"
          name="Student[mobile]"
          class="form-input"
          placeholder="Mobile No."
          required
        /><br />
        <input
          type="email"
          name="Student[email]"
          class="form-input"
          placeholder="Email"
          required
        /><br />
        <input
          type="number"
          name="Student[year]"
          class="form-input"
          placeholder="Year"
          required
        /><br />
        <input
          type="text"
          name="Student[coursename]"
          class="form-input"
          placeholder="Course Name"
          required
        /><br />

        <!-- Main Submit Button -->
        <button
          type="submit"
          id="submitButton"
          class="submit-button"
          onclick="updatePayButton()"
        >
          Pay <% if(discountedPrice) { %> ₹ <%= discountedPrice %> <% } else {
          %> ₹ <%= Course.discounted_price %> <% } %>
        </button>
      </form>

      <!-- Apply Coupon Form -->
      <form action="/<%= Course._id %>/details" method="post" id="couponForm">
        <input
          type="text"
          placeholder="Coupon"
          name="Coupon"
          class="form-input"
          id="coupon"
        /><br />
        <div class="button-container">
          <button type="submit" id="applyCoupon" class="submit-button">
            Apply Coupon
          </button>
        </div>
      </form>

      <!-- Display applied coupon -->
      <% if(couponName) { %>
      <div class="applied-coupon" id="appliedCoupon">
        <span class="coupon-name"><%= couponName %></span>
        <button class="remove-coupon" onclick="removeCoupon()">x</button>
      </div>
      <% } %>
    </div>

  </div>
</div>

<script>
  // Function to update pay button text
  function updatePayButton() {
    const submitButton = document.getElementById("submitButton");
    const discountedPrice = "<%= discountedPrice %>";
    const coursePrice = "<%= Course.discounted_price %>";

    // Check if discountedPrice exists and update pay button text accordingly
    if (discountedPrice) {
      submitButton.textContent = `Pay ₹ ${discountedPrice}`;
    } else {
      submitButton.textContent = `Pay ₹ ${coursePrice}`;
    }
  }

  // Function to show applied coupon
  function showAppliedCoupon(couponName) {
    const couponMessage = document.getElementById("couponMessage");
    const appliedCoupon = document.getElementById("appliedCoupon");
    const couponSpan = document.querySelector(".coupon-apply-span");
    const discountedPrice = document.getElementById("discountedPrice");

    // Display applied coupon
    couponMessage.innerText = `Coupon "${couponName}" applied successfully!`;
    couponMessage.style.display = "block";
    appliedCoupon.innerHTML = `
      <span class="coupon-name">${couponName}</span>
      <button class="remove-coupon" onclick="removeCoupon()">x</button>
    `;
    appliedCoupon.style.display = "block";
    couponSpan.style.display = "inline-block";
    discountedPrice.style.display = "none"; // Hide original price
  }

  // Event listener for form submission
  document
    .getElementById("submitButton")
    .addEventListener("click", function (event) {
      const form = document.getElementById("studentForm");
      const nameInput = document.querySelector("input[name='Student[name]']");
      const mobileInput = document.querySelector(
        "input[name='Student[mobile]']"
      );
      const emailInput = document.querySelector("input[name='Student[email]']");
      const yearInput = document.querySelector("input[name='Student[year]']");
      const coursenameInput = document.querySelector(
        "input[name='Student[coursename]']"
      );

      // Check if all required fields are filled
      if (
        !nameInput.value ||
        !mobileInput.value ||
        !emailInput.value ||
        !yearInput.value ||
        !coursenameInput.value
      ) {
        alert("Please fill in all the required fields.");
        event.preventDefault();
      }
    });
  function removeCoupon() {
    const couponInput = document.getElementById("coupon");
    const couponMessage = document.getElementById("couponMessage");
    const appliedCoupon = document.getElementById("appliedCoupon");
    const couponSpan = document.querySelector(".coupon-apply-span");
    const discountedPrice = document.getElementById("discountedPrice");

    // Clear coupon input field
    couponInput.value = "";
    // Hide applied coupon and discounted price
    appliedCoupon.style.display = "none";
    /*if (couponSpan) {
      couponSpan.style.display = "none";
    }*/
    // Clear coupon message
    couponMessage.style.display = "none";
  }
  // Event listener for apply coupon button
</script>

<!-- *************************************admin dashboard -->

<% layout('./layouts/dash_boil.ejs') %>

<style>
  .earnings {
    display: flex;
    align-items: center;
    font-weight: 600;
    gap: 10px;
    font-size: 32px;
  }
</style>

<!-- Dashboard Content Start -->
<div class="dashboard-content">
  <div class="container">
    <h4 class="dashboard-title">Dashboard</h4>

    <!-- Dashboard Info Start -->
    <div class="dashboard-info">
      <div class="row gy-2 gy-sm-6">
        <div class="col-md-4 col-sm-6">
          <!-- Dashboard Info Card Start -->
          <div class="dashboard-info__card">
            <a class="dashboard-info__card-box" href="#">
              <div class="dashboard-info__card-icon icon-color-02">
                <i class="edumi edumi-streaming"></i>
              </div>
              <div class="dashboard-info__card-content">
                <div
                  class="dashboard-info__card-value-active dashboard-info__card-value"
                  data-target="<%= admin.courses.length%>"
                >
                  0
                </div>
                <div class="dashboard-info__card-heading">Active Courses</div>
              </div>
            </a>
          </div>
          <!-- Dashboard Info Card End -->
        </div>

        <div class="col-md-4 col-sm-6">
          <!-- Dashboard Info Card Start -->
          <div class="dashboard-info__card">
            <div class="dashboard-info__card-box">
              <div class="dashboard-info__card-icon icon-color-04">
                <i class="edumi edumi-group"></i>
              </div>
              <div class="dashboard-info__card-content">
                <div
                  class="dashboard-info__card-value-stu dashboard-info__card-value"
                  data-target="<%= admin.students.length%>"
                >
                  0
                </div>
                <div class="dashboard-info__card-heading">Total Students</div>
              </div>
            </div>
          </div>
          <!-- Dashboard Info Card End -->
        </div>
        <div class="col-md-4 col-sm-6">
          <!-- Dashboard Info Card Start -->
          <div class="dashboard-info__card">
            <div class="dashboard-info__card-box">
              <div class="dashboard-info__card-icon icon-color-05">
                <i class="edumi edumi-user-support"></i>
              </div>
              <div class="dashboard-info__card-content">
                <div
                  class="dashboard-info__card-value-crs dashboard-info__card-value"
                  data-target="<%= admin.coupons.length%>"
                >
                  0
                </div>
                <div class="dashboard-info__card-heading">Total Coupons</div>
              </div>
            </div>
          </div>
          <!-- Dashboard Info Card End -->
        </div>
        <div class="col-md-4 col-sm-6">
          <!-- Dashboard Info Card Start -->
          <div class="dashboard-info__card">
            <div class="dashboard-info__card-box">
              <div class="dashboard-info__card-icon icon-color-06">
                <i class="edumi edumi-coin"></i>
              </div>
              <div class="dashboard-info__card-content">
                <div class="earnings">
                  <div class="earn">₹</div>
                  <div
                    class="dashboard-info__card-value-crs dashboard-info__card-value"
                    data-target="<%= admin.earnings%>"
                  >
                    0
                  </div>
                </div>
                <div class="dashboard-info__card-heading">Total Earnings</div>
              </div>
            </div>
          </div>
          <!-- Dashboard Info Card End -->
        </div>
      </div>
    </div>
    <!-- Dashboard Info End -->

  </div>
</div>
<!-- Dashboard Content End -->

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const valueElements = document.querySelectorAll(
      "[class^='dashboard-info__card-value']"
    );

    valueElements.forEach((element) => {
      const startValue = parseInt(element.textContent.trim());
      const targetValue = parseInt(element.dataset.target); // Read target value from data attribute
      const duration = 2000; // duration of animation in milliseconds
      const increment = Math.ceil((targetValue - startValue) / (duration / 16)); // 60fps

      let currentValue = startValue;
      const interval = setInterval(() => {
        currentValue += increment;
        if (
          (increment > 0 && currentValue >= targetValue) ||
          (increment < 0 && currentValue <= targetValue)
        ) {
          currentValue = targetValue;
          clearInterval(interval);
        }
        element.textContent = currentValue;
      }, 20); // 60fps
    });
  });
</script>

<!-- *********************************************************************** client -->

<div class="card-container">
  <% for(let course of allCourses) { %>
  <div class="course-card">
    <div class="course-card-img">
      <img src="<%= course.image %>" alt="<%= course.title %>" />
    </div>
    <div class="course-card-content">
      <h4><%= course.title %></h4>
      <p class="card-text-price">₹ <%= course.price %></p>
      <p class="card-text-discount">
        Discounted price: ₹ <%= course.discounted_price %>
      </p>
      <div class="card-btn">
        <% if(course.details) {%>
        <a href="<%= course.details %>" class="btn">Details</a>
        <% } %>
        <a href="/<%= course._id %>/details" class="btn">Buy Now</a>
      </div>
    </div>
  </div>
  <% } %>
</div>
