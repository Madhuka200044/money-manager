# 💸 Money Manager

A modern full-stack **Money Manager application** to track income, expenses, and gain better control over personal finances.

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-76.1%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-14.1%25-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-0.3%25-E34F26?style=for-the-badge&logo=html5&logoColor=white)

**Full-stack personal finance tracker with clean backend-frontend architecture**

---

## ✨ Overview

**Money Manager** is a full-stack application designed to help users manage their daily finances by tracking income and expenses in a simple and structured way. Built with Java backend and JavaScript frontend, it demonstrates clean separation of concerns and RESTful API design.

---

## 🎬 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Madhuka200044/money-manager.git
cd money-manager

# 2. Start the backend (requires Java 17+ and Maven)
cd backend
mvn spring-boot:run

# 3. Open the frontend
# Open frontend/index.html in your browser
# Or use: python -m http.server 8000
```

**Backend**: `http://localhost:8080`  
**Frontend**: `http://localhost:8000` (or open index.html directly)

---

## 🚀 Features

### Core Functionality
- 📥 **Add transactions** - Record income and expenses
- 🗂️ **Categorization** - Organize by custom categories
- ✏️ **Edit & delete** - Modify existing entries
- 🔍 **Filter & search** - Find specific transactions

### Technical Features
- 🔒 **RESTful API** - Clean backend architecture
- 📱 **Responsive design** - Works on all devices
- 💾 **Data persistence** - SQL database integration
- 🧩 **Modular code** - Easy to extend and maintain

---

## 🏗️ Architecture

```
money-manager/
├── backend/           # Spring Boot REST API
│   ├── src/main/java # Java source code
│   ├── pom.xml       # Maven configuration
│   └── application.properties
├── frontend/         # HTML/CSS/JavaScript UI
│   ├── index.html    # Main interface
│   ├── css/          # Stylesheets
│   └── js/           # Client-side logic
└── README.md         # This file
```

### Technology Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Java 17+, Spring Boot | REST API, business logic |
| **Frontend** | HTML5, CSS3, Vanilla JS | User interface |
| **Build Tool** | Maven | Dependency management |
| **API** | RESTful | Communication layer |

---

## 🔌 API Reference

### Base URL
```
http://localhost:8080/api
```

### Key Endpoints
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/transactions` | Get all transactions |
| `GET` | `/transactions/{id}` | Get specific transaction |
| `POST` | `/transactions` | Add new transaction |
| `PUT` | `/transactions/{id}` | Update transaction | Same as POST |
| `DELETE` | `/transactions/{id}` | Delete transaction |
| `GET` | `/summary` | Get financial summary |

---

## 🛠️ Development

### Prerequisites
- **Java 17 or higher**
- **Maven 3.6+**
- **Modern web browser** (Chrome, Firefox, Edge)

### Building from Source
```bash
# Backend
cd backend
mvn clean package
# Output: target/money-manager-*.jar

# Frontend
cd frontend
# No build step needed for vanilla JS
```

### Running Tests
```bash
cd backend
mvn test
```

---

## 📈 Future Enhancements

### Priority Features
- 🔐 **User authentication** - Individual accounts
- 📊 **Visual analytics** - Charts and graphs
- 📱 **Mobile app** - React Native or Flutter
- 🔄 **Data export** - CSV/PDF reports

### Technical Improvements
- 🧪 **Unit & integration tests** - Improve test coverage
- 🐳 **Docker support** - Easy deployment
- 🔍 **Advanced filtering** - Date ranges, categories
- 🌐 **Multi-language support** - Internationalization

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

Please ensure your code follows the existing style and includes appropriate tests.

---

## 👨‍💻 Author

**Madhuka Weerathunga**  
💼 Full-stack Developer | 💻 Passionate about clean code & practical applications  
🔗 GitHub: [Madhuka200044](https://github.com/Madhuka200044)  
📧 Contact: www.linkedin.com/in/dulan-madhuka-weerathunga-9090692b1



---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` file for more information.

---

## 🙏 Acknowledgments

- Icons from [Font Awesome](https://fontawesome.com)
- Badges from [Shields.io](https://shields.io)
- Inspired by practical finance management needs
- Built with ❤️ and lots of ☕
