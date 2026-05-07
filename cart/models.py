from django.db import models
from django.contrib.auth.models import User
from item.models import Item
from django.db import models

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "item")
        indexes = [
            models.Index(fields=["cart"]),
            models.Index(fields=["item"])
        ]

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"

