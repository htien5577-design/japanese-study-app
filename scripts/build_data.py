#!/usr/bin/env python3
"""Sinh data/*.js từ data/*.json (để mở index.html trực tiếp mà không cần server).

Cách dùng: sửa câu hỏi trong data/swt301.json hoặc data/jpd133.json rồi chạy
    python3 scripts/build_data.py
"""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
FILES = {"swt301": "swt", "jpd133": "jpd"}

for name, key in FILES.items():
    items = json.loads((DATA / f"{name}.json").read_text(encoding="utf-8"))
    lines = ",\n".join(json.dumps(x, ensure_ascii=False) for x in items)
    out = (
        f"/* Tạo tự động bởi scripts/build_data.py từ {name}.json. Đừng sửa tay. */\n"
        "window.QUIZ_DATA=window.QUIZ_DATA||{};\n"
        f"window.QUIZ_DATA.{key}=[\n{lines}\n];\n"
    )
    (DATA / f"{name}.js").write_text(out, encoding="utf-8")
    print(f"{name}: {len(items)} câu")
