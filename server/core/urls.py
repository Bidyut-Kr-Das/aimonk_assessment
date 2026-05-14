from django.urls import path
from .views import NodeView

urlpatterns = [ 
    path("node/", NodeView.as_view())
]