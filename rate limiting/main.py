from fastapi.requests import Request
from datetime import datetime, timedelta

rate_limit_store = {}  # IP: [timestamp1, timestamp2, ...]
RATE_LIMIT = 5
WINDOW = timedelta(minutes=1)
