from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ("item", "quantity", "price", "subtotal")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]

    list_display = (
        "id",
        "user",
        "status",
        "payment_method",
        "total",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_method",
        "created_at",
    )

    search_fields = (
        "id",
        "user__username",
        "full_name",
        "phone",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "subtotal",
        "delivery_fee",
        "total",
        "created_at",
        "updated_at",
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "item", "quantity", "price", "subtotal")
    list_filter = ("order",)