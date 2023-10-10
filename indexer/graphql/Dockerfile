FROM python:3.9-buster

WORKDIR /app

COPY src .
COPY poetry.lock .
COPY pyproject.toml .

RUN python3 -m pip install poetry
RUN python3 -m pip install pycryptodome
RUN poetry config virtualenvs.create false
RUN poetry install

ENTRYPOINT [ "indexer", "graphql", "--mongo_goerli", "mongodb://apibara:apibara@3.29.169.132:27017", "--port", "8080" ]
