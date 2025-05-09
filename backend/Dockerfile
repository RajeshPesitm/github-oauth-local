FROM python:3.10

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /app/app

COPY wait-for-db.py /app/wait-for-db.py

CMD ["sh", "-c", "python wait-for-db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
