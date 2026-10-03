# Contributing to Commuto

Thank you for your interest in contributing to **Commuto**! We welcome contributions from developers of all skill levels to help make urban commuting smarter, safer, and more sustainable.

---

## 📋 Code of Conduct

By participating in this project, you agree to uphold a welcoming, respectful, and harassment-free environment for all contributors.

---

## 🛠️ How to Contribute

### 1. Fork and Clone the Repository

```bash
git clone https://github.com/ananyajain327/Commuto.git
cd Commuto
```

### 2. Create a Feature Branch

Use standard semantic naming conventions:
- `feat/feature-name` for new features
- `fix/bug-name` for bug fixes
- `refactor/component-name` for refactoring
- `docs/doc-update` for documentation changes

```bash
git checkout -b feat/my-new-feature
```

### 3. Local Development Setup

#### Backend (Spring Boot 3.4 & Java 21)
```bash
cd backend
./mvnw spring-boot:run
```
To run tests:
```bash
./mvnw test
```

#### Frontend (Next.js 16 & TypeScript)
```bash
cd frontend
npm install
npm run dev
```
To verify code quality and builds:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## 🧪 Commit & Quality Guidelines

1. **Commit Messages**: Follow Conventional Commits:
   - `feat: add women-only ride preference toggle`
   - `fix: correct razorpay order signature verification`
   - `docs: update deployment and architecture diagrams`
2. **Lint & Test Before Pushing**:
   - Ensure `npm run lint` and `npx tsc --noEmit` pass with **0 errors and 0 warnings**.
   - Ensure `./mvnw test` passes all backend unit and integration tests.
3. **Keep PRs Focused**: Address one feature or bug per Pull Request.

---

## 🚀 Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/my-new-feature
   ```
2. Open a Pull Request against the `main` branch of `ananyajain327/Commuto`.
3. Provide a clear description of the changes, screenshots (if UI changes are involved), and ensure CI checks pass.
4. Maintainers will review and provide constructive feedback promptly!

---

## 💬 Questions & Support

Feel free to open an issue for questions, feature proposals, or feedback!
