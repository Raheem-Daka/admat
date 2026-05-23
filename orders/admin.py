from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ("item", "quantity", "price", "subtotal")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]

    actions = ["mark_as_processing", "mark_as_delivered", "mark_as_cancelled"]

    # ✅ Actions
    def mark_as_processing(self, request, queryset):
        queryset.update(status="Processing")
    mark_as_processing.short_description = "Mark selected orders as Processing"

    def mark_as_delivered(self, request, queryset):
        queryset.update(status="Delivered")
    mark_as_delivered.short_description = "Mark selected orders as Delivered"

    def mark_as_cancelled(self, request, queryset):
        queryset.update(status="Cancelled")
    mark_as_cancelled.short_description = "Mark selected orders as Cancelled"

    # ✅ Colored status
    def colored_status(self, obj):
        colors = {
            "Pending": "gray",
            "Processing": "orange",
            "Delivered": "green",
            "Cancelled": "red",
        }
        return format_html(
            '<b style="color:{};">{}</b>',
            colors.get(obj.status, "black"),
            obj.status,
        )
    colored_status.short_description = "Status"

    # ✅ Display
    list_display = (
        "id",
        "user",
        "full_name",
        "phone",
        "colored_status",
        "payment_method",
        "total",
        "created_at",
    )

    # ✅ Filters
    list_filter = (
        "status",
        "payment_method",
        "created_at",
    )

    # ✅ Search
    search_fields = (
        "id",
        "user__username",
        "full_name",
        "phone",
    )

    ordering = ("-created_at",)

    # ✅ Protect fields
    readonly_fields = (
        "user",
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