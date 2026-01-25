# ToDoList - Aplikacja do Zarządzania Zadaniami

Aplikacja ToDoList składa się z trzech głównych komponentów:
- **Frontend**: React + Vite (port 3000)
- **Backend**: FastAPI + Python (port 8000)
- **Monitoring**: Prometheus (port 9090) + Grafana (port 3001)

---

## 📋 Spis Treści

1. [Testowanie za pomocą Docker](#-testowanie-za-pomocą-docker-zalecane)
2. [Testowanie Lokalne](#-testowanie-lokalne)
3. [Dostęp do Aplikacji](#-dostęp-do-aplikacji)
4. [Rozwiązywanie Problemów](#-rozwiązywanie-problemów)

---

## 🐳 Testowanie za pomocą Docker (Zalecane)

### Jak to działa?

W Docker Compose, **port 3000 udostępnia całą aplikację**:
- Frontend (React) jest serwowany przez Nginx
- Żądania do `/api/*` są automatycznie przekierowywane do backendu (FastAPI) przez Nginx proxy
- Wszystkie serwisy komunikują się przez wewnętrzną sieć Docker (`todo-net`)

**Oznacza to, że wystarczy otworzyć `http://localhost:3000` aby korzystać z pełnej aplikacji!**

> **Uwaga**: Port 8000 jest również dostępny dla bezpośredniego dostępu do API (np. do testowania przez Postman lub przeglądania dokumentacji Swagger).

### Wymagania

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) zainstalowany i uruchomiony
- Docker Compose (zazwyczaj dołączony do Docker Desktop)

### Kroki

1. **Sklonuj repozytorium** (jeśli jeszcze tego nie zrobiono):
   ```bash
   git clone <url-repozytorium>
   cd ToDoList
   ```

2. **Uruchom wszystkie serwisy za pomocą Docker Compose**:
   ```bash
   docker-compose up --build
   ```

   > **Uwaga**: Flaga `--build` zapewnia, że obrazy zostaną przebudowane z najnowszym kodem.

3. **Weryfikacja uruchomienia**:
   
   Po uruchomieniu powinieneś zobaczyć logi z wszystkich serwisów:
   - `frontend_1` - serwer Nginx
   - `backend_1` - serwer Uvicorn
   - `prometheus_1` - Prometheus
   - `grafana_1` - Grafana

4. **Testowanie aplikacji**:
   - Otwórz przeglądarkę i przejdź do `http://localhost:3000` 
     - **To jest główny adres całej aplikacji!** Frontend automatycznie komunikuje się z backendem przez Nginx proxy (`/api/*` → backend:8000)
   - Sprawdź dokumentację API bezpośrednio: `http://localhost:8000/docs` (Swagger UI)
   - Sprawdź metryki: `http://localhost:9090` (Prometheus)
   - Sprawdź dashboardy: `http://localhost:3001` (Grafana)

5. **Zatrzymanie aplikacji**:
   ```bash
   # Zatrzymanie (Ctrl+C w terminalu gdzie uruchomiono docker-compose)
   # Lub w nowym terminalu:
   docker-compose down
   ```

6. **Usunięcie danych i wolumenów** (opcjonalne):
   ```bash
   docker-compose down -v
   ```

### Uruchomienie w tle

Aby uruchomić aplikację w tle (detached mode):
```bash
docker-compose up -d --build
```

Sprawdzenie logów:
```bash
# Wszystkie serwisy
docker-compose logs -f

# Konkretny serwis
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 💻 Testowanie Lokalne

### Wymagania

- **Python 3.12** lub nowszy
- **Node.js 20** lub nowszy
- **npm** (zazwyczaj dołączony do Node.js)

### Backend (FastAPI)

1. **Przejdź do katalogu backend**:
   ```bash
   cd backend
   ```

2. **Utwórz wirtualne środowisko Python**:
   ```bash
   python -m venv venv
   ```

3. **Aktywuj wirtualne środowisko**:
   
   **Windows (PowerShell)**:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   **Windows (CMD)**:
   ```cmd
   venv\Scripts\activate.bat
   ```
   
   **Linux/macOS**:
   ```bash
   source venv/bin/activate
   ```

4. **Zainstaluj zależności**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Uruchom serwer backend**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   > **Uwaga**: Flaga `--reload` włącza automatyczne przeładowanie przy zmianach w kodzie.

6. **Weryfikacja**:
   - API: `http://localhost:8000`
   - Dokumentacja Swagger: `http://localhost:8000/docs`
   - Metryki Prometheus: `http://localhost:8000/metrics`

### Frontend (React + Vite)

1. **Otwórz nowy terminal** i przejdź do katalogu frontend:
   ```bash
   cd frontend
   ```

2. **Zainstaluj zależności**:
   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski**:
   ```bash
   npm run dev
   ```

4. **Weryfikacja**:
   - Aplikacja powinna być dostępna pod adresem wyświetlonym w terminalu (zazwyczaj `http://localhost:5173`)

### Monitoring (Opcjonalnie)

Aby uruchomić Prometheus i Grafana lokalnie, najlepiej użyć Docker:

```bash
# Z głównego katalogu projektu
docker-compose up prometheus grafana
```

---

## 🌐 Dostęp do Aplikacji

Po uruchomieniu (Docker lub lokalnie), aplikacja jest dostępna pod następującymi adresami:

| Serwis | URL | Opis |
|--------|-----|------|
| **Aplikacja (Docker)** | http://localhost:3000 | **Cała aplikacja** - Frontend + Backend API (przez proxy `/api/*`) |
| **Frontend (dev)** | http://localhost:5173 | Interfejs użytkownika (tylko lokalnie) |
| **Backend API (bezpośrednio)** | http://localhost:8000 | REST API (bezpośredni dostęp) |
| **Swagger UI** | http://localhost:8000/docs | Dokumentacja API |
| **ReDoc** | http://localhost:8000/redoc | Alternatywna dokumentacja API |
| **Prometheus** | http://localhost:9090 | System monitorowania |
| **Grafana** | http://localhost:3001 | Dashboardy i wizualizacje |

### Logowanie do Grafana

- **Użytkownik**: `admin`
- **Hasło**: `admin` (przy pierwszym logowaniu zostaniesz poproszony o zmianę)


## 📝 Dodatkowe Komendy

### Docker

```bash
# Przebuduj tylko jeden serwis
docker-compose build backend

# Uruchom tylko wybrane serwisy
docker-compose up frontend backend

# Wyświetl działające kontenery
docker-compose ps

# Zatrzymaj i usuń wszystko (kontenery, sieci, wolumeny)
docker-compose down -v --remove-orphans
```

### Backend

```bash
# Uruchom testy (jeśli są dostępne)
pytest

# Sprawdź style kodu
flake8 app/

# Formatowanie kodu
black app/
```

### Frontend

```bash
# Zbuduj wersję produkcyjną
npm run build

# Podgląd wersji produkcyjnej
npm run preview

# Sprawdź błędy ESLint
npm run lint
```

---

## 📚 Struktura Projektu

```
ToDoList/
├── backend/              # Backend FastAPI
│   ├── app/             # Kod aplikacji
│   ├── Dockerfile       # Obraz Docker dla backendu
│   └── requirements.txt # Zależności Python
├── frontend/            # Frontend React
│   ├── src/            # Kod źródłowy React
│   ├── Dockerfile      # Obraz Docker dla frontendu
│   ├── nginx.conf      # Konfiguracja Nginx
│   └── package.json    # Zależności npm
├── monitoring/          # Konfiguracja monitoringu
│   ├── prometheus.yml  # Konfiguracja Prometheus
│   └── alert.rules.yml # Reguły alertów
└── docker-compose.yml   # Orkiestracja wszystkich serwisów
```

---

