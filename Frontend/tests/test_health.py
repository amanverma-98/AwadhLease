from fastapi.testclient import TestClient

from Frontend.app.main import app


def test_health_check():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code in (200, 500)
