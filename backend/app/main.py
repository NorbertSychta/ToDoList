from fastapi import FastAPI

app = FastAPI(title="ToDoList API")

@app.get("/health")
def health():
    return {"status": "ok"}
