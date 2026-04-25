from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.utils import timezone


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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def clean(self):
        """Validation hook used by admin forms and serializers."""
        base_slug = slugify(self.name)
        if Category.objects.filter(slug=base_slug).exclude(pk=self.pk).exists():
            raise ValidationError({"name": f"A category with slug '{base_slug}' already exists."})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        # Run full validation before saving
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.get_name_display()

class Item(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='design_images/', blank=False, null=False)    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, blank=True)

    @property
    def current_price(self):
        """Return price after applying the latest valid discount, if any."""
        valid_discount = self.discounts.filter(active=True).order_by('-start_date').first()
        if valid_discount and valid_discount.is_valid():
            return valid_discount.apply_discount(self.price)
        return self.price



    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            # Ensure uniqueness
            while Item.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Discount(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]

    item = models.ForeignKey(
        'Item',
        on_delete=models.CASCADE,
        related_name='discounts'
    )
    discount_type = models.CharField(
        max_length=20,
        choices=DISCOUNT_TYPE_CHOICES
    )
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.discount_price} {self.get_discount_type_display()} for {self.item.name}"

    def is_valid(self):
        """Check if discount is currently active and within date range."""
        now = timezone.now()
        return self.active and (self.start_date <= now) and (
            not self.end_date or now <= self.end_date
        )

    def apply_discount(self, price):
        """Return the discounted price based on type."""
        if self.discount_type == 'percentage':
            return price - (price * (self.discount_price / 100))
        elif self.discount_type == 'fixed':
            return max(price - self.discount_price, 0)
        return price

