from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from contextlib import asynccontextmanager
from .models import TaskCreate
from .db import init_db
from .db import get_conn
from .models import TaskOut
from .models import TaskUpdate
from fastapi import HTTPException


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    init_db()
    yield


app = FastAPI(
    title="ToDoList API",
    lifespan=lifespan
)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tasks", response_model=list[TaskOut])
def list_tasks():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM tasks ORDER BY id DESC").fetchall()
    conn.close()
    return [
        TaskOut(
            id=r["id"],
            title=r["title"],
            description=r["description"],
            completed=bool(r["completed"]),
        )
        for r in rows
    ]

@app.post("/tasks", response_model=TaskOut, status_code=201)
def create_task(payload: TaskCreate):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO tasks(title, description, completed) VALUES (?, ?, 0)",
        (payload.title, payload.description),
    )
    conn.commit()
    task_id = cur.lastrowid
    row = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    conn.close()

    return TaskOut(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        completed=bool(row["completed"]),
    )


@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE tasks
        SET title = ?, description = ?, completed = ?
        WHERE id = ?
        """,
        (payload.title, payload.description, int(payload.completed), task_id),
    )

    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    conn.commit()
    row = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    conn.close()

    return TaskOut(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        completed=bool(row["completed"]),
    )

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    conn.commit()
    conn.close()


