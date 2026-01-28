from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests

app = FastAPI()
s = requests.Session()
BASE = "http://10.42.0.20/"

@app.get("/api/ubnt/sta")
def sta():
    s.get(BASE + "login.cgi")
    s.post(BASE + "login.cgi", files={
        "username": (None, "ubnt"),
        "password": (None, "ubnt"),
        "uri": (None, "/"),
    })
    r = s.get(BASE + "sta.cgi")
    return r.json()[0]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/", StaticFiles(html=True))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "network_backend:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )