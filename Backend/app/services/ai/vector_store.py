from __future__ import annotations

from typing import Any, Dict, List


class VectorStore:
    async def upsert(self, namespace: str, items: List[Dict[str, Any]]) -> None:
        raise NotImplementedError

    async def query(self, namespace: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        raise NotImplementedError


class InMemoryVectorStore(VectorStore):
    def __init__(self) -> None:
        self._store: Dict[str, List[Dict[str, Any]]] = {}

    async def upsert(self, namespace: str, items: List[Dict[str, Any]]) -> None:
        self._store.setdefault(namespace, []).extend(items)

    async def query(self, namespace: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        items = self._store.get(namespace, [])
        return items[:top_k]
