# Let's enhance the README.md to make every command directly copyable and clearly separated.
# The goal is to make it copy-paste friendly for each use case.

readme_full_commands = """
# HER Website 🧠🎨

This is a personal static website project served using Docker + Nginx.  
It supports live development via Docker volumes — so you can update your code and see changes instantly.

---

## 📦 Requirements

- Docker Desktop for **Windows**, **macOS**, or **Linux**
- A code editor like **VS Code**
- Optional: Git (if you're using GitHub)

---

## 🚀 Quick Start (Live Development Using Docker Volumes)

### 📍 Run your website in Docker (live mode — no rebuilds needed)

#### ▶️ PowerShell (Windows)
```powershell
docker run -d `
  -p 8080:80 `
  --name Malak-dev `
  -v ${PWD}:/usr/share/nginx/html `
  nginx:alpine
