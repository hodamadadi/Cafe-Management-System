const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

dotenv.config();
const saltRounds = 10;
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Signup route
router.post("/signup", async (req, res) => {
  const { name, contactNumber, email, password } = req.body;

  if (!name || !contactNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const query = "SELECT email FROM user WHERE email=?";
    const [results] = await connection.query(query, [email]); // Awaiting the promise

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertQuery =
      "INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
    await connection.query(insertQuery, [
      name,
      contactNumber,
      email,
      hashedPassword,
    ]);
    res.status(200).json({ message: "Successfully registered!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Database query error", error: err });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const query =
      "SELECT email, password, role, status FROM user WHERE email=?";

    // Use the connection to execute the query
    const [results] = await connection.query(query, [email]);

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const user = results[0];

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    if (user.status === "false") {
      return res.status(401).json({ message: "Wait for admin approval" });
    }

    const response = { email: user.email, role: user.role };
    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "8h",
    });

    res.status(200).json({ token: accessToken });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// //forget password
// router.post("/forgotPassword", (req, res) => {
//   const user = req.body;
//   query = "select email, password from user where email=?";
//   connection.query(query, [user.email], (err, results) => {
//     if (!err) {
//       if (results.length <= 0) {
//         return res
//           .status(200)
//           .json({ message: "Please sent successfully to your email." });
//       } else {
//         var mailOptions = {
//           form: process.env.Email,
//           to: results[0].email,
//           subject: "Password by Cafe Management System.",
//           html:
//             "<p> <b> Your Login details for Cafe Management System </b> <br> <b> Email: </b>" +
//             results[0].email +
//             "<br> <b> Password: </b>" +
//             results[0].password +
//             '<br><a href= "http://localhost:4200/">Click here to login </a> </p>',
//         };
//         // transporter.sendMail(mailOptions, function (error, info) {
//         //   if (err) {
//         //     console.log(error);
//         //   } else {
//         //     console.log("Email sent:" + info.response);
//         //   }
//         // });
//         return results
//           .results(200)
//           .json({ message: "Password sent Successfully to your email." });
//       }
//     } else {
//       return res.status(500).json(err);
//     }
//   });
// });
router.post("/forgotPassword", (req, res) => {
  console.log("Request received:", req.body);
  const user = req.body;

  // Check if email is provided in the request
  if (!user.email) {
    console.log("Email is required."); // Log for missing email
    return res.status(400).json({ message: "Email is required." });
  }

  // Database query to find the user by email
  const query = "SELECT email, password FROM user WHERE email=?";
  connection.query(query, [user.email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error occurred." });
    }

    // Check if the user was found
    if (results.length <= 0) {
      console.log("Email not found.");
      return res.status(404).json({ message: "Email not found." });
    } else {
      console.log("User found, preparing to send email.");
      // Email options
      const mailOptions = {
        from: process.env.Email,
        to: results[0].email,
        subject: "Password by Cafe Management System.",
        html: `
          <p><b>Your Login details for Cafe Management System</b><br>
          <b>Email:</b> ${results[0].email}<br>
          <b>Password:</b> ${results[0].password}<br>
          <a href="http://localhost:4200/">Click here to login</a></p>
        `,
      };
      //Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send email." });
        } else {
          console.log("Email sent:", info.response);
          return res
            .status(200)
            .json({ message: "Password sent successfully to your email." });
        }
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send email." });
        } else {
          console.log("Email sent:", info.response);
          return res
            .status(200)
            .json({ message: "Password sent successfully to your email." });
        }
      });
    }
  });
});
// Get Users route
router.get("/get", async (req, res) => {
  const query =
    "SELECT id, name, email, contactNumber, status FROM user WHERE role = 'user'";

  try {
    console.log("Fetching users..."); // Log when fetching users
    const [results] = await connection.query(query); // No need for connection.promise() if using promise pool

    if (results.length === 0) {
      // Return an empty array if no users are found
      return res.status(200).json([]);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Database query error:", err); // Log the error details
    return res.status(500).json({
      error: "An error occurred while fetching users.",
      details: err.message, // Include detailed error message
    });
  }
});

// Update User Status route
// router.patch(
//   "/update",
//   auth.authenticateToken,
//   checkRole.checkRole,
//   async (req, res) => {
//     const { status, id } = req.body;

//     if (!status || !id) {
//       return res.status(400).json({ message: "Status and ID are required" });
//     }

//     try {
//       const query = "UPDATE user SET status=? WHERE id=?";
//       const results = await connection.query(query, [status, id]);

//       if (results.affectedRows === 0) {
//         return res.status(404).json({ message: "User ID does not exist" });
//       }
//       res.status(200).json({ message: "User updated successfully" });
//     } catch (err) {
//       res.status(500).json({ message: "Database query error", error: err });
//     }
//   }
// );
router.patch("/update", (req, res) => {
  let user = req.body;

  // Log the incoming request data for debugging
  console.log("Incoming request data:", user);

  // Ensure id and status are present
  if (!user.id || !user.status) {
    return res.status(400).json({ message: "User ID and status are required" });
  }

  var query = "UPDATE user SET status=? WHERE id=?";
  connection.query(query, [user.status, user.id], (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log any database errors
      return res.status(500).json({ message: "Database error", error: err });
    }

    // Check if the update affected any rows
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User ID does not exist" });
    }

    return res.status(200).json({ message: "User updated successfully!" });
  });
});

// Check Token route
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Change Password route
router.post("/changePassword", auth.authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const email = res.locals.email;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old and new passwords are required" });
  }

  try {
    const query = "SELECT * FROM user WHERE email=?";
    const [results] = await connection.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, results[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password!" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    const updateQuery = "UPDATE user SET password=? WHERE email=?";
    await connection.query(updateQuery, [hashedNewPassword, email]);

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error updating password:", err); 
    res.status(500).json({ message: "Error updating password", error: err });
  }
});

module.exports = router;
