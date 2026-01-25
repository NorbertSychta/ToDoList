# ToDoList - Aplikacja do Zarządzania Zadaniami z Monitoringiem

- **Frontend**: React + Vite 
- **Backend**: FastAPI 
- **Monitoring**: Prometheus + Grafana
- **Docker**: Pełna konteneryzacja.


## 🐳 Testowanie za pomocą Docker 

1. **Git clone**:
   ```bash
   git clone https://github.com/NorbertSychta/ToDoList.git
   cd ToDoList
   ```

2. **Uruchom kontenery**:
   ```bash
   docker-compose up -d --build
   ```

3. **Otwórz w przeglądarce**:
   Przejdź do `http://localhost:3000`

4. **Zatrzymanie**:
   ```bash
   docker-compose down
   ```

---

## 💻 Testowanie Lokalne

### Wymagania
- Python 3.12+
- Node.js 20+
- Docker (opcjonalnie dla samego monitoringu)

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API dostępne pod: `http://localhost:8000`
Dokumentacja: `/docs`

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Aplikacja dostępna pod adresem wyświetlonym w terminalu (zazwyczaj `http://localhost:5173`).

---

## 🌐 Dostęp do Aplikacji

**ToDo App** http://localhost:3000 Główny adres aplikacji 
**Swagger UI** http://localhost:8000/docs Dokumentacja API i testowanie endpointów
**Prometheus** http://localhost:9090 System zbierania metryk i alertów
**Grafana** http://localhost:3001 Dashboardy i wizualizacja danych

### Dane logowania (Grafana):
- **User**: `admin`
- **Password**: `admin`

---

## 📊 Monitoring i Alerty

Aplikacja posiada wbudowany "ToDoList Dashboard" w Grafanie, który automatycznie pobiera dane z Prometheusa.

### Panele w Grafanie:
1. **Requests per Second**: Śledzi aktualne obciążenie serwera.
2. **P95 Latency**: Pokazuje czas odpowiedzi dla 95% żądań.
3. **HTTP Response Status**: Wykres kołowy pokazujący stosunek sukcesów do błędów.
4. **Total Tasks Created**: Licznik pokazujący ile zadań zostało faktycznie utworzonych.
5. **Service Uptime**: Czas od ostatniego restartu backendu.

### Aktywne Alerty (Prometheus):
- 🔴 **ServiceDown**: Backend nie odpowiada przez ponad 1 minutę.
- 🟡 **HighHttpRequestRate**: Nagły skok ruchu.
- 🟡 **SlowResponseTime**: API odpowiada wolniej niż 1s przez ostatnie 2 minuty.
