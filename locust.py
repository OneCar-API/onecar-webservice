import time
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
  wait_time = between(1, 5)


  @task
  def create_ads(self):
    self.client.post(url='/ads')

  @task
  def import_ads(self):
    self.client.post(url='/ads/import')

  @task
  def list_ads(self):
    self.client.get(url='/ads')



