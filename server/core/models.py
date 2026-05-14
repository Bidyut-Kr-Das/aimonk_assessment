from django.db import models

# Create your models here.

class Node(models.Model):
    id= models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    data=models.CharField(max_length=200, blank=True, null=True)
    parent=models.ForeignKey(
        to="self",
        to_field="id",
        null=True,
        on_delete=models.CASCADE
        
    )

    def __str__(self):
        return self.name
