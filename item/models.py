from django.db import models
from django.db.models import F
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal, ROUND_HALF_UP
import os


class Category(models.Model):
    FURNITURE_CATEGORY_CHOICES = [
        ('sofa', 'Sofa'),
        ('armchair', 'Armchair'),
        ('dining_table', 'Dining Table'),
        ('coffee_table', 'Coffee Table'),
        ('bed', 'Bed'),
        ('dresser', 'Dresser'),
        ('wardrobe', 'Wardrobe'),
        ('desk', 'Desk'),
        ('bookshelf', 'Bookshelf'),
        ('tv_stand', 'TV Stand'),
        ('nightstand', 'Nightstand'),
        ('recliner', 'Recliner'),
        ('bench', 'Bench'),
        ('bar_stool', 'Bar Stool'),
        ('ottoman', 'Ottoman'),
    ]

    name = models.CharField(max_length=100, choices=FURNITURE_CATEGORY_CHOICES)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="category_images/"),
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_name_display()


class Item(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to="design_images/", blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    slug = models.SlugField(unique=True, blank=True)

    purchase_count = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def current_price(self):
        valid_discounts = [
            d for d in self.discounts.all() if d.is_valid()
        ]

        if not valid_discounts:
            return self.price.quantize(Decimal("0.01"))

        # ✅ get lowest resulting price
        best_price = min(
            d.apply_discount(self.price) for d in valid_discounts
        )

        return best_price.quantize(Decimal("0.01"))
    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Item.objects.filter(slug=slug).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

        if self.image and hasattr(self.image, "path"):
            if not os.path.exists(self.image.path):
                self.image = None        
                super().save(update_fields=["image"])

    def __str__(self):
        return self.name


class ItemImages(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="item_images/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name_plural = "Item Images"

    def clean(self):
        if not self.pk and self.item.images.count() >= 5:
            raise ValidationError("An item can have a maximum of 5 images.")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        self.full_clean()
        super().save(*args, **kwargs)

        if is_new and not self.item.image:
            self.item.image = self.image
            self.item.save(update_fields=["image"])

    def delete(self, *args, **kwargs):
        was_main = self.item.image == self.image
        super().delete(*args, **kwargs)

        if was_main:
            next_image = self.item.images.first()
            self.item.image = next_image.image if next_image else None
            self.item.save(update_fields=["image"])


class Discount(models.Model):
    class Meta:
        ordering = ["-start_date"]
        
    DISCOUNT_TYPE_CHOICES = [
        ("percentage", "Percentage"),
        ("fixed", "Fixed Amount"),
    ]

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="discounts")
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField(default=True)

    def is_valid(self):
        now = timezone.now()
        if not self.active:
            return False
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True

    def apply_discount(self, price):
        price = Decimal(price)

        if self.discount_type == "percentage":
            percent = min(max(self.discount_price, Decimal("0")), Decimal("100"))
            discounted = price - (price * percent / Decimal("100"))

        elif self.discount_type == "fixed":
            discounted = max(price - self.discount_price, Decimal("0"))

        else:
            discounted = price

        return max(discounted, Decimal("0")).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

    def clean(self):
        if self.discount_type == "percentage":
            if self.discount_price < 0 or self.discount_price > 100:
                raise ValidationError("Percentage discount must be between 0 and 100")

        elif self.discount_type == "fixed":
            if self.discount_price < 0:
                raise ValidationError("Fixed discount cannot be negative")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)