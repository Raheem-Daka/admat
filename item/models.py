from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError

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
    discount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, blank=True)

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