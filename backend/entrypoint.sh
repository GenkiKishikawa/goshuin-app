#!/bin/bash

# 依存関係のインストール
poetry install --no-root

# データベースマイグレーション
# poetry run alembic upgrade head

# Uvicornでアプリケーションを起動
poetry run uvicorn app.main:app --host 0.0.0.0 --reload