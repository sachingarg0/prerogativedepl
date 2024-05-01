const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejsmate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const CourseRouter = require("./Routes/Courses.js");
const clientRouter = require("./Routes/Client.js");
const CouponRouter = require("./Routes/Coupons.js");
const { DateTime } = require("luxon");
const flash = require("connect-flash");
const Coupons = require("./Models/Coupon.js");
const Courses = require("./Models/course_listing.js");
const { coupons_data } = require("./Data/Coupons.js");
const User = require("./Models/User.js");
const Student = require("./Models/Student.js");
const Admin = require("./Models/admin.js");
const passport = require("passport");
const dotenv = require("dotenv");
const axios = require("axios");
const uniqid = require("uniqid");
const sha256 = require("sha256");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const {
  initializingPassport,
  isAuthenticated,
} = require("./passportConfig.js");

const expressSession = require("express-session");

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
dotenv.config({ path: "./config.env" });
const MONGO_URL = process.env.MONGOURL;

// ****** Testing Gateway **********
const PHONE_PE_HOST_URL = "https://api.phonepe.com/apis/hermes";
const MERCHANT_ID = "PREROGATIVEONLINE";
const SALT_INDEX = 1;
const SALT_KEY = "20ee4b79-c225-459f-afba-bdf797f45cda";

main()
  .then(() => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//! Passport
initializingPassport(passport);
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/admin", isAuthenticated, CourseRouter);
app.use("/", clientRouter);
app.use("/admin", CouponRouter);

// app.get("/register", async (req, res) => {
//   res.render("register");
// });

app.get("/login", async (req, res) => {
  res.render("login");
});

// Set up middleware to make req.user available across routes

//! ----------- Email Sending ----------
// const html = `
// <h1>Hello Client</h1>
// <p>Check your bill</p>
// `;

//! app.get("/mail", async (req, res) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // Use `true` for port 465, `false` for all other ports
//       auth: {
//         user: "manan27bhasin@gmail.com",
//         pass: "nzsg lien pykp bywr ",
//       },
//     });

//     const mailOptions = {
//       from: {
//         name: "Prerogative",
//         address: "manan27bhasin@gmail.com",
//       }, // sender address
//       to: "malujalove9@gmail.com, kashishmukheja7@gmail.com, manan1869.be22@chitkara.edu.in", // list of receivers
//       subject: "Check your generated invoice", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//       attachments: [
//         {
//           filename: "test.pdf",
//           path: path.join(__dirname, "test.pdf"),
//           contentType: "application/pdf",
//         },
//         {
//           filename: "check_image.jpg",
//           path: path.join(__dirname, "check_image.jpg"),
//           contentType: "application/jpg",
//         },
//       ],
//     };

//     const sendMail = async (transporter, mailOptions) => {
//       try {
//         await transporter.sendMail(mailOptions);
//         console.log("Email has been sent!");
//         res.send("Email has been sent!");
//       } catch (err) {
//         console.error(err);
//         res.status(500).send("An error occurred while sending the email");
//       }
//     };

//     sendMail(transporter, mailOptions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred");
//   }
// });

//! ------------ Email End ------------
//! For User SignUp

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/admin",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/admin/dash", async (req, res) => {
  const admin = await Admin.findOne();
  res.render("dashboard.ejs", { admin });
});

app.get("/admin/profile", (req, res) => {
  res.render("profile.ejs");
});

app.get("/admin/mycourses", async (req, res) => {
  let allCourses = await Courses.find({});
  res.render("mycourses.ejs", { allCourses });
});

// ***** Manage Admins *********
app.get("/admin/adminusers", async (req, res) => {
  const users = await User.find({ role: "admin" });
  res.render("adminusers.ejs", { users });
});

app.get("/admin/createadmin", (req, res) => {
  res.render("createadmin.ejs");
});

app.get("/admin/mystudents", async (req, res) => {
  try {
    // Find the admin document and populate the students field
    const admin = await Admin.findOne({}); // Assuming you want to find the first admin document
    await admin.populate("students");

    const allStudents = admin.students.map((student) => {
      return {
        name: student.name,
        email: student.email,
        year: student.year,
        coursename: student.coursename,
        createdAt: student.createdAt,
        mobile: student.mobile,
        // Add other fields you want to extract from the student object
      };
    });

    // Render the EJS file and pass the student information as a local variable
    res.render("mystudents.ejs", { allStudents });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Client Side Rendering
app.get("/:id/details", async (req, res) => {
  let { id } = req.params;
  const Course = await Courses.findById(id);
  const discountedPrice = Course.discounted_price;
  res.cookie("discountedPrice", discountedPrice, {
    maxAge: 24 * 60 * 60 * 1000,
  });
  let couponName = NaN;
  res.render("Client_next.ejs", { Course, discountedPrice, couponName });
});

app.post("/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const Course = await Courses.findById(id);
    const couponName = req.body.Coupon;
    const checkcoup = await Coupons.findOne({ Name: couponName });

    if (couponName) {
      if (checkcoup) {
        if (checkcoup.coupon_valid_from > Date.now()) {
          req.flash("error", "Your Coupon can not be accessed");
          return res.redirect(`/${id}/details`);
        }
        if (checkcoup.Coupon_qty <= 0) {
          req.flash("error", "Your Coupon has been exhausted");
          return res.redirect(`/${id}/details`);
        }

        const expiryDate = DateTime.fromJSDate(checkcoup.coupon_valid);
        const today = DateTime.now();

        if (expiryDate <= today) {
          req.flash("error", "Coupon has Expired");
          return res.redirect(`/${id}/details`);
        }

        if (!checkcoup.course.includes(id)) {
          req.flash("error", "Your Coupon is not Associated With this Course");
          return res.redirect(`/${id}/details`);
        }
      }

      const Coupon = await Coupons.findOne({ Name: couponName });
      if (!Coupon) {
        req.flash("error", "Invalid Coupon Name");
        return res.redirect(`/${id}/details`);
      }

      const discountedPrice =
        (1 - Coupon.Discount / 100) * Course.discounted_price;

      res.cookie("coupon", couponName, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("discountedPrice", discountedPrice, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.render("Client_next.ejs", {
        Course,
        discountedPrice, // Pass discountedPrice
        couponName,
        error: null, // Pass null for error
      });
    } else {
      const discountedPrice = Course.discounted_price;

      res.cookie("coupon", couponName, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("discountedPrice", discountedPrice, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.render("Client_next.ejs", {
        Course,
        discountedPrice, // Pass discountedPrice
        couponName,
        error: null, // Pass null for error
      });
    }
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:id/details/payment", (req, res) => {
  res.render("checkout.ejs");
});

app.post("/:id/details/payment", async (req, res) => {
  try {
    // Create a new student
    const student = new Student(req.body.Student);
    const savedStudent = await student.save();

    // Retrieve the coupon name from the cookie
    const couponName = req.cookies.coupon;
    const discountedPrice = req.cookies.discountedPrice;

    // Find and decrement the coupon quantity
    const updatedCoupon = await Coupons.findOneAndUpdate(
      { Name: couponName },
      { $inc: { Coupon_qty: -1 } }, // Decrement the count by 1
      { new: true } // Return the updated document
    );

    // Update admin earnings
    const updatedAdmin = await Admin.findOneAndUpdate(
      {},
      {
        $inc: { earnings: discountedPrice },
        $push: { students: savedStudent._id },
      }, // Push the student's ID to the students array
      { new: true }
    );

    // Render checkout page
    res.render("checkout.ejs");
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define function to create HTML email content with dynamic values
function generateEmailContent(amount, name, mobileNumber, coupon) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        h2 {
          color: #333;
        }
        p {
          margin: 10px 0;
        }
        .invoice-info {
          margin-top: 20px;
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
        }
        .invoice-info p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Invoice</h2>
        <p>Dear ${name},</p>
        <p>We're pleased to inform you that your invoice has been generated successfully:</p>
        <div class="invoice-info">
          <p>Amount: ${amount}</p>
          <p>Name: ${name}</p>
          <p>Mobile Number: ${mobileNumber}</p>
          <p>Coupon: ${coupon}</p>
          <!-- Add more invoice details as needed -->
        </div>
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;
}

// // Example route to send email
// app.get("/test", (req, res) => {
//   // Retrieve user's details from cookies
//   const amount = req.cookies.discountedPrice || "N/A";
//   const name = "Love" || "N/A";
//   const mobileNumber = req.cookies.mobile || "N/A";
//   const coupon = req.cookies.coupon || "N/A";

//   // Create a transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "manan27bhasin@gmail.com", // your email address
//       pass: "nzsg lien pykp bywr", // your email password
//     },
//   });

//   // Setup email data
//   let mailOptions = {
//     from: '"Your Company" <sender@example.com>', // sender address
//     to: "mananbhasin5657@gmail.com,malujalove9@gmail.com", // recipient address
//     subject: "Invoice Notification", // Subject line
//     html: generateEmailContent(amount, name, mobileNumber, coupon), // HTML email content with dynamic values
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error sending email:", error);
//       res.status(500).send("Failed to send email");
//     } else {
//       console.log("Email sent:", info.response);
//       res.status(200).send("Email sent successfully");
//     }
//   });
// });

app.get("/test", (req, res) => {
  res.render("test.ejs");
});

//*********************** PAYMENT ***************** */
app.post("/pay", async (req, res) => {
  try {
    const payEndpoint = "/pg/v1/pay";
    const merchantTransactionId = uniqid();
    const userId = 123;
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: req.cookies.discountedPrice * 100, // In paise
      name: req.cookies.name,
      redirectUrl: `http://localhost:3000/redirect-url/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: req.cookies.mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // SHA256(base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index

    const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
    const base64EncodedPayload = bufferObj.toString("base64");

    const xVerify =
      sha256(base64EncodedPayload + payEndpoint + SALT_KEY) +
      "###" +
      SALT_INDEX;

    const options = {
      method: "POST",
      url: `${PHONE_PE_HOST_URL}${payEndpoint}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
      data: {
        request: base64EncodedPayload,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const url = response.data.data.instrumentResponse.redirectInfo.url;
        // res.json({ url: url });
        // res.send(url);
        // return res.redirect(url);
        // res.redirect(url);
        // Send HTML response with styled JSON data and copy button
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Payment URL</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f7f7f7;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              h1 {
                font-size: 24px;
                margin-bottom: 20px;
              }
              pre {
                background-color: #f3f3f3;
                padding: 10px;
                border-radius: 4px;
                overflow-x: auto;
              }
              .copy-button {
                margin-top: 10px;
                padding: 8px 16px;
                background-color: #4caf50;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              }
              .copy-button:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Payment URL</h1>
              <p>Copy the following URL to proceed with the payment:</p>
              <pre id="url">${url}</pre>
              <button class="copy-button" onclick="copyUrl()">Copy URL</button>
            </div>
            <script>
              function copyUrl() {
                var urlElement = document.getElementById('url');
                var range = document.createRange();
                range.selectNode(urlElement);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                alert('URL copied to clipboard!');
              }
            </script>
          </body>
          </html>
        `);
      })
      .catch(function (error) {
        res.send("false");

        console.error(error);
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

app.post("/redirect-url/:merchantTransactionId", async (req, res) => {
  const { merchantTransactionId } = req.params;
  console.log(merchantTransactionId);
  if (merchantTransactionId) {
    const xVerify =
      sha256(
        `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY
      ) +
      "###" +
      SALT_INDEX;
    const options = {
      method: "GET",
      url: `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-MERCHANT-ID": MERCHANT_ID,
        "X-VERIFY": xVerify,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          // Retrieve user's details from cookies
          const amount = req.cookies.discountedPrice || "N/A";
          const name = req.cookies.name || "N/A";
          const mobileNumber = req.cookies.mobile || "N/A";
          const coupon = req.cookies.coupon || "N/A";

          // Create a transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "manan27bhasin@gmail.com", // your email address
              pass: "nzsg lien pykp bywr", // your email password
            },
          });

          // Setup email data
          let mailOptions = {
            from: '"Your Company" <sender@example.com>', // sender address
            to: `${req.cookies.email}`, // recipient address
            subject: "Invoice Notification", // Subject line
            html: generateEmailContent(amount, name, mobileNumber, coupon), // HTML email content with dynamic values
          };

          // Send email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending email:", error);
              res.status(500).send("Failed to send email");
            } else {
              console.log("Email sent:", info.response);
              res.status(200).send("Email sent successfully");
            }
          });
        } else {
          console.log("   ********************** ===>   ", response.data);
        }
      })
      .catch((error) => {
        res.json(error);
      });
  } else {
    res.send({ error: "Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App is listening to port");
});
