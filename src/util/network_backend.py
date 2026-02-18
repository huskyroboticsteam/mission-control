from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests
import urllib3

# Custom Adapter to disable security because Rocket firmware is so old
class CustomHTTPAdapter(requests.adapters.HTTPAdapter):
    def __init__(self, ssl_context=None, **kwargs):
        self.ssl_context = ssl_context
        super().__init__(**kwargs)
    
    def init_poolmanager(self, connections, maxsize, block=False):
        self.poolmanager = urllib3.poolmanager.PoolManager(
            num_pools=connections, maxsize=maxsize,
            block=block, ssl_context=self.ssl_context)

app = FastAPI()
s = requests.Session()

# Downgrading security
ctx = urllib3.util.create_urllib3_context()
ctx.set_ciphers("DEFAULT@SECLEVEL=0")
ctx.check_hostname=False

# Adding custom adapter to https:// route
s.adapters.pop("https://", None)
s.mount("https://", CustomHTTPAdapter(ctx))

BASE = "https://10.42.0.4/"

@app.get("/api/ubnt/sta")
def sta():
    s.get(BASE + "login.cgi", verify=False)
    s.post(BASE + "login.cgi", verify=False, files={
        "username": (None, "ubnt"),
        "password": (None, "huskerRubbot3"),
        "uri": (None, "/"),
    })
    r = s.get(BASE + "sta.cgi", verify=False)
    return r.content

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