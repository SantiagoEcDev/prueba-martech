const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const salt = 10;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prueba",
});

const upload = multer({ dest: "uploads/" }); // Configura el multer para guardar archivos en la carpeta 'uploads'

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(403).json({ Error: "Token is not correct" });
      } else {
        console.log("Decoded JWT:", decoded);
        req.userId = decoded.userId;
        next();
      }
    });
  }
};

// Ruta protegida
app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

// Registro de usuario
app.post("/register", (req, res) => {
  const sql = "INSERT INTO user (name, email, password) VALUES (?)";

  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error hashing password" });
    const values = [req.body.name, req.body.email, hash];

    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inserting data Error in server" });
      return res.json({ Status: "Success" });
    });
  });
});

// Inicio de sesión
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password compare error" });
          if (response) {
            const name = data[0].name;
            const userId = data[0].id; // Obtiene el ID de user
            const token = jwt.sign({ name, userId }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token, { httpOnly: true, secure: false }); 
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "Password not matched" });
          }
        }
      );
    } else {
      return res.json({ Error: "Email does not exist" });
    }
  });
});

// Obtener cursos del usuario
app.get("/courses", verifyUser, (req, res) => {
  const userId = req.userId; // Use el id del request
  const sql = "SELECT * FROM courses WHERE created_by = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching courses" });
    }
    res.json(results);
  });
});

app.post("/add-course", verifyUser, (req, res) => {
  const { name, faculty, description } = req.body;
  const userId = req.userId; // Extrae el ID del usuario autenticado

  if (!name || !faculty) {
    return res
      .status(400)
      .json({ error: "El nombre y la facultad son requeridos." });
  }

  const sql =
    "INSERT INTO courses (name, faculty, description, created_by) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, faculty, description, userId], (err, result) => {
    if (err) {
      console.error("Error al agregar curso:", err.message);
      return res.status(500).json({ error: "Error al agregar curso" });
    }
    res.json({ message: "Curso creado exitosamente" });
  });
});

// Ruta para cargar cursos desde un archivo Excel
app.post("/upload-courses", upload.single("file"), verifyUser, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ Error: "No file uploaded" });
  }

  try {
    // Leer el archivo Excel
    const filePath = path.join(__dirname, req.file.path);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Eliminar el archivo después de procesarlo
    fs.unlinkSync(filePath);

    // Crear una lista de cursos a insertar
    const coursesToInsert = [];
    const checkExistingCourses = (course, callback) => {
      const sql =
        "SELECT * FROM courses WHERE name = ? AND faculty = ? AND created_by = ?";
      db.query(
        sql,
        [course.name, course.faculty, req.userId],
        (err, results) => {
          if (err) return callback(err);
          if (results.length === 0) {
            coursesToInsert.push([
              course.name || "", // Proporcionar valor predeterminado si está vacío
              course.faculty || "",
              course.description || "",
              req.userId,
            ]);
          }
          callback();
        }
      );
    };

    // Procesar cada curso en el archivo Excel
    const processCourses = (index) => {
      if (index < data.length) {
        checkExistingCourses(data[index], (err) => {
          if (err)
            return res
              .status(500)
              .json({ Error: "Error checking existing courses" });
          processCourses(index + 1);
        });
      } else {
        // Insertar cursos que no existen en la base de datos
        if (coursesToInsert.length > 0) {
          const sql =
            "INSERT INTO courses (name, faculty, description, created_by) VALUES ?";
          db.query(sql, [coursesToInsert], (err, result) => {
            if (err) {
              console.error("Error al cargar cursos:", err);
              return res.status(500).json({ Error: "Error al cargar cursos" });
            }
            res.json({ message: "Cursos cargados exitosamente" });
          });
        } else {
          res.json({ message: "No hay nuevos cursos para cargar" });
        }
      }
    };

    processCourses(0);
  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    res.status(500).json({ Error: "Error al procesar el archivo Excel" });
  }
});

app.get("/profile", verifyUser, (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ Error: "User ID not found" });
  }

  const sql = "SELECT name, email FROM user WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener la información personal:", err.message);
      return res
        .status(500)
        .json({ Error: "Error fetching profile data", details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }
    res.json(results[0]);
  });
});

app.put("/profile", verifyUser, (req, res) => {
  const userId = req.userId;
  const { name, email, description } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ Error: "Nombre y correo electrónico son requeridos" });
  }

  const sql =
    "UPDATE user SET name = ?, email = ?, description = ? WHERE id = ?";

  db.query(sql, [name, email, description, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar la información personal:", err);
      return res
        .status(500)
        .json({
          Error: "Error al actualizar la información personal",
          details: err.message,
        });
    }
    res.json({ Status: "Perfil actualizado correctamente" });
  });
});

app.put("/change-password", verifyUser, async (req, res) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;

  // Validar que se proporcionaron las contraseñas
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ Error: "Contraseña actual y nueva contraseña son requeridas" });
  }

  try {
    // Consultar la contraseña actual del usuario
    db.query("SELECT password FROM user WHERE id = ?", [userId], async (err, result) => {
      if (err) {
        console.error("Error en la consulta de la base de datos:", err);
        return res.status(500).json({ Error: "Error en la consulta de la base de datos", details: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ Error: "Usuario no encontrado" });
      }

      const hashedOldPassword = result[0].password;

      // Comparar la contraseña actual proporcionada con la almacenada
      const match = await bcrypt.compare(oldPassword, hashedOldPassword);
      if (!match) {
        return res.status(400).json({ Error: "Contraseña actual incorrecta" });
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Actualizar la contraseña en la base de datos
      db.query("UPDATE user SET password = ? WHERE id = ?", [hashedNewPassword, userId], (err) => {
        if (err) {
          console.error("Error al actualizar la contraseña:", err);
          return res.status(500).json({ Error: "Error al actualizar la contraseña", details: err.message });
        }
        res.json({ Status: "Contraseña actualizada correctamente" });
      });
    });
  } catch (err) {
    console.error("Error al cambiar la contraseña:", err);
    res.status(500).json({ Error: "Error al cambiar la contraseña", details: err.message });
  }
});


  app.put("/courses/:id", verifyUser, async (req, res) => {
    const courseId = req.params.id;
    const { name, faculty, description } = req.body;
  
    const sql = "UPDATE courses SET name = ?, faculty = ?, description = ? WHERE id = ?";
  
    db.query(sql, [name, faculty, description, courseId], (err) => {
      if (err) {
        console.error("Error al actualizar el curso:", err);
        return res.status(500).json({ message: "Error al actualizar el curso" });
      }
      res.json({ Status: "Curso actualizado correctamente" });
    });
  });

  app.delete('/courses/:id', verifyUser, async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
  
    try {
      const result = await db.query('DELETE FROM courses WHERE id = ? AND created_by = ?', [id, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Curso no encontrado o no autorizado' });
      }
  
      res.json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      res.status(500).json({ message: 'Error al eliminar el curso' });
    }
  });
  


// Cierre de sesión
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.listen(8081, () => {
  console.log("Running on 8081");
});